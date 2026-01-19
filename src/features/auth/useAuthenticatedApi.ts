/**
 * useAuthenticatedApi Hook
 * Provides API methods that automatically attach authentication tokens
 * 
 * Note: The base apiClient already handles token attachment automatically.
 * This hook provides a React-friendly way to access the API with proper
 * loading states and error handling patterns.
 */

import { useCallback } from 'react'
import { useMsal } from '@azure/msal-react'
import { InteractionRequiredAuthError } from '@azure/msal-browser'
import { api } from '@/api/client'

const API_SCOPE = import.meta.env.VITE_API_SCOPE || ''

/**
 * Hook for making authenticated API requests
 * Returns methods that automatically include Bearer tokens
 */
export function useAuthenticatedApi() {
  const { instance, accounts } = useMsal()

  /**
   * Get a fresh access token for API calls
   */
  const getToken = useCallback(async (): Promise<string | null> => {
    if (!API_SCOPE || accounts.length === 0) {
      return null
    }

    try {
      const response = await instance.acquireTokenSilent({
        scopes: [API_SCOPE],
        account: accounts[0],
      })
      return response.accessToken
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        // Trigger interactive login
        await instance.acquireTokenRedirect({
          scopes: [API_SCOPE],
        })
      }
      console.error('Failed to acquire token:', error)
      return null
    }
  }, [instance, accounts])

  return {
    /**
     * The base API methods - tokens are automatically attached by apiClient
     */
    api,
    
    /**
     * Get a fresh access token (useful for manual requests)
     */
    getToken,
    
    /**
     * Check if API scope is configured
     */
    isApiConfigured: Boolean(API_SCOPE),
  }
}
