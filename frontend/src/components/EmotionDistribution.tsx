'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { EMOTIONS, EMOTION_COLORS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EmotionDistributionProps {
  counts: Record<string, number>
  total: number
  className?: string
}

export function EmotionDistribution({ counts, total, className }: EmotionDistributionProps) {
  const data = EMOTIONS.map((emotion) => ({
    name: emotion,
    value: counts[emotion] || 0,
    color: EMOTION_COLORS[emotion],
  })).filter((d) => d.value > 0)

  const maxEmotion = EMOTIONS.reduce(
    (max, e) => ((counts[e] || 0) > (counts[max] || 0) ? e : max),
    EMOTIONS[0]
  )
  const maxCount = counts[maxEmotion] || 0

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total detections</span>
        <span className="px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-mono font-semibold text-sm">
          {total}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-44 w-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} (${total ? Math.round((Number(value) / total) * 100) : 0}%)`, name]}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: 12,
                  background: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{total}</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">Faces</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5 min-w-0">
          {EMOTIONS.map((emotion) => {
            const value = counts[emotion] || 0
            const pct = total ? (value / total) * 100 : 0
            return (
              <div key={emotion} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: EMOTION_COLORS[emotion] }} />
                <span className="w-16 flex-shrink-0 text-gray-600 dark:text-gray-300">{emotion}</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-dark-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: EMOTION_COLORS[emotion] }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-gray-500 dark:text-gray-400">
                  {value}
                  {emotion === maxEmotion && maxCount > 0 && (
                    <span className="ml-1 text-[10px] text-primary-500 font-semibold">top</span>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}