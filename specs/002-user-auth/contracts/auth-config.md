# Auth Configuration Contract

**Feature**: 002-user-auth  
**Date**: January 19, 2026

## Overview

This document defines the configuration contract for MSAL.js integration with Microsoft Entra ID.

## Environment Variables

All environment variables must be prefixed with `VITE_` for Vite to expose them to the client application.

### Required Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `VITE_AZURE_CLIENT_ID` | UUID | Application (client) ID from Entra ID app registration | `12345678-1234-1234-1234-123456789abc` |
| `VITE_AZURE_TENANT_ID` | UUID | Directory (tenant) ID from Azure portal | `87654321-4321-4321-4321-cba987654321` |
| `VITE_AZURE_REDIRECT_URI` | URL | Registered redirect URI for OAuth flow | `http://localhost:5173` |

### Optional Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_API_SCOPE` | String | `openid profile User.Read` | Space-separated API scopes for token requests |
| `VITE_SESSION_TIMEOUT_MINUTES` | Number | `60` | Session inactivity timeout in minutes |

## .env.example

```env
# Microsoft Entra ID Configuration
VITE_AZURE_CLIENT_ID=your-client-id-here
VITE_AZURE_TENANT_ID=your-tenant-id-here
VITE_AZURE_REDIRECT_URI=http://localhost:5173

# Optional: API scope for backend access
# VITE_API_SCOPE=api://your-api-client-id/.default

# Optional: Session timeout (default: 60 minutes)
# VITE_SESSION_TIMEOUT_MINUTES=60

# Existing API configuration
VITE_API_BASE_URL=/api/v1
```

## MSAL Configuration Object

The following TypeScript interface defines the MSAL configuration structure:

```typescript
import { Configuration, LogLevel } from "@azure/msal-browser";

export interface AuthEnvConfig {
  clientId: string;
  tenantId: string;
  redirectUri: string;
  apiScope?: string;
  sessionTimeoutMinutes?: number;
}

export function createMsalConfig(env: AuthEnvConfig): Configuration {
  return {
    auth: {
      clientId: env.clientId,
      authority: `https://login.microsoftonline.com/${env.tenantId}`,
      redirectUri: env.redirectUri,
      postLogoutRedirectUri: env.redirectUri,
      navigateToLoginRequestUrl: true,
    },
    cache: {
      cacheLocation: "sessionStorage",
      storeAuthStateInCookie: false,
    },
    system: {
      loggerOptions: {
        logLevel: import.meta.env.DEV ? LogLevel.Info : LogLevel.Warning,
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) return;
          switch (level) {
            case LogLevel.Error:
              console.error(message);
              break;
            case LogLevel.Warning:
              console.warn(message);
              break;
            case LogLevel.Info:
              console.info(message);
              break;
            case LogLevel.Verbose:
              console.debug(message);
              break;
          }
        },
      },
    },
  };
}
```

## Login Request Configuration

```typescript
import { PopupRequest, RedirectRequest } from "@azure/msal-browser";

export const loginRequest: RedirectRequest = {
  scopes: ["openid", "profile", "User.Read"],
};

// For API calls requiring specific scopes
export function createTokenRequest(apiScope: string): RedirectRequest {
  return {
    scopes: [apiScope],
  };
}
```

## Validation Schema (Zod)

```typescript
import { z } from "zod";

export const authEnvSchema = z.object({
  clientId: z.string().uuid("VITE_AZURE_CLIENT_ID must be a valid UUID"),
  tenantId: z.string().uuid("VITE_AZURE_TENANT_ID must be a valid UUID"),
  redirectUri: z.string().url("VITE_AZURE_REDIRECT_URI must be a valid URL"),
  apiScope: z.string().optional(),
  sessionTimeoutMinutes: z.number().positive().default(60),
});

export function validateAuthEnv(): AuthEnvConfig {
  const result = authEnvSchema.safeParse({
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    tenantId: import.meta.env.VITE_AZURE_TENANT_ID,
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI,
    apiScope: import.meta.env.VITE_API_SCOPE,
    sessionTimeoutMinutes: import.meta.env.VITE_SESSION_TIMEOUT_MINUTES 
      ? Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES) 
      : 60,
  });

  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path}: ${e.message}`).join("\n");
    throw new Error(`Invalid auth configuration:\n${errors}`);
  }

  return result.data;
}
```

## Azure App Registration Requirements

The Entra ID application must be configured with:

### Authentication Settings

| Setting | Value |
|---------|-------|
| Platform | Single-page application (SPA) |
| Redirect URIs | `http://localhost:5173` (dev), production URL |
| Implicit grant | ID tokens: ✅, Access tokens: ❌ |
| Supported account types | Single tenant (recommended) |

### API Permissions

| Permission | Type | Description |
|------------|------|-------------|
| `openid` | Delegated | Sign in and read user profile |
| `profile` | Delegated | View users' basic profile |
| `User.Read` | Delegated | Sign in and read user profile |
| Custom API scope | Delegated | If calling protected backend API |

### Token Configuration

| Setting | Value |
|---------|-------|
| Access token version | 2 |
| ID token claims | Default |
| Optional claims | `login_hint` (for logout hint) |

## Security Considerations

1. **Never commit actual credentials** - Use `.env.local` for development
2. **Validate redirect URIs** - Only allow registered URIs
3. **Use single-tenant** - More secure than multi-tenant for internal apps
4. **Session storage** - Tokens cleared on browser close (more secure than localStorage)
5. **No refresh tokens in SPA** - MSAL uses iframe-based silent refresh
