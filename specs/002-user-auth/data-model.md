# Data Model: User Authentication

**Feature**: 002-user-auth  
**Date**: January 19, 2026

## Overview

This feature primarily deals with authentication state and token management, not persistent data storage. The data model describes the runtime entities managed by MSAL.js and the application.

## Entities

### 1. AuthenticationState

Represents the current authentication status of the user within the application.

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `isAuthenticated` | `boolean` | Whether a user is currently signed in | MSAL `useIsAuthenticated()` |
| `inProgress` | `InteractionStatus` | Current auth interaction state (None, Login, Logout, etc.) | MSAL `useMsal()` |
| `accounts` | `AccountInfo[]` | List of signed-in accounts (typically 1) | MSAL `useMsal()` |

**Lifecycle**: Managed by MSAL's React context. Updates automatically on login/logout/token refresh.

---

### 2. AccountInfo (MSAL Type)

Represents the authenticated user's identity information.

| Field | Type | Description |
|-------|------|-------------|
| `homeAccountId` | `string` | Unique identifier for the account |
| `localAccountId` | `string` | Local account identifier |
| `username` | `string` | User's email/UPN |
| `name` | `string \| undefined` | User's display name |
| `tenantId` | `string` | Entra ID tenant identifier |
| `idTokenClaims` | `Record<string, unknown>` | Claims from the ID token |

**Source**: Returned by MSAL after successful authentication.

---

### 3. SessionActivity

Application-level tracking for session timeout (1-hour requirement).

| Field | Type | Description | Storage |
|-------|------|-------------|---------|
| `lastActivityTime` | `number` | Unix timestamp (ms) of last user activity | sessionStorage |
| `sessionTimeoutMs` | `number` | Session timeout duration (3,600,000 ms = 1 hour) | Constant |

**Validation Rules**:
- `lastActivityTime` must be updated on navigation, API calls, and form interactions
- Session is considered expired if `Date.now() - lastActivityTime > sessionTimeoutMs`

---

### 4. RedirectIntent

Stores the user's intended destination for post-login redirect.

| Field | Type | Description | Storage |
|-------|------|-------------|---------|
| `returnUrl` | `string` | Full path including query params | MSAL state parameter |

**Lifecycle**:
1. Created when unauthenticated user attempts to access protected route
2. Stored in MSAL login request `state` parameter
3. Retrieved after successful redirect callback
4. Used for navigation, then discarded

---

### 5. AuthConfig

Static configuration for MSAL initialization.

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `clientId` | `string` | Entra ID Application ID | `VITE_AZURE_CLIENT_ID` |
| `tenantId` | `string` | Entra ID Tenant ID | `VITE_AZURE_TENANT_ID` |
| `redirectUri` | `string` | OAuth redirect URI | `VITE_AZURE_REDIRECT_URI` |
| `apiScope` | `string` | API permission scope | `VITE_API_SCOPE` |
| `authority` | `string` | Entra ID authority URL | Derived from tenantId |

**Validation**: All fields required; validated at application startup with Zod.

---

## State Transitions

### Authentication Flow

```
┌─────────────────┐
│  Unauthenticated │
└────────┬────────┘
         │ User clicks Login / Accesses protected route
         ▼
┌─────────────────┐
│  Login Redirect  │ (inProgress = Login)
└────────┬────────┘
         │ Entra ID authentication
         ▼
┌─────────────────┐
│  Callback       │ (handleRedirectPromise)
└────────┬────────┘
         │ Tokens received
         ▼
┌─────────────────┐
│  Authenticated   │ (isAuthenticated = true)
└────────┬────────┘
         │ User clicks Logout / Session expires
         ▼
┌─────────────────┐
│  Logout Redirect │ (inProgress = Logout)
└────────┬────────┘
         │ Entra ID logout
         ▼
┌─────────────────┐
│  Unauthenticated │
└─────────────────┘
```

### Session Timeout Flow

```
┌─────────────────┐
│  Active Session  │ (lastActivityTime recent)
└────────┬────────┘
         │ User performs action
         ▼
┌─────────────────┐
│  Update Activity │ (lastActivityTime = now)
└────────┬────────┘
         │ Time passes (> 1 hour inactivity)
         ▼
┌─────────────────┐
│  Session Expired │ (on next action)
└────────┬────────┘
         │ Show notification
         ▼
┌─────────────────┐
│  Redirect Login  │
└─────────────────┘
```

## Relationships

```
┌─────────────────────────────────────────────────────────┐
│                    MsalProvider                          │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │  AuthConfig     │───▶│  PublicClientApplication    │ │
│  └─────────────────┘    └──────────────┬──────────────┘ │
│                                        │                 │
│                         ┌──────────────┴──────────────┐ │
│                         ▼                              ▼ │
│              ┌─────────────────┐          ┌───────────┐ │
│              │ AuthenticationState│◀─────▶│ AccountInfo│ │
│              └─────────────────┘          └───────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────┐
              │ SessionActivity  │ (Application-level)
              └─────────────────┘
```

## Token Management

MSAL handles token storage internally:

| Token Type | Purpose | Lifetime | Storage |
|------------|---------|----------|---------|
| ID Token | User identity claims | ~1 hour | sessionStorage (MSAL cache) |
| Access Token | API authorization | ~1 hour | sessionStorage (MSAL cache) |
| Refresh Token | Token renewal | Varies | Not stored in SPA (per security best practice) |

**Note**: MSAL automatically refreshes access tokens via `acquireTokenSilent` using iframe-based refresh before expiration.
