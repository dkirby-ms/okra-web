/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects unauthenticated users to login with return URL preservation
 */

import { useEffect, useCallback, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from './useAuth'
import { isSessionExpired, clearActivity, updateActivity } from './sessionActivity'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const location = useLocation()
  const sessionCheckInterval = useRef<number | null>(null)

  /**
   * Handle session expiration
   * Logs user out with expired session message and toast notification
   */
  const handleSessionExpired = useCallback(async () => {
    clearActivity()
    // Store that session expired for potential display on login page
    sessionStorage.setItem('okra_session_expired', 'true')
    // Show toast notification
    toast.warning('Session expired', {
      description: 'Your session has expired due to inactivity. Please sign in again.',
      duration: 5000,
    })
    await logout()
  }, [logout])

  /**
   * Check session validity periodically
   * Runs every minute to check if session has expired
   */
  useEffect(() => {
    if (!isAuthenticated) return

    // Update activity on mount (user is viewing a protected page)
    updateActivity()

    // Check session every minute
    const checkSession = () => {
      if (isSessionExpired()) {
        handleSessionExpired()
      }
    }

    sessionCheckInterval.current = window.setInterval(checkSession, 60_000) // 1 minute

    return () => {
      if (sessionCheckInterval.current) {
        window.clearInterval(sessionCheckInterval.current)
      }
    }
  }, [isAuthenticated, handleSessionExpired])

  /**
   * Update activity on user interaction
   * Listens for clicks, key presses, and scroll events
   */
  useEffect(() => {
    if (!isAuthenticated) return

    const events = ['click', 'keydown', 'scroll', 'mousemove'] as const
    
    // Debounce activity updates to avoid excessive calls
    let lastUpdate = Date.now()
    const handleActivity = () => {
      const now = Date.now()
      // Only update activity if at least 30 seconds have passed
      if (now - lastUpdate > 30_000) {
        updateActivity()
        lastUpdate = now
      }
    }

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated])

  // Show loading state while MSAL is initializing or processing
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  // Preserve the current URL as returnUrl for post-login redirect
  if (!isAuthenticated) {
    const returnUrl = location.pathname + location.search
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />
  }

  // Check if session has expired on initial render
  if (isSessionExpired()) {
    handleSessionExpired()
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Session expired, redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
