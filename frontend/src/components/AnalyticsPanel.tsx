'use client'

import { useMemo } from 'react'
import { Download, Trash2, Activity, Gauge, TrendingUp, Timer } from 'lucide-react'
import { DetectionRecord, EMOTIONS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface AnalyticsPanelProps {
  records: DetectionRecord[]
  sessionStart: number | null
  onClear: () => void
  className?: string
}

function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export function AnalyticsPanel({ records, sessionStart, onClear, className }: AnalyticsPanelProps) {
  const stats = useMemo(() => {
    if (records.length === 0) {
      return { total: 0, avgConfidence: 0, topEmotion: '—', topCount: 0, duration: '0s' }
    }
    const totalConf = records.reduce((sum, r) => sum + r.confidence, 0)
    const counts = EMOTIONS.reduce<Record<string, number>>((acc, e) => ({ ...acc, [e]: 0 }), {})
    records.forEach((r) => {
      counts[r.emotion] = (counts[r.emotion] || 0) + 1
    })
    const top = EMOTIONS.reduce((max, e) => (counts[e] > (counts[max] || 0) ? e : max), EMOTIONS[0])
    const duration = sessionStart ? formatDuration(Date.now() - sessionStart) : '0s'
    return {
      total: records.length,
      avgConfidence: Math.round((totalConf / records.length) * 100),
      topEmotion: counts[top] > 0 ? top : '—',
      topCount: counts[top] || 0,
      duration,
    }
  }, [records, sessionStart])

  const exportCsv = () => {
    const header = 'timestamp,emotion,confidence'
    const rows = records.map((r) => `${new Date(r.timestamp).toISOString()},${r.emotion},${r.confidence.toFixed(4)}`)
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `face-emotion-session-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `face-emotion-session-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const items = [
    {
      icon: Activity,
      label: 'Total detections',
      value: stats.total.toString(),
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      icon: Gauge,
      label: 'Avg confidence',
      value: `${stats.avgConfidence}%`,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: TrendingUp,
      label: 'Most frequent',
      value: stats.topEmotion,
      sub: stats.topCount > 0 ? `${stats.topCount}x` : undefined,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: Timer,
      label: 'Session duration',
      value: stats.duration,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
  ]

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-800/40">
            <div className={cn('flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0', item.bg)}>
              <item.icon className={cn('w-4 h-4', item.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">{item.label}</p>
              <p className={cn('font-semibold text-sm text-gray-900 dark:text-white capitalize truncate', item.sub && 'inline')}>
                {item.value}
              </p>
              {item.sub && (
                <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">{item.sub}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={exportCsv}
          disabled={records.length === 0}
          className="flex-1 btn-secondary text-xs"
        >
          <Download className="w-3 h-3" />
          Export CSV
        </button>
        <button
          onClick={exportJson}
          disabled={records.length === 0}
          className="flex-1 btn-secondary text-xs"
        >
          <Download className="w-3 h-3" />
          Export JSON
        </button>
        <button
          onClick={onClear}
          disabled={records.length === 0}
          className="btn-ghost text-xs !text-red-600 dark:!text-red-400"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>
    </div>
  )
}