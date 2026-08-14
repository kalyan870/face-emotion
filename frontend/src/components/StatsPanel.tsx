'use client'

import { cn } from '@/lib/utils'

interface StatsPanelProps {
  stats: {
    fps: number
    latency: number
    framesProcessed: number
    facesDetected: number
  }
  className?: string
}

export function StatsPanel({ stats, className }: StatsPanelProps) {
  const statItems = [
    { label: 'FPS', value: stats.fps, unit: '' },
    { label: 'Latency', value: stats.latency, unit: 'ms' },
    { label: 'Frames', value: stats.framesProcessed, unit: '' },
    { label: 'Faces', value: stats.facesDetected, unit: '' },
  ]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {statItems.map((stat, i) => (
        <div key={i} className="hidden sm:flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-dark-800/50 border border-gray-200/50 dark:border-gray-700/50">
          <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">{stat.value}</span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}