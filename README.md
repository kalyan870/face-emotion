# Face Emotion Recognition

Real-time face detection and emotion recognition powered by AI. Built for hackathons with a modern, clean UI.

![Demo](https://img.shields.io/badge/Status-Ready%20for%20Hackathon-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Face%20Mesh-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)

## Features

- **Real-time face detection** using MediaPipe Face Mesh (468 landmarks)
- **7 emotion classification**: Happy, Sad, Angry, Surprise, Fear, Disgust, Neutral
- **Low-latency WebSocket streaming** for real-time processing
- **Modern, responsive UI** with Tailwind CSS and dark mode support
- **Privacy-first**: All processing happens locally on your machine
- **Hackathon-ready**: Clean codebase, well-documented, easy to extend

## Tech Stack

### Frontend
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **WebSocket** for real-time communication

### Backend
- **FastAPI** for high-performance API
- **MediaPipe** for face mesh detection
- **OpenCV** for image processing
- **WebSockets** for low-latency streaming
- **Heuristic-based emotion detection** (no ML model required)

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Webcam

### Automated Setup (Windows PowerShell)
```powershell
# Run as Administrator
cd C:\Users\KALYAN\Projects\face-emotion
.\start.ps1
```

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Project Structure

```
face-emotion/
├── backend/
│   ├── main.py              # FastAPI app with WebSocket endpoint
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css  # Tailwind + custom styles
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── page.tsx     # Main page with video feed
│   │   ├── components/
│   │   │   ├── ConnectionStatus.tsx
│   │   │   ├── EmotionBadge.tsx
│   │   │   ├── FaceOverlay.tsx
│   │   │   └── StatsPanel.tsx
│   │   ├── lib/
│   │   │   └── utils.ts     # Utility functions
│   │   └── hooks/           # Custom React hooks
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── start.ps1                # Windows startup script
��── README.md
```

## API Endpoints

### WebSocket
```
ws://localhost:8000/ws
```
Send base64-encoded JPEG frames:
```json
{
  "type": "frame",
  "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...",
  "timestamp": 1234567890
}
```

Receive emotion results:
```json
{
  "type": "results",
  "faces": [
    {
      "landmarks": [...],
      "bbox": {"x": 100, "y": 50, "width": 200, "height": 200},
      "emotion": "Happy",
      "confidence": 0.85
    }
  ],
  "timestamp": 1234567890
}
```

### REST
```
POST /analyze
```
Upload an image file for batch processing.

## Extending the Project

### Add Custom Emotion Model
1. Train a model on FER2013 or similar dataset
2. Save as `emotion_model.h5` in backend folder
3. The backend will auto-detect and use it

### Add More Emotions
1. Update `EMOTION_LABELS` in `main.py`
2. Add colors/icons in `page.tsx`
3. Retrain model if using custom

## Deploy to Cloud

This app has two deployable parts. The model file is auto-downloaded on backend startup, so nothing large is committed.

### 1. Backend (Render / Railway)

**Render** (free tier, easiest):
1. Push this repo to GitHub
2. In Render → **New → Web Service**, connect the repo
3. Root directory: `backend`, Runtime: `Python 3`
4. Build: `pip install -r requirements.txt`
5. Start: `uvicorn main:app --host 0.0.0.0 --port 10000`
6. Health check path: `/health`

A `backend/render.yaml` blueprint is included for one-click deploy:
1. Render → **New → Blueprint**, connect repo, choose `render.yaml`

**Railway**:
- Root directory: `backend`, Build: `pip install -r requirements.txt`
- Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2. Frontend (Vercel)
1. In Vercel → **Add New → Project**, connect repo, root directory: `frontend`
2. Add environment variable: `NEXT_PUBLIC_BACKEND_URL=<your-backend-hostname>` (e.g. `face-emotion-backend.onrender.com`, **no** `http://` and **no** trailing slash)
3. Deploy. The app automatically uses `wss://` on https and `ws://` on http.

> If the variable is missing, it falls back to `localhost:8000` for local dev.

### Local dev with a remote backend
```bash
cd frontend
$env:NEXT_PUBLIC_BACKEND_URL="face-emotion-backend.onrender.com"
npm run dev
```

## Hackathon Tips

1. **Demo Preparation**: Record a 30-second video of the app working
2. **Unique Angle**: Emphasize privacy (local processing) and real-time performance
3. **Extensions to Impress**:
   - Add emotion history timeline
   - Multi-face emotion comparison
   - Export session data as CSV/JSON
   - Add voice feedback for emotions
   - Integrate with a chatbot for empathetic responses

## License

MIT License - Feel free to use for hackathons and personal projects!

## Contributing

PRs welcome! Please read the code style guidelines in each folder before contributing.