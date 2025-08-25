/**
 * Background Effects Components - Inspiré de ReactBits.dev
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'

// Floating Particles Background
export const FloatingParticles = ({ 
  count = 50, 
  className,
  color = "rgb(139, 92, 246)",
  speed = 1 
}) => {
  const particles = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
      opacity: Math.random() * 0.5 + 0.1
    }))
  , [count, speed])

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            opacity: particle.opacity,
            animation: `float ${10 + Math.random() * 10}s linear infinite`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Grid Pattern Background
export const GridPattern = ({ 
  size = 20, 
  className,
  opacity = 0.1,
  color = "currentColor" 
}) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      <svg
        className="w-full h-full"
        style={{ opacity }}
      >
        <defs>
          <pattern
            id="grid"
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${size} 0 L 0 0 0 ${size}`}
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}

// Animated Gradient Background
export const AnimatedGradient = ({ 
  className,
  colors = ["#667eea", "#764ba2", "#f093fb", "#f5576c"],
  speed = "15s" 
}) => {
  return (
    <div 
      className={cn(
        "absolute inset-0 opacity-50",
        "bg-gradient-to-r animate-gradient-x",
        className
      )}
      style={{
        background: `linear-gradient(-45deg, ${colors.join(', ')})`,
        backgroundSize: '400% 400%',
        animationDuration: speed
      }}
    >
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x ${speed} ease infinite;
        }
      `}</style>
    </div>
  )
}

// Matrix Rain Effect
export const MatrixRain = ({ 
  className,
  characters = "01",
  columns = 20,
  speed = 100 
}) => {
  const [drops, setDrops] = useState([])

  useEffect(() => {
    const newDrops = Array.from({ length: columns }, (_, i) => ({
      id: i,
      x: (i * 100) / columns,
      y: Math.random() * 100,
      speed: Math.random() * 2 + 1,
      chars: Array.from({ length: 10 }, () => 
        characters[Math.floor(Math.random() * characters.length)]
      )
    }))
    setDrops(newDrops)

    const interval = setInterval(() => {
      setDrops(prev => prev.map(drop => ({
        ...drop,
        y: drop.y >= 100 ? -10 : drop.y + drop.speed,
        chars: drop.chars.map(() => 
          characters[Math.floor(Math.random() * characters.length)]
        )
      })))
    }, speed)

    return () => clearInterval(interval)
  }, [columns, speed, characters])

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute text-green-400 font-mono text-sm opacity-70"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
            transform: 'translateY(-100%)'
          }}
        >
          {drop.chars.map((char, i) => (
            <div
              key={i}
              style={{
                opacity: 1 - (i * 0.1),
                filter: `brightness(${1 - (i * 0.1)})`
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Cyber Grid Background
export const CyberGrid = ({ 
  className,
  lineColor = "rgba(139, 92, 246, 0.3)",
  nodeColor = "rgba(139, 92, 246, 0.6)" 
}) => {
  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      <svg className="w-full h-full">
        <defs>
          <pattern id="cyber-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill={nodeColor}>
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={lineColor}
              strokeWidth="1"
            />
          </pattern>
          
          <radialGradient id="cyber-fade">
            <stop offset="0%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#cyber-grid)" />
        
        {/* Scanning line effect */}
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="rgba(139, 92, 246, 0.8)"
          strokeWidth="2"
          opacity="0.7"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,-200; 0,400"
            dur="4s"
            repeatCount="indefinite"
          />
        </line>
      </svg>
    </div>
  )
}
