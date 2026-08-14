export interface FaceData {
  landmarks: Array<{ x: number; y: number; z: number }>
  bbox: { x: number; y: number; width: number; height: number }
  emotion: string
  confidence: number
  emoji?: string
}

export interface DetectionRecord {
  id: number
  emotion: string
  confidence: number
  timestamp: number
  thumbnail?: string
}

export interface TrendPoint {
  time: string
  timestamp: number
  Happy: number
  Sad: number
  Angry: number
  Surprise: number
  Fear: number
  Disgust: number
  Neutral: number
}

export const EMOTIONS = ['Happy', 'Sad', 'Angry', 'Surprise', 'Fear', 'Disgust', 'Neutral'] as const

export const EMOTION_COLORS: Record<string, string> = {
  Happy: '#f59e0b',
  Sad: '#3b82f6',
  Angry: '#ef4444',
  Surprise: '#a855f7',
  Fear: '#f97316',
  Disgust: '#22c55e',
  Neutral: '#64748b',
}