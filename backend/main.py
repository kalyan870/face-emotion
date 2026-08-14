import base64
import json
import logging
import os
import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional

import cv2
import numpy as np
import mediapipe as mp
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Face Emotion Recognition API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "face_landmarker.task")
MODEL_URL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"


def ensure_model() -> str:
    if os.path.exists(MODEL_PATH):
        return MODEL_PATH
    logger.info("Downloading face_landmarker.task...")
    import urllib.request

    urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
    logger.info("Model downloaded")
    return MODEL_PATH

EMOTION_LABELS = ["Happy", "Sad", "Angry", "Surprise", "Fear", "Disgust", "Neutral"]

EMOTION_EMOJI = {
    "Happy": "😀",
    "Sad": "😢",
    "Angry": "😠",
    "Surprise": "😲",
    "Fear": "😨",
    "Disgust": "🤢",
    "Neutral": "😐",
}


@dataclass
class FaceResult:
    landmarks: List[Dict[str, float]] = field(default_factory=list)
    blendshapes: Dict[str, float] = field(default_factory=dict)
    bbox: Dict[str, int] = field(default_factory=dict)
    emotion: str = "Neutral"
    confidence: float = 0.5
    emoji: str = "😐"


class FaceEmotionEngine:
    def __init__(self, model_path: str):
        base_options = mp_python.BaseOptions(model_asset_path=model_path)
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.VIDEO,
            output_face_blendshapes=True,
            output_facial_transformation_matrixes=True,
            num_faces=5,
            min_face_detection_confidence=0.4,
            min_face_presence_confidence=0.4,
            min_tracking_confidence=0.4,
        )
        self.landmarker = vision.FaceLandmarker.create_from_options(options)

    def _mp_image(self, frame: np.ndarray, timestamp_ms: int):
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        rgb = np.ascontiguousarray(rgb)
        return mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb), timestamp_ms

    @staticmethod
    def _classify_emotion(bs: Dict[str, float]) -> tuple:
        smile = (bs.get("mouthSmileLeft", 0) + bs.get("mouthSmileRight", 0)) / 2
        frown = (bs.get("mouthFrownLeft", 0) + bs.get("mouthFrownRight", 0)) / 2
        jaw_open = bs.get("jawOpen", 0)
        brow_down = (bs.get("browDownLeft", 0) + bs.get("browDownRight", 0)) / 2
        brow_up = bs.get("browInnerUp", 0)
        eye_open = (bs.get("eyeWideLeft", 0) + bs.get("eyeWideRight", 0)) / 2
        eye_squint = (bs.get("eyeSquintLeft", 0) + bs.get("eyeSquintRight", 0)) / 2
        cheek_puff = bs.get("cheekPuff", 0)
        neutral = bs.get("_neutral", 0)

        scores = {
            "Happy": smile * 0.9,
            "Surprise": (jaw_open * 0.6 + brow_up * 0.3 + eye_open * 0.1),
            "Angry": (brow_down * 0.6 + eye_squint * 0.4),
            "Sad": (frown * 0.5 + brow_up * 0.2 + (1 - smile) * 0.3),
            "Disgust": (cheek_puff * 0.7 + frown * 0.3),
            "Fear": (eye_open * 0.6 + brow_up * 0.4),
            "Neutral": neutral * 0.8,
        }

        emotion = max(scores, key=scores.get)
        score = scores[emotion]
        confidence = max(0.0, min(1.0, score))
        if confidence < 0.15:
            emotion = "Neutral"
            confidence = max(neutral, 0.4)
        return emotion, confidence

    def process_frame(self, frame: np.ndarray, timestamp_ms: int = 0) -> List[FaceResult]:
        mp_img, ts = self._mp_image(frame, timestamp_ms)
        results = self.landmarker.detect_for_video(mp_img, ts)

        h, w = frame.shape[:2]
        faces: List[FaceResult] = []

        if results.face_landmarks is None:
            return faces

        for idx, landmarks in enumerate(results.face_landmarks):
            face = FaceResult()
            xs, ys = [], []
            for lm in landmarks:
                face.landmarks.append({"x": lm.x, "y": lm.y, "z": lm.z})
                xs.append(lm.x)
                ys.append(lm.y)

            x_min = int(min(xs) * w)
            x_max = int(max(xs) * w)
            y_min = int(min(ys) * h)
            y_max = int(max(ys) * h)

            pad = 15
            face.bbox = {
                "x": max(0, x_min - pad),
                "y": max(0, y_min - pad),
                "width": min(w, x_max + pad) - max(0, x_min - pad),
                "height": min(h, y_max + pad) - max(0, y_min - pad),
            }

            if results.face_blendshapes and idx < len(results.face_blendshapes):
                bs = {cat.category_name: cat.score for cat in results.face_blendshapes[idx]}
                face.blendshapes = bs
                face.emotion, face.confidence = self._classify_emotion(bs)
            else:
                face.emotion, face.confidence = "Neutral", 0.4

            face.emoji = EMOTION_EMOJI.get(face.emotion, "😐")
            faces.append(face)

        return faces


engine = None


@app.on_event("startup")
def load_engine():
    global engine
    try:
        model_path = ensure_model()
        engine = FaceEmotionEngine(model_path)
        logger.info("Face Emotion Engine loaded")
    except Exception as e:
        logger.error(f"Failed to load engine: {e}")
        engine = None


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"Client disconnected. Total: {len(self.active_connections)}")


manager = ConnectionManager()


@app.get("/")
async def root():
    return {
        "message": "Face Emotion Recognition API",
        "status": "running",
        "model_loaded": engine is not None,
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": engine is not None}


def decode_base64_image(base64_string: str) -> Optional[np.ndarray]:
    try:
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
        img_data = base64.b64decode(base64_string)
        np_arr = np.frombuffer(img_data, np.uint8)
        return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception as e:
        logger.error(f"Error decoding image: {e}")
        return None


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            if message.get("type") == "frame":
                image_data = message.get("data", "")
                if not image_data:
                    continue

                frame = decode_base64_image(image_data)
                if frame is None:
                    continue

                timestamp_ms = int(time.monotonic() * 1000)
                if engine is None:
                    await websocket.send_json({"type": "results", "faces": [], "timestamp": message.get("timestamp", 0)})
                    continue

                try:
                    faces = engine.process_frame(frame, timestamp_ms=timestamp_ms)
                except Exception as e:
                    logger.error(f"Frame processing error: {e}")
                    faces = []

                response = {
                    "type": "results",
                    "faces": [
                        {
                            "landmarks": face.landmarks,
                            "bbox": face.bbox,
                            "emotion": face.emotion,
                            "confidence": face.confidence,
                            "emoji": face.emoji,
                        }
                        for face in faces
                    ],
                    "timestamp": message.get("timestamp", 0),
                }
                await websocket.send_json(response)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)


@app.post("/analyze")
async def analyze_image(file: bytes):
    if engine is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    np_arr = np.frombuffer(file, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if frame is None:
        raise HTTPException(status_code=400, detail="Invalid image")

    faces = engine.process_frame(frame)
    return {
        "faces": [
            {
                "bbox": face.bbox,
                "emotion": face.emotion,
                "confidence": face.confidence,
                "emoji": face.emoji,
            }
            for face in faces
        ]
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)