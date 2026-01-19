/**
 * MSAL Configuration
 * Handles environment validation and MSAL instance creation
 */

import {
  type Configuration,
  LogLevel,
  PublicClientApplication,
  type RedirectRequest,
} from '@azure/msal-browser'
import { z } from 'zod'
import type { AuthEnvConfig } from './types'

/**
 * Zod schema for validating auth environment variables
 */
export const authEnvSchema = z.object({
  clientId: z.string().min(1, 'VITE_AZURE_CLIENT_ID is required'),
  tenantId: z.string().min(1, 'VITE_AZURE_TENANT_ID is required'),
  redirectUri: z.string().url('VITE_AZURE_REDIRECT_URI must be a valid URL'),
  apiScope: z.string().optional(),
  sessionTimeoutMinutes: z.number().positive().default(60),
})

/**
 * Validates auth environment variables and returns typed config
 * @throws Error if validation fails
 */
export function validateAuthEnv(): AuthEnvConfig {
  const result = authEnvSchema.safeParse({
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    tenantId: import.meta.env.VITE_AZURE_TENANT_ID,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
    apiScope: import.meta.env.VITE_API_SCOPE,
    sessionTimeoutMinutes: import.meta.env.VITE_SESSION_TIMEOUT_MINUTES
      ? Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES)
      : 60,
  })

  if (!result.success) {
    const errors = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n')
    throw new Error(`Invalid auth configuration:\n${errors}`)
  }

  return result.data
}

/**
 * Creates MSAL configuration object from environment config
 */
export function createMsalConfig(env: AuthEnvConfig): Configuration {
  return {
    auth: {
      clientId: env.clientId,
      authority: `https://login.microsoftonline.com/${env.tenantId}`,
      redirectUri: env.redirectUri,
      postLogoutRedirectUri: env.redirectUri,
    },
    cache: {
      cacheLocation: 'sessionStorage',
    },
    system: {
      loggerOptions: {
        logLevel: import.meta.env.DEV ? LogLevel.Info : LogLevel.Warning,
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) return
          switch (level) {
            case LogLevel.Error:
              console.error('[MSAL]', message)
              break
            case LogLevel.Warning:
              console.warn('[MSAL]', message)
              break
            case LogLevel.Info:
              if (import.meta.env.DEV) {
                console.info('[MSAL]', message)
              }
              break
            case LogLevel.Verbose:
              if (import.meta.env.DEV) {
                console.debug('[MSAL]', message)
              }
              break
          }
        },
      },
    },
  }
}

/**
 * Default login request configuration
 */
export const loginRequest: RedirectRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
}

/**
 * Creates a token request for API access
 */
export function createTokenRequest(apiScope: string): RedirectRequest {
  return {
    scopes: [apiScope],
  }
}

// Singleton instances
let authEnvConfig: AuthEnvConfig | null = null
let msalInstance: PublicClientApplication | null = null

/**
 * Gets or creates the auth environment config (singleton)
 */
export function getAuthEnvConfig(): AuthEnvConfig {
  if (!authEnvConfig) {
    authEnvConfig = validateAuthEnv()
  }
  return authEnvConfig
}

/**
 * Gets or creates the MSAL PublicClientApplication instance (singleton)
 */
export function getMsalInstance(): PublicClientApplication {
  if (!msalInstance) {
    const config = getAuthEnvConfig()
    const msalConfig = createMsalConfig(config)
    msalInstance = new PublicClientApplication(msalConfig)
  }
  return msalInstance
}

/**
 * Session timeout in milliseconds
 */
export function getSessionTimeoutMs(): number {
  const config = getAuthEnvConfig()
  return config.sessionTimeoutMinutes * 60 * 1000
}
