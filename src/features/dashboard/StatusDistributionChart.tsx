import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { StatusDistribution, ObjectiveStatus } from '@/types/api'
import { PieChart } from 'lucide-react'

interface StatusDistributionChartProps {
  data: StatusDistribution | undefined
  isLoading: boolean
}

const statusOrder: ObjectiveStatus[] = ['on-track', 'at-risk', 'behind', 'no-period']

export function StatusDistributionChart({ data, isLoading }: StatusDistributionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-20 rounded-full bg-muted" />
                  <div className="h-4 w-8 rounded bg-muted" />
                </div>
                <div className="mt-2 h-2 rounded bg-muted" />
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

  // Handle case where distribution is undefined or not an array
  const distribution = data.distribution ?? []

  // Sort distribution by our preferred order
  const sortedBuckets = [...distribution].sort((a, b) => {
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  })

  const total = sortedBuckets.reduce((acc, bucket) => acc + bucket.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">No objectives to display</p>
        ) : (
          <div className="space-y-4">
            {sortedBuckets.map((bucket) => (
              <div key={bucket.status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <StatusBadge status={bucket.status} />
                  <span className="text-sm font-medium">
                    {bucket.count} ({Math.round(bucket.percentage)}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${bucket.percentage}%`,
                      backgroundColor: `var(--${bucket.status})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
