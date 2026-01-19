import { Progress } from '@/components/ui/progress'
import { cn, formatPercent } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProgressBar({
  value,
  showLabel = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(value, 100))
  const isOverAchieved = value > 100

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Progress
        value={clampedValue}
        className={cn(
          sizeClasses[size],
          'flex-1',
          isOverAchieved && '[&>div]:bg-green-600'
        )}
      />
      {showLabel && (
        <span
          className={cn(
            'text-sm font-medium tabular-nums',
            isOverAchieved && 'text-green-600'
          )}
        >
          {formatPercent(value)}
        </span>
      )}
    </div>
  )
}
