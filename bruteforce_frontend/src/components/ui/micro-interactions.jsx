/**
 * Micro-Interactions Components - Inspiré de ReactBits.dev
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Ripple Effect Button
export const RippleButton = ({ 
  children, 
  className, 
  onClick,
  variant = "default",
  ...props 
}) => {
  const [ripples, setRipples] = useState([])
  const buttonRef = useRef()

  const createRipple = (event) => {
    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    }

    setRipples(prev => [...prev, newRipple])

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)

    if (onClick) onClick(event)
  }

  return (
    <Button
      ref={buttonRef}
      className={cn("relative overflow-hidden", className)}
      onClick={createRipple}
      variant={variant}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animationDuration: '600ms'
          }}
        />
      ))}
    </Button>
  )
}

// Magnetic Button
export const MagneticButton = ({ 
  children, 
  className, 
  strength = 0.3,
  ...props 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef()

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <Button
      ref={buttonRef}
      className={cn("transition-transform duration-200", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      {...props}
    >
      {children}
    </Button>
  )
}

// Progress Button
export const ProgressButton = ({ 
  children, 
  className,
  isLoading = false,
  progress = 0,
  ...props 
}) => {
  return (
    <Button
      className={cn("relative overflow-hidden", className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <div
          className="absolute inset-0 bg-white/20 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
      <span className="relative z-10 flex items-center space-x-2">
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {children}
      </span>
    </Button>
  )
}

// Pulse Effect
export const PulseEffect = ({ 
  children, 
  className,
  color = "bg-purple-500",
  size = "w-8 h-8" 
}) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      <div className={cn(
        "absolute inset-0 rounded-full animate-ping opacity-75",
        color,
        size
      )} />
      <div className={cn(
        "absolute inset-0 rounded-full animate-pulse",
        color,
        size
      )} />
    </div>
  )
}

// Morphing Icon
export const MorphingIcon = ({ 
  icon1: Icon1, 
  icon2: Icon2, 
  isActive,
  className,
  size = 20 
}) => {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <Icon1
        size={size}
        className={cn(
          "absolute transition-all duration-300",
          isActive 
            ? "opacity-0 scale-75 rotate-90" 
            : "opacity-100 scale-100 rotate-0"
        )}
      />
      <Icon2
        size={size}
        className={cn(
          "absolute transition-all duration-300",
          isActive 
            ? "opacity-100 scale-100 rotate-0" 
            : "opacity-0 scale-75 -rotate-90"
        )}
      />
    </div>
  )
}

// Floating Action Button with Tooltip
export const FloatingActionButton = ({ 
  children, 
  tooltip,
  position = "bottom-right",
  className 
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  }

  return (
    <div 
      className={cn(positionClasses[position], "z-50")}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Button
        className={cn(
          "w-14 h-14 rounded-full shadow-lg",
          "bg-gradient-to-r from-purple-600 to-pink-600",
          "hover:shadow-xl hover:scale-110",
          "transition-all duration-300",
          className
        )}
      >
        {children}
      </Button>
      
      {tooltip && showTooltip && (
        <div className={cn(
          "absolute bg-black/80 text-white px-3 py-1 rounded text-sm",
          "transform transition-all duration-200",
          position.includes('right') ? 'right-full mr-3' : 'left-full ml-3',
          position.includes('bottom') ? 'bottom-1/2 translate-y-1/2' : 'top-1/2 -translate-y-1/2'
        )}>
          {tooltip}
        </div>
      )}
    </div>
  )
}

// Skeleton Loader
export const SkeletonLoader = ({ 
  lines = 3, 
  className,
  animated = true 
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-slate-700 rounded",
            animated && "animate-pulse",
            i === 0 && "w-3/4",
            i === 1 && "w-1/2",
            i === 2 && "w-5/6"
          )}
        />
      ))}
    </div>
  )
}
