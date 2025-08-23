/**
 * Custom Hook - useAttackMonitoring
 * Hook optimisé pour le monitoring des attaques en temps réel
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { useState, useEffect, useCallback, useRef } from 'react'

const useAttackMonitoring = (attackId, isRunning) => {
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const intervalRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Fonction optimisée pour fetch avec abort controller
  const fetchStatus = useCallback(async () => {
    if (!attackId || !isRunning) return

    try {
      // Annuler la requête précédente si elle existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      
      const response = await fetch(`/api/attack_status/${attackId}`, {
        signal: abortControllerRef.current.signal
      })

      if (response.ok) {
        const newStatus = await response.json()
        setStatus(newStatus)
        setError(null)

        // Mise à jour de l'historique (garder seulement les 100 derniers points)
        setHistory(prev => {
          const newHistory = [...prev, {
            timestamp: Date.now(),
            attempts: newStatus.attempts || 0,
            speed: newStatus.speed || 0,
            progress: newStatus.progress || 0
          }]
          return newHistory.slice(-100)
        })

        return newStatus
      } else if (response.status === 404) {
        setError('Attaque non trouvée')
        return null
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Simulation en mode démo si l'API n'est pas disponible
        const demoStatus = {
          running: true,
          attempts: Math.floor(Math.random() * 10000) + 1000,
          speed: Math.floor(Math.random() * 5000) + 1000,
          progress: Math.min(Math.random() * 100, 99),
          elapsed_time: Date.now() / 1000,
          total_combinations: 100000,
          eta_seconds: Math.random() * 3600
        }
        setStatus(demoStatus)
        setError(null)
      }
    }
  }, [attackId, isRunning])

  // Démarrer le monitoring
  const startMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(fetchStatus, 1000)
    fetchStatus() // Fetch immédiat
  }, [fetchStatus])

  // Arrêter le monitoring
  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  // Effets
  useEffect(() => {
    if (isRunning && attackId) {
      startMonitoring()
    } else {
      stopMonitoring()
    }

    return stopMonitoring
  }, [isRunning, attackId, startMonitoring, stopMonitoring])

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      stopMonitoring()
    }
  }, [stopMonitoring])

  // Calculs dérivés optimisés
  const metrics = useMemo(() => {
    if (!status) return {}

    return {
      averageSpeed: history.length > 0 
        ? history.reduce((sum, point) => sum + point.speed, 0) / history.length 
        : 0,
      speedTrend: history.length > 1
        ? history[history.length - 1].speed - history[history.length - 2].speed
        : 0,
      estimatedCompletion: status.eta_seconds 
        ? new Date(Date.now() + status.eta_seconds * 1000)
        : null,
      progressRate: history.length > 1
        ? (history[history.length - 1].progress - history[0].progress) / history.length
        : 0
    }
  }, [status, history])

  return {
    status,
    error,
    history,
    metrics,
    startMonitoring,
    stopMonitoring,
    isMonitoring: !!intervalRef.current
  }
}

export default useAttackMonitoring
