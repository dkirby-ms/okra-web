import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import type { ProgressSummary } from '@/types/api'
import { Target, CheckCircle, BarChart3, ListChecks } from 'lucide-react'

interface ProgressSummaryCardProps {
  data: ProgressSummary | undefined
  isLoading: boolean
}

export function ProgressSummaryCard({ data, isLoading }: ProgressSummaryCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Progress Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="mt-2 h-8 w-16 rounded bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  const stats = [
    {
      label: 'Total Objectives',
      value: data.totalObjectives,
      icon: Target,
    },
    {
      label: 'Completed',
      value: data.completedObjectives,
      icon: CheckCircle,
    },
    {
      label: 'Total Key Results',
      value: data.totalKeyResults,
      icon: ListChecks,
    },
    {
      label: 'KRs Completed',
      value: data.completedKeyResults,
      icon: CheckCircle,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Progress Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Average Progress</span>
            <span className="font-medium">{Math.round(data.averageProgress)}%</span>
          </div>
          <ProgressBar value={data.averageProgress} showLabel={false} size="lg" />
        </div>
      </CardContent>
    </Card>
  )
}
