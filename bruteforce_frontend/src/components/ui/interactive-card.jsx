/**
 * Interactive Card Components - Inspiré de ReactBits.dev
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Hover Tilt Card
export const TiltCard = ({ 
  children, 
  className,
  maxTilt = 15,
  speed = 400 
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef()

  const handleMouseMove = (e) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) / (rect.width / 2)
    const deltaY = (e.clientY - centerY) / (rect.height / 2)
    
    setTilt({
      x: deltaY * maxTilt,
      y: deltaX * maxTilt
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("transition-transform", className)}
      style={{
        transform: `perspective(1000px) rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg)`,
        transitionDuration: `${speed}ms`
      }}
    >
      {children}
    </div>
  )
}

// Glow Card
export const GlowCard = ({ 
  children, 
  className,
  glowColor = "purple" 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative transition-all duration-300",
        isHovered && "scale-[1.02]",
        className
      )}
    >
      {isHovered && (
        <div 
          className={cn(
            "absolute -inset-0.5 rounded-lg opacity-75 blur",
            glowColor === "purple" && "bg-gradient-to-r from-purple-600 to-pink-600",
            glowColor === "blue" && "bg-gradient-to-r from-blue-600 to-cyan-600",
            glowColor === "green" && "bg-gradient-to-r from-green-600 to-emerald-600"
          )}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  )
}

// Expandable Card
export const ExpandableCard = ({ 
  title,
  description,
  children,
  className,
  expandedClassName 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-500 ease-in-out",
        isExpanded ? expandedClassName : "",
        className
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <div 
            className={cn(
              "transition-transform duration-300",
              isExpanded ? "rotate-180" : ""
            )}
          >
            ↓
          </div>
        </CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      
      <div 
        className={cn(
          "overflow-hidden transition-all duration-500",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <CardContent>{children}</CardContent>
      </div>
    </Card>
  )
}

// Floating Action Card
export const FloatingCard = ({ 
  children, 
  className,
  floatIntensity = 10 
}) => {
  return (
    <div 
      className={cn(
        "relative transition-all duration-300 hover:scale-105",
        "hover:shadow-2xl hover:-translate-y-2",
        "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r",
        "before:from-transparent before:via-white/5 before:to-transparent",
        "before:translate-x-[-100%] hover:before:translate-x-[100%]",
        "before:transition-transform before:duration-700 before:ease-in-out",
        className
      )}
    >
      {children}
    </div>
  )
}

// Progress Ring Card
export const ProgressRingCard = ({ 
  title,
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 8,
  color = "#8b5cf6",
  children,
  className 
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = (value / maxValue) * 100
  const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`

  return (
    <Card className={cn("p-6 text-center", className)}>
      <div className="relative inline-block">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
            <div className="text-xs text-slate-400">{title}</div>
          </div>
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </Card>
  )
}
