/**
 * Toast Notifications System - Système de notifications modernes
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { useState, useEffect, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react'

// Context pour les toasts
const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// Provider pour les toasts
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    }

    setToasts(prev => [...prev, newToast])

    // Auto-remove après la durée spécifiée
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const removeAllToasts = () => {
    setToasts([])
  }

  // Helpers pour différents types de toasts
  const success = (message, options = {}) => 
    addToast({ type: 'success', message, ...options })

  const error = (message, options = {}) => 
    addToast({ type: 'error', message, duration: 7000, ...options })

  const warning = (message, options = {}) => 
    addToast({ type: 'warning', message, ...options })

  const info = (message, options = {}) => 
    addToast({ type: 'info', message, ...options })

  return (
    <ToastContext.Provider 
      value={{ 
        toasts, 
        addToast, 
        removeToast, 
        removeAllToasts,
        success,
        error, 
        warning,
        info
      }}
    >
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// Composant Toast individuel
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/50 text-green-100'
      case 'error':
        return 'bg-red-500/10 border-red-500/50 text-red-100'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-100'
      case 'info':
        return 'bg-blue-500/10 border-blue-500/50 text-blue-100'
      default:
        return 'bg-slate-500/10 border-slate-500/50 text-slate-100'
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-slate-500" />
    }
  }

  return (
    <div
      className={cn(
        "flex items-center space-x-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg",
        "transition-all duration-300 ease-in-out transform",
        getToastStyle(toast.type),
        isVisible && !isRemoving 
          ? "translate-x-0 opacity-100 scale-100" 
          : "translate-x-full opacity-0 scale-95"
      )}
    >
      {getIcon(toast.type)}
      
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-medium text-sm mb-1">{toast.title}</div>
        )}
        <div className="text-sm opacity-90">{toast.message}</div>
      </div>

      <button
        onClick={handleRemove}
        className="text-current opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Container pour les toasts
const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onRemove={removeToast}
        />
      ))}
    </div>
  )
}

// Hook personnalisé pour les notifications spéciales
export const useNotifications = () => {
  const { success, error, warning, info } = useToast()

  const notifyAttackStarted = () => 
    success('🚀 Attaque démarrée avec succès', { 
      title: 'Démarrage', 
      duration: 3000 
    })

  const notifyAttackStopped = () => 
    warning('⏹️ Attaque arrêtée', { 
      title: 'Arrêt', 
      duration: 3000 
    })

  const notifyPasswordFound = (password) => 
    success(`🎯 Mot de passe trouvé: ${password}`, { 
      title: 'Succès !', 
      duration: 10000 
    })

  const notifyError = (message) => 
    error(message, { 
      title: 'Erreur', 
      duration: 5000 
    })

  const notifyDemoMode = () => 
    info('🎭 Mode démo activé - Backend non disponible', { 
      title: 'Information', 
      duration: 4000 
    })

  const notifyPerformanceTest = (result) => 
    success(`⚡ Test terminé: ${result}`, { 
      title: 'Performance', 
      duration: 4000 
    })

  return {
    notifyAttackStarted,
    notifyAttackStopped,
    notifyPasswordFound,
    notifyError,
    notifyDemoMode,
    notifyPerformanceTest,
    success,
    error,
    warning,
    info
  }
}

export default Toast
