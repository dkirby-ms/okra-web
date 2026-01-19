/**
 * AuthProvider Component
 * Wraps the application with MSAL authentication context
 */

import { useEffect, useState, useRef, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { EventType, type EventMessage, type AuthenticationResult } from '@azure/msal-browser'
import { getMsalInstance } from './authConfig'
import { CustomNavigationClient } from './NavigationClient'
import { updateActivity } from './sessionActivity'
import type { RedirectState } from './types'

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Inner component that has access to React Router hooks
 * Sets up MSAL event listeners and handles redirect callbacks
 */
function AuthProviderInner({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isInitialized, setIsInitialized] = useState(false)
  const msalInstance = getMsalInstance()
  const initializingRef = useRef(false)

  // Set up custom navigation client for React Router integration
  useEffect(() => {
    const navigationClient = new CustomNavigationClient(navigate)
    msalInstance.setNavigationClient(navigationClient)
  }, [msalInstance, navigate])

  // Initialize MSAL and handle redirect promise
  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (initializingRef.current) return
    initializingRef.current = true

    const initializeMsal = async () => {
      try {
        // Initialize MSAL instance first
        await msalInstance.initialize()
        
        // Then handle any redirect response
        const response = await msalInstance.handleRedirectPromise()
        
        if (response) {
          // Successfully logged in via redirect
          handleLoginSuccess(response)
        }
      } catch (error) {
        console.error('Error initializing MSAL:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeMsal()
  }, [msalInstance])

  // Listen for MSAL events (only after initialized)
  useEffect(() => {
    if (!isInitialized) return

    const callbackId = msalInstance.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const result = event.payload as AuthenticationResult
        handleLoginSuccess(result)
      }

      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        // Already handled by logoutRedirect postLogoutRedirectUri
      }

      if (event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
        // Update activity on token refresh
        updateActivity()
      }
    })

    return () => {
      if (callbackId) {
        msalInstance.removeEventCallback(callbackId)
      }
    }
  }, [msalInstance, navigate, location, isInitialized])

  /**
   * Handle successful login
   * Extracts returnUrl from state and navigates there
   */
  const handleLoginSuccess = (response: AuthenticationResult) => {
    // Initialize session activity tracking
    updateActivity()

    // Set the active account
    if (response.account) {
      msalInstance.setActiveAccount(response.account)
    }

    // Extract returnUrl from state
    let returnUrl = '/'
    
    if (response.state) {
      try {
        const state = JSON.parse(response.state) as RedirectState
        if (state.returnUrl) {
          returnUrl = state.returnUrl
        }
      } catch {
        // Invalid state, use default
        console.warn('Could not parse login state')
      }
    }

    // Navigate to return URL
    navigate(returnUrl, { replace: true })
  }

  // Show loading while handling redirect
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * Main AuthProvider component
 * Must be rendered inside BrowserRouter but wraps the rest of the app
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const msalInstance = getMsalInstance()

  return (
    <MsalProvider instance={msalInstance}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </MsalProvider>
  )
}
