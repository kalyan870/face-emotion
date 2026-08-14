'use client'

import { Wifi, WifiOff, Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConnectionStatusProps {
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
  className?: string
}

export function ConnectionStatus({ status, className }: ConnectionStatusProps) {
  const statusConfig = {
    connecting: {
      icon: Loader2,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
      label: 'Connecting...',
      animate: 'animate-spin',
    },
    connected: {
      icon: Wifi,
      color: 'text-green-500',
      bg: 'bg-green-500/10 border-green-500/20',
      label: 'Connected',
      animate: '',
    },
    disconnected: {
      icon: WifiOff,
      color: 'text-gray-500',
      bg: 'bg-gray-500/10 border-gray-500/20',
      label: 'Disconnected',
      animate: '',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10 border-red-500/20',
      label: 'Connection Error',
      animate: '',
    },
  }

  const config = statusConfig[status]

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border', config.bg, className)}>
      <config.icon className={cn('w-3 h-3', config.color, config.animate)} />
      <span className={config.color}>{config.label}</span>
    </span>
  )
}