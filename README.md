# Face Emotion AI

Face Emotion AI is a real-time computer vision web application that detects faces through a webcam, tracks facial landmarks, analyzes facial expressions, and provides real-time emotion analytics.

The application combines **Next.js, React, TypeScript, Python, FastAPI, MediaPipe, and Recharts** to create an interactive AI-powered dashboard.

## Live Demo

- **Frontend:** [face-emotion-frontend.vercel.app](https://face-emotion-frontend.vercel.app)
- **Backend:** [face-emotion-backend-q6ra.onrender.com](https://face-emotion-backend-q6ra.onrender.com)

## Features

- Real-time webcam face detection
- 468 facial landmark detection
- Real-time facial expression analysis
- Seven emotion categories: Happy, Sad, Angry, Surprise, Fear, Disgust, and Neutral
- Emotion confidence scores
- Real-time FPS and latency monitoring
- Frame and face counting
- Emotion distribution and trend charts
- Recent detection history and session analytics
- CSV and JSON export
- Clear session data
- Privacy-focused local processing

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI

### AI and Computer Vision

- MediaPipe Face Landmarker
- 468 facial landmarks
- Real-time face tracking

### Data Visualization and Browser APIs

- Recharts
- WebRTC
- `getUserMedia()`
- Webcam API
- Canvas and Video APIs

## How It Works

1. **Webcam input** — the browser captures the live video stream.
2. **Face detection** — incoming frames are processed to detect faces in real time.
3. **Facial landmarks** — MediaPipe tracks 468 landmarks for each detected face.
4. **Feature analysis** — landmark data is analyzed for expression-related features.
5. **Emotion recognition** — the expression is classified into one of seven emotions.
6. **Real-time dashboard** — emotion, confidence, FPS, latency, frames, and face count are displayed.
7. **Analytics** — the dashboard provides distributions, trends, recent detections, and session statistics.
8. **Data export** — detection information can be exported as CSV or JSON.

## Dashboard

- **Live detection:** webcam preview, face detection, landmarks, current emotion, and confidence
- **Emotion analytics:** distribution, trends, recent detections, and session statistics
- **Performance monitoring:** FPS, latency, processed frames, detected faces, and connection status
- **Data management:** detection history, CSV export, JSON export, and session clearing

## Installation

### Prerequisites

- Node.js and npm
- Python and pip
- Git
- A modern web browser
- A webcam

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and allow camera access when requested.

### Backend setup

```bash
cd backend
python -m venv venv
```

On Windows:

```powershell
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

Then install and run the API:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## Project Structure

```text
face-emotion/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── render.yaml
├── frontend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── images/
└── README.md
```

## Deployment

The backend is deployed on Render and the frontend is deployed on Vercel. The frontend uses the `NEXT_PUBLIC_BACKEND_URL` environment variable to connect to the Render WebSocket API.

The MediaPipe model is downloaded automatically by the backend at startup.

## Privacy and Limitations

The core computer-vision processing is designed to run locally in the browser. The live webcam feed does not need to be uploaded to an external AI service for the core face-landmark detection experience.

This project estimates visible facial expressions; it should not be considered a definitive measurement of a person's internal emotional state. Results can vary with lighting, camera angle, facial position, camera quality, occlusion, and expression intensity.

## Applications

- Human-computer interaction
- Accessibility applications
- Educational technology
- Customer experience prototypes
- Computer vision demonstrations
- AI/ML projects
- Hackathons and research prototypes

## Future Improvements

- Improved emotion models
- Multi-face analytics
- Persistent database storage
- Historical session comparison
- PDF report generation
- Mobile optimization
- Improved low-light detection
- Advanced analytics

## Project Screenshots and Architecture

<h3>1. Project Overview</h3>
<img src="https://raw.githubusercontent.com/kalyan870/face-emotion/main/docs/images/project-overview.png?v=4" alt="Project Overview" width="100%" />

<h3>2. Application Architecture</h3>
<img src="https://raw.githubusercontent.com/kalyan870/face-emotion/main/docs/images/application-architecture.png?v=4" alt="Application Architecture" width="100%" />

<h3>3. Final Architecture</h3>
<img src="https://raw.githubusercontent.com/kalyan870/face-emotion/main/docs/images/final-architecture.png?v=4" alt="Final Architecture" width="100%" />
## License

MIT License

## Author

Kalyan

**Face Emotion AI — Real-Time Facial Emotion Recognition & Analytics Dashboard**