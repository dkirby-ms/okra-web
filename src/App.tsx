import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage, ProtectedRoute } from '@/features/auth'

// Lazy load feature pages
const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage }))
)
const ObjectivesPage = lazy(() =>
  import('@/features/objectives/ObjectivesPage').then((m) => ({ default: m.ObjectivesPage }))
)
const ObjectiveDetail = lazy(() =>
  import('@/features/objectives/ObjectiveDetail').then((m) => ({ default: m.ObjectiveDetail }))
)
const TimePeriodsPage = lazy(() =>
  import('@/features/time-periods/TimePeriodsPage').then((m) => ({ default: m.TimePeriodsPage }))
)

function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* Public route: Login page */}
      <Route path="login" element={<LoginPage />} />
      
      {/* Protected routes: Require authentication */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          }
        />
        <Route
          path="objectives"
          element={
            <Suspense fallback={<PageLoader />}>
              <ObjectivesPage />
            </Suspense>
          }
        />
        <Route
          path="objectives/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <ObjectiveDetail />
            </Suspense>
          }
        />
        <Route
          path="time-periods"
          element={
            <Suspense fallback={<PageLoader />}>
              <TimePeriodsPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
