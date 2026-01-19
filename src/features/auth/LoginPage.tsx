/**
 * LoginPage Component
 * Displays login UI with Microsoft sign-in button
 */

import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from './useAuth'

export function LoginPage() {
  const { isAuthenticated, isLoading, login, error } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Get the return URL from query params (set by ProtectedRoute)
  const returnUrl = searchParams.get('returnUrl') || '/'

  // Redirect to return URL if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(returnUrl, { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, returnUrl])

  const handleLogin = async () => {
    await login(returnUrl)
  }

  // Show loading state while MSAL is processing
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">
              Signing you in...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <img
              src="/okra-logo.svg"
              alt="Okra"
              className="h-12 w-12"
              onError={(e) => {
                // Hide if logo doesn't exist
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Okra</CardTitle>
          <CardDescription>
            OKR tracking made simple. Sign in to manage your objectives and key
            results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error.message || 'An error occurred during sign in'}
            </div>
          )}

          <Button onClick={handleLogin} className="w-full" size="lg">
            <MicrosoftIcon className="mr-2 h-5 w-5" />
            Sign in with Microsoft
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to use this application in accordance with
            your organization's policies.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Microsoft brand icon
 */
function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  )
}
