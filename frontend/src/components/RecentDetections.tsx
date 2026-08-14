'use client'

import { useState } from 'react'
import { Eye, Clock, ChevronRight, ChevronLeft } from 'lucide-react'
import { DetectionRecord, EMOTION_COLORS } from '@/lib/types'
import { cn } from '@/lib/utils'

interface RecentDetectionsProps {
  records: DetectionRecord[]
  className?: string
}

const PAGE_SIZE = 5

export function RecentDetections({ records, className }: RecentDetectionsProps) {
  const [viewAll, setViewAll] = useState(false)
  const [page, setPage] = useState(0)

  const visible = viewAll ? records : records.slice(0, 4)
  const pageCount = Math.max(1, Math.ceil(records.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const paged = viewAll ? records.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE) : visible

  const fmtTime = (ts: number) => {
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  if (records.length === 0) {
    return (
      <div className={cn('text-center py-8 text-gray-400 dark:text-gray-600', className)}>
        <Eye className="w-10 h-10 mx-auto mb-2" />
        <p className="text-sm">No detections recorded yet</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {paged.map((record) => (
        <div key={record.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-dark-800/40 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
          {record.thumbnail ? (
            <img
              src={record.thumbnail}
              alt="Face"
              className="w-11 h-11 rounded-lg object-cover flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700"
            />
          ) : (
            <div
              className="w-11 h-11 rounded-lg flex-shrink-0 ring-1 ring-gray-200 dark:ring-gray-700"
              style={{ background: EMOTION_COLORS[record.emotion] + '22' }}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{record.emotion}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {fmtTime(record.timestamp)}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-mono font-semibold text-sm text-primary-600 dark:text-primary-400">
              {Math.round(record.confidence * 100)}%
            </p>
            <div className="w-16 h-1 mt-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ml-auto">
              <div
                className="h-full rounded-full"
                style={{ width: `${record.confidence * 100}%`, background: EMOTION_COLORS[record.emotion] }}
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-1">
        {records.length > 4 ? (
          <>
            <button
              onClick={() => setViewAll((v) => !v)}
              className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
            >
              {viewAll ? 'Show less' : `View All (${records.length})`}
            </button>
            {viewAll && pageCount > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {currentPage + 1} / {pageCount}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={currentPage === pageCount - 1}
                  className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-600">{records.length} detections</span>
        )}
      </div>
    </div>
  )
}