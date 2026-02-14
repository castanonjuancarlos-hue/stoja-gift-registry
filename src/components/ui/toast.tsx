'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  message: string
  description?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
}

const colors = {
  success: 'bg-green-50 border-green-200 text-green-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900'
}

const iconColors = {
  success: 'text-green-600',
  error: 'text-red-600',
  info: 'text-blue-600',
  warning: 'text-yellow-600'
}

function ToastItem({ toast, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const Icon = icons[toast.type]

  useEffect(() => {
    const duration = toast.duration || 5000
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onClose(toast.id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  return (
    <div
      className={`
        ${colors[toast.type]}
        ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}
        max-w-md w-full border rounded-lg shadow-lg p-4 mb-4
        flex items-start space-x-3
      `}
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[toast.type]}`} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{toast.message}</p>
        {toast.description && (
          <p className="text-sm opacity-90 mt-1">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(() => onClose(toast.id), 300)
        }}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto space-y-2">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </div>
    </div>
  )
}

// Hook para usar toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return {
    toasts,
    addToast,
    removeToast,
    success: (message: string, description?: string) =>
      addToast({ type: 'success', message, description }),
    error: (message: string, description?: string) =>
      addToast({ type: 'error', message, description }),
    info: (message: string, description?: string) =>
      addToast({ type: 'info', message, description }),
    warning: (message: string, description?: string) =>
      addToast({ type: 'warning', message, description })
  }
}
