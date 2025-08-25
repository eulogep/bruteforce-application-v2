/**
 * StatsCard Component - Carte de statistiques pour dashboard
 * @author MABIALA EULOGE JUNIOR
 * @license MIT
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  className,
  valueClassName 
}) => {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className={cn(
            "flex items-center text-xs mt-2",
            trend.type === 'positive' ? 'text-green-600' : 
            trend.type === 'negative' ? 'text-red-600' : 'text-gray-600'
          )}>
            <span>{trend.value}</span>
            <span className="ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const StatsGrid = ({ children, className }) => {
  return (
    <div className={cn(
      "grid gap-4 md:grid-cols-2 lg:grid-cols-4", 
      className
    )}>
      {children}
    </div>
  )
}

export { StatsCard, StatsGrid }
