/**
 * Authentication Types
 * Core type definitions for the auth feature
 */

import type { AccountInfo } from '@azure/msal-browser'

/**
 * Environment configuration for MSAL
 */
export interface AuthEnvConfig {
  clientId: string
  tenantId: string
  redirectUri: string
  apiScope?: string
  sessionTimeoutMinutes: number
}

/**
 * Authentication state exposed by useAuth hook
 */
export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: AccountInfo | null
  error: Error | null
}

/**
 * Authentication actions exposed by useAuth hook
 */
export interface AuthActions {
  login: (returnUrl?: string) => Promise<void>
  logout: () => Promise<void>
}

/**
 * Combined auth context type
 */
export type AuthContextType = AuthState & AuthActions

/**
 * Session activity tracking
 */
export interface SessionActivity {
  lastActivityTime: number
  sessionTimeoutMs: number
}

/**
 * Redirect state stored in MSAL state parameter
 */
export interface RedirectState {
  returnUrl?: string
}
