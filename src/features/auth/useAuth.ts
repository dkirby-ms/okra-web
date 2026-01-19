/**
 * useAuth Hook
 * Provides authentication state and actions throughout the app
 */

import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import { InteractionStatus, type AccountInfo } from '@azure/msal-browser'
import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { loginRequest } from './authConfig'
import { updateActivity, clearActivity } from './sessionActivity'
import type { AuthState, AuthActions, RedirectState } from './types'

/**
 * Hook for accessing authentication state and actions
 */
export function useAuth(): AuthState & AuthActions {
  const { instance, accounts, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const location = useLocation()

  // Get the current user account
  const user = useMemo(() => {
    return accounts.length > 0 ? accounts[0] : null
  }, [accounts])

  // Determine loading state
  const isLoading = useMemo(() => {
    return inProgress !== InteractionStatus.None
  }, [inProgress])

  /**
   * Initiates login flow with optional return URL
   * The returnUrl is stored in MSAL's state parameter to survive the OAuth redirect
   */
  const login = useCallback(
    async (returnUrl?: string) => {
      // Use provided returnUrl or current location
      const targetUrl = returnUrl || location.pathname + location.search

      const state: RedirectState = {
        returnUrl: targetUrl !== '/login' ? targetUrl : '/',
      }

      await instance.loginRedirect({
        ...loginRequest,
        state: JSON.stringify(state),
      })
    },
    [instance, location]
  )

  /**
   * Initiates logout flow
   * Clears session activity and redirects to Entra ID logout
   */
  const logout = useCallback(async () => {
    // Clear session activity tracking
    clearActivity()

    await instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin + '/login',
    })
  }, [instance])

  // Update activity on hook usage (indicates user is active)
  if (isAuthenticated) {
    updateActivity()
  }

  return {
    isAuthenticated,
    isLoading,
    user: user ?? null,
    error: null,
    login,
    logout,
  }
}

/**
 * Hook for getting just the current user (convenience wrapper)
 */
export function useCurrentUser(): { user: AccountInfo | null; isAuthenticated: boolean; isLoading: boolean } {
  const auth = useAuth()
  return { user: auth.user, isAuthenticated: auth.isAuthenticated, isLoading: auth.isLoading }
}
