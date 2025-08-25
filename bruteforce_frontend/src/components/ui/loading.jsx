/**
 * Loading Component - Composant de chargement avancé
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { cn } from '@/lib/utils'

const Loading = ({ className, size = "default", text = "Chargement..." }) => {
  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        {
          "h-4 w-4": size === "small",
          "h-8 w-8": size === "default", 
          "h-12 w-12": size === "large"
        }
      )} />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  )
}

const LoadingSkeleton = ({ className }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  )
}

const LoadingDots = ({ className }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
    </div>
  )
}

export { Loading, LoadingSkeleton, LoadingDots }
