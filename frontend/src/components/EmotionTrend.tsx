'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { EMOTIONS, EMOTION_COLORS, TrendPoint } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EmotionTrendProps {
  data: TrendPoint[]
  className?: string
}

export function EmotionTrend({ data, className }: EmotionTrendProps) {
  const hasData = data.some((point) => EMOTIONS.some((e) => (point[e] || 0) > 0))

  return (
    <div className={cn('w-full', className)}>
      {hasData ? (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:opacity-20" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              minTickGap={30}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip
              formatter={(value, name) => [`${Math.round(Number(value))}%`, name]}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 12,
                background: '#fff',
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={7} />
            {EMOTIONS.map((emotion) => (
              <Line
                key={emotion}
                type="monotone"
                dataKey={emotion}
                stroke={EMOTION_COLORS[emotion]}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[180px] flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
          <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3v18h18M7 14l3-4 3 3 5-6" />
          </svg>
          <p className="text-sm">No trend data yet</p>
          <p className="text-xs mt-1">Emotion percentages will appear over time</p>
        </div>
      )}
    </div>
  )
}