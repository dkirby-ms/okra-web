/**
 * Auth Feature Barrel Export
 * Re-exports all public auth components, hooks, and utilities
 */

// Components
export { AuthProvider } from './AuthProvider'
export { LoginPage } from './LoginPage'
export { ProtectedRoute } from './ProtectedRoute'

// Hooks
export { useAuth, useCurrentUser } from './useAuth'
export { useAuthenticatedApi } from './useAuthenticatedApi'

// Config
export { getMsalInstance, loginRequest, getSessionTimeoutMs } from './authConfig'

// Types
export type {
  AuthEnvConfig,
  AuthState,
  AuthActions,
  AuthContextType,
  SessionActivity,
  RedirectState,
} from './types'
