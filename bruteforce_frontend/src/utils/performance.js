/**
 * Performance Utilities - Outils d'optimisation des performances
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

// Debounce optimisé pour les inputs utilisateur
export const debounce = (func, wait, immediate = false) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

// Throttle pour limiter la fréquence d'exécution
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Formatage optimisé des nombres
export const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0'
  
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}G`
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
  return num.toLocaleString()
}

// Formatage du temps optimisé
export const formatTime = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds)) return '0s'
  
  const units = [
    { name: 'années', value: 31536000 },
    { name: 'jours', value: 86400 },
    { name: 'heures', value: 3600 },
    { name: 'minutes', value: 60 },
    { name: 'secondes', value: 1 }
  ]

  for (const unit of units) {
    const value = Math.floor(seconds / unit.value)
    if (value > 0) {
      const remainder = seconds % unit.value
      if (unit.value >= 60 && remainder > 0) {
        const nextUnit = units[units.indexOf(unit) + 1]
        const nextValue = Math.floor(remainder / nextUnit.value)
        return `${value} ${unit.name} ${nextValue} ${nextUnit.name}`
      }
      return `${value} ${unit.name}`
    }
  }
  return '0 secondes'
}

// Cache LRU pour optimiser les requêtes répétées
export class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize
    this.cache = new Map()
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }
    return null
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }

  clear() {
    this.cache.clear()
  }
}

// Lazy loading pour les composants
export const createLazyComponent = (importFunc) => {
  return React.lazy(() => 
    importFunc().catch(err => {
      console.error('Erreur de chargement du composant:', err)
      return { default: () => <div>Erreur de chargement</div> }
    })
  )
}

// Optimisation des re-renders avec shallow comparison
export const shallowEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false
    }
  }

  return true
}

// Worker pour calculs intensifs (si supporté)
export const createWorker = (workerFunction) => {
  if (typeof Worker === 'undefined') {
    console.warn('Web Workers non supportés')
    return null
  }

  const workerScript = `
    self.onmessage = function(e) {
      const result = (${workerFunction.toString()})(e.data)
      self.postMessage(result)
    }
  `

  const blob = new Blob([workerScript], { type: 'application/javascript' })
  return new Worker(URL.createObjectURL(blob))
}

// Monitoring des performances
export const performanceMonitor = {
  mark: (name) => {
    if (performance.mark) {
      performance.mark(name)
    }
  },

  measure: (name, startMark, endMark) => {
    if (performance.measure) {
      try {
        performance.measure(name, startMark, endMark)
        const measure = performance.getEntriesByName(name, 'measure')[0]
        return measure ? measure.duration : 0
      } catch (e) {
        console.warn('Erreur de mesure de performance:', e)
        return 0
      }
    }
    return 0
  },

  getMetrics: () => {
    if (performance.getEntriesByType) {
      return {
        navigation: performance.getEntriesByType('navigation')[0],
        paint: performance.getEntriesByType('paint'),
        resource: performance.getEntriesByType('resource')
      }
    }
    return {}
  }
}

// Utilitaire pour les animations fluides
export const requestAnimationFrame = (callback) => {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback)
  }
  return setTimeout(callback, 16) // Fallback 60fps
}

export const cancelAnimationFrame = (id) => {
  if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
    return window.cancelAnimationFrame(id)
  }
  return clearTimeout(id)
}
