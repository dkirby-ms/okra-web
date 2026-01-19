import { ApiError, errorResponseSchema, type ErrorResponse } from '@/types/api'
import { getMsalInstance } from '@/features/auth'
import { InteractionRequiredAuthError } from '@azure/msal-browser'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
const API_SCOPE = import.meta.env.VITE_API_SCOPE || ''

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface RequestConfig {
  method: HttpMethod
  headers?: Record<string, string>
  body?: unknown
  /** If true, skips adding auth token (for public endpoints) */
  skipAuth?: boolean
}

/**
 * Acquires an access token for the API silently
 * Falls back to redirect login if interaction is required
 */
async function getAccessToken(): Promise<string | null> {
  // Skip token acquisition if no API scope is configured
  if (!API_SCOPE) {
    return null
  }

  try {
    const msalInstance = getMsalInstance()
    const accounts = msalInstance.getAllAccounts()
    
    if (accounts.length === 0) {
      return null
    }

    const response = await msalInstance.acquireTokenSilent({
      scopes: [API_SCOPE],
      account: accounts[0],
    })

    return response.accessToken
  } catch (error) {
    // If silent acquisition fails due to interaction requirement,
    // trigger redirect login
    if (error instanceof InteractionRequiredAuthError) {
      const msalInstance = getMsalInstance()
      await msalInstance.acquireTokenRedirect({
        scopes: [API_SCOPE],
      })
    }
    console.error('Failed to acquire access token:', error)
    return null
  }
}

async function parseErrorResponse(response: Response): Promise<ErrorResponse> {
  try {
    const data: unknown = await response.json()
    const parsed = errorResponseSchema.safeParse(data)
    if (parsed.success) {
      return parsed.data
    }
    // Fallback for non-standard error responses
    return {
      statusCode: response.status,
      message: response.statusText || 'An error occurred',
      error: 'Unknown Error',
    }
  } catch {
    return {
      statusCode: response.status,
      message: response.statusText || 'An error occurred',
      error: 'Unknown Error',
    }
  }
}

export async function apiClient<T>(endpoint: string, config?: RequestConfig): Promise<T> {
  const url = `${BASE_URL}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config?.headers,
  }

  // Add authorization header if not skipping auth
  if (!config?.skipAuth) {
    const accessToken = await getAccessToken()
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }
  }

  const fetchConfig: RequestInit = {
    method: config?.method || 'GET',
    headers,
  }

  if (config?.body) {
    fetchConfig.body = JSON.stringify(config.body)
  }

  const response = await fetch(url, fetchConfig)

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  // Handle 401 Unauthorized - token may have expired
  if (response.status === 401) {
    // Clear any cached tokens and redirect to login
    const msalInstance = getMsalInstance()
    const accounts = msalInstance.getAllAccounts()
    if (accounts.length > 0) {
      // Token is invalid, force re-authentication
      await msalInstance.acquireTokenRedirect({
        scopes: API_SCOPE ? [API_SCOPE] : [],
        account: accounts[0],
      })
    }
  }

  // Handle error responses
  if (!response.ok) {
    const errorResponse = await parseErrorResponse(response)
    throw ApiError.fromResponse(errorResponse)
  }

  // Parse successful response
  const data: unknown = await response.json()
  return data as T
}

// Convenience methods
export const api = {
  get: <T>(endpoint: string, skipAuth?: boolean) => 
    apiClient<T>(endpoint, { method: 'GET', skipAuth }),
  post: <T>(endpoint: string, body?: unknown, skipAuth?: boolean) => 
    apiClient<T>(endpoint, { method: 'POST', body, skipAuth }),
  patch: <T>(endpoint: string, body?: unknown, skipAuth?: boolean) => 
    apiClient<T>(endpoint, { method: 'PATCH', body, skipAuth }),
  delete: <T>(endpoint: string, skipAuth?: boolean) => 
    apiClient<T>(endpoint, { method: 'DELETE', skipAuth }),
}
