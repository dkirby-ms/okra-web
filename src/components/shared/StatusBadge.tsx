import { cn } from '@/lib/utils'
import type { ObjectiveStatus } from '@/types/api'

interface StatusBadgeProps {
  status: ObjectiveStatus
  className?: string
}

const statusConfig: Record<
  ObjectiveStatus,
  { label: string; className: string }
> = {
  'on-track': {
    label: 'On Track',
    className: 'bg-[var(--on-track)] text-[var(--on-track-foreground)]',
  },
  'at-risk': {
    label: 'At Risk',
    className: 'bg-[var(--at-risk)] text-[var(--at-risk-foreground)]',
  },
  behind: {
    label: 'Behind',
    className: 'bg-[var(--behind)] text-[var(--behind-foreground)]',
  },
  'no-period': {
    label: 'No Period',
    className: 'bg-[var(--no-period)] text-[var(--no-period-foreground)]',
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
