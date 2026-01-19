import { ApiError, errorResponseSchema, type ErrorResponse } from '@/types/api'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface RequestConfig {
  method: HttpMethod
  headers?: Record<string, string>
  body?: unknown
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
  get: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) => apiClient<T>(endpoint, { method: 'POST', body }),
  patch: <T>(endpoint: string, body?: unknown) => apiClient<T>(endpoint, { method: 'PATCH', body }),
  delete: <T>(endpoint: string) => apiClient<T>(endpoint, { method: 'DELETE' }),
}
