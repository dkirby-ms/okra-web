/**
 * Session Activity Tracker
 * Tracks user activity for session timeout functionality
 */

import { getSessionTimeoutMs } from './authConfig'

const STORAGE_KEY = 'okra_last_activity'

/**
 * Updates the last activity timestamp in session storage
 */
export function updateActivity(): void {
  sessionStorage.setItem(STORAGE_KEY, Date.now().toString())
}

/**
 * Gets the last activity timestamp
 * @returns timestamp in milliseconds, or null if not set
 */
export function getLastActivity(): number | null {
  const stored = sessionStorage.getItem(STORAGE_KEY)
  return stored ? parseInt(stored, 10) : null
}

/**
 * Checks if the session has expired due to inactivity
 * @returns true if session has expired
 */
export function isSessionExpired(): boolean {
  const lastActivity = getLastActivity()
  if (!lastActivity) {
    // No activity recorded yet - session is valid (just started)
    return false
  }

  const timeoutMs = getSessionTimeoutMs()
  const elapsed = Date.now() - lastActivity

  return elapsed > timeoutMs
}

/**
 * Clears the session activity data
 */
export function clearActivity(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

/**
 * Gets time remaining until session expires (in milliseconds)
 * @returns milliseconds until expiry, or 0 if already expired
 */
export function getTimeUntilExpiry(): number {
  const lastActivity = getLastActivity()
  if (!lastActivity) {
    return getSessionTimeoutMs()
  }

  const timeoutMs = getSessionTimeoutMs()
  const elapsed = Date.now() - lastActivity
  const remaining = timeoutMs - elapsed

  return Math.max(0, remaining)
}
