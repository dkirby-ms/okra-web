/**
 * Custom Navigation Client for React Router
 * Allows MSAL to use React Router's navigation instead of full page reloads
 */

import { NavigationClient, type NavigationOptions } from '@azure/msal-browser'
import type { NavigateFunction } from 'react-router-dom'

export class CustomNavigationClient extends NavigationClient {
  private navigate: NavigateFunction

  constructor(navigate: NavigateFunction) {
    super()
    this.navigate = navigate
  }

  /**
   * Called by MSAL for internal navigation (within the SPA)
   * Uses React Router for client-side navigation
   */
  async navigateInternal(url: string, options: NavigationOptions): Promise<boolean> {
    // Extract the relative path from the full URL
    const relativePath = url.replace(window.location.origin, '')

    if (options.noHistory) {
      this.navigate(relativePath, { replace: true })
    } else {
      this.navigate(relativePath)
    }

    // Return false to indicate MSAL should not handle navigation
    return false
  }

  /**
   * Called by MSAL for external navigation (to Entra ID)
   * Uses default browser navigation
   */
  async navigateExternal(url: string, options: NavigationOptions): Promise<boolean> {
    if (options.noHistory) {
      window.location.replace(url)
    } else {
      window.location.assign(url)
    }

    // Return true to indicate navigation was handled
    return true
  }
}
