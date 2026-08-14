'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface EmotionBadgeProps {
  emotion: string
  confidence: number
  icon: React.ComponentType<{ className?: string }>
  colorClass: string
  className?: string
}

export const EmotionBadge = forwardRef<HTMLSpanElement, EmotionBadgeProps>(
  ({ emotion, confidence, icon: Icon, colorClass, className }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border',
        colorClass,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      <span className="capitalize">{emotion}</span>
      <span className="font-mono font-semibold">{Math.round(confidence * 100)}%</span>
    </span>
  )
)

EmotionBadge.displayName = 'EmotionBadge'