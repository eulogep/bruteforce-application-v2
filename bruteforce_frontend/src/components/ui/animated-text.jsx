/**
 * Animated Text Components - Inspiré de ReactBits.dev
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// TypeWriter Effect
export const TypeWriter = ({ 
  text, 
  speed = 100, 
  className,
  onComplete 
}) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={cn("inline-block", className)}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Fade In Text
export const FadeInText = ({ 
  children, 
  delay = 0, 
  duration = 500,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        "transition-all ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

// Glitch Text Effect
export const GlitchText = ({ 
  children, 
  className,
  intensity = 1 
}) => {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200)
    }, 3000 + Math.random() * 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <span 
      className={cn(
        "relative inline-block",
        isGlitching && "animate-pulse",
        className
      )}
      style={{
        textShadow: isGlitching 
          ? `${intensity}px 0 #ff0000, -${intensity}px 0 #00ffff, ${intensity * 2}px 0 #ffff00`
          : 'none'
      }}
    >
      {children}
    </span>
  )
}

// Gradient Text
export const GradientText = ({ 
  children, 
  className,
  gradient = "from-purple-400 to-pink-600" 
}) => {
  return (
    <span 
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        gradient,
        className
      )}
    >
      {children}
    </span>
  )
}

// Bounce In Text
export const BounceInText = ({ 
  children, 
  delay = 0,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible 
          ? "opacity-100 scale-100 rotate-0" 
          : "opacity-0 scale-75 -rotate-12",
        className
      )}
    >
      {children}
    </div>
  )
}
