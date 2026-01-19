import { Link } from 'react-router-dom'
import { useProgressSummary, useStatusDistribution } from '@/hooks/useReports'
import { useObjectives } from '@/hooks/useObjectives'
import { useTimePeriods } from '@/hooks/useTimePeriods'
import { ProgressSummaryCard } from './ProgressSummaryCard'
import { StatusDistributionChart } from './StatusDistributionChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { calculateObjectiveStatus } from '@/lib/status-calculator'
import { ArrowRight, Target } from 'lucide-react'

export function DashboardPage() {
  const { data: progressSummary, isLoading: isLoadingProgress } = useProgressSummary()
  const { data: statusDistribution, isLoading: isLoadingStatus } = useStatusDistribution()
  const { data: objectives, isLoading: isLoadingObjectives } = useObjectives()
  const { data: timePeriods } = useTimePeriods()

  // Handle both array and wrapped object responses
  const timePeriodsArray = Array.isArray(timePeriods) ? timePeriods : []
  const objectivesArray = Array.isArray(objectives) ? objectives : []

  // Get time period map for status calculation
  const timePeriodMap = new Map(timePeriodsArray.map((tp) => [tp.id, tp]))

  // Get recent objectives (last 5)
  const recentObjectives = objectivesArray.slice(0, 5)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your OKR progress and status
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProgressSummaryCard data={progressSummary} isLoading={isLoadingProgress} />
        <StatusDistributionChart data={statusDistribution} isLoading={isLoadingStatus} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recent Objectives
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/objectives">
              View all
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingObjectives ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-5 w-48 rounded bg-muted" />
                  <div className="h-2 w-full rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : recentObjectives.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No objectives yet.{' '}
              <Link to="/objectives" className="text-primary hover:underline">
                Create your first objective
              </Link>
            </p>
          ) : (
            <div className="space-y-4">
              {recentObjectives.map((objective) => {
                const timePeriod = objective.timePeriodId
                  ? timePeriodMap.get(objective.timePeriodId)
                  : null
                const status = calculateObjectiveStatus(objective, timePeriod)

                return (
                  <Link
                    key={objective.id}
                    to={`/objectives/${objective.id}`}
                    className="block rounded-lg border p-4 transition-colors hover:bg-accent"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-medium">{objective.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {(objective.keyResults?.length ?? 0)} key result
                          {(objective.keyResults?.length ?? 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <StatusBadge status={status} />
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={objective.progress} size="sm" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
