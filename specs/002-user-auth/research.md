# Research: User Authentication

**Feature**: 002-user-auth  
**Date**: January 19, 2026  
**Status**: Complete

## Research Tasks

### 1. MSAL.js React Integration Pattern

**Question**: What is the recommended pattern for integrating MSAL.js with React Router in a Vite SPA?

**Decision**: Use `@azure/msal-react` with `MsalProvider` at the app root, combined with custom `NavigationClient` for React Router integration.

**Rationale**:
- `@azure/msal-react` provides official React bindings with hooks (`useMsal`, `useIsAuthenticated`) and components (`AuthenticatedTemplate`, `UnauthenticatedTemplate`)
- Custom `NavigationClient` allows MSAL to use React Router's navigation instead of full page reloads, maintaining SPA behavior
- MsalProvider must wrap the entire app but be placed inside BrowserRouter for navigation access

**Alternatives Considered**:
- Direct `@azure/msal-browser` without React wrapper → Rejected: Would require manual context management, more boilerplate
- Third-party auth libraries (Auth0, etc.) → Rejected: User specified Entra ID + MSAL.js

**Key Code Pattern**:
```tsx
// MsalProvider inside Router for NavigationClient access
<BrowserRouter>
  <MsalProviderWithNavigation>
    <Routes>...</Routes>
  </MsalProviderWithNavigation>
</BrowserRouter>
```

---

### 2. Session Timeout Implementation

**Question**: How to implement 1-hour session timeout with MSAL.js?

**Decision**: Combine MSAL's built-in token expiration with application-level activity tracking for session timeout notification.

**Rationale**:
- MSAL automatically handles token refresh via `acquireTokenSilent`
- Access tokens default to ~1 hour expiration in Entra ID
- For user-facing session timeout, track last activity and check on navigation/API calls
- Show notification before auto-redirect to login

**Implementation Approach**:
1. Store `lastActivityTime` in session storage
2. Update on user interactions (navigation, API calls)
3. Check on route changes and API requests
4. If expired: show toast notification, then redirect to login

**Alternatives Considered**:
- Rely solely on MSAL token expiration → Rejected: No user notification before redirect
- Background timer checking session → Rejected: Unnecessary complexity, battery drain

---

### 3. Post-Login Redirect Preservation

**Question**: How to preserve and restore the originally requested URL after Entra ID redirect flow?

**Decision**: Use MSAL's built-in `state` parameter with React Router's `useLocation` to store and retrieve the intended destination.

**Rationale**:
- MSAL's redirect flow supports passing custom state through the OAuth flow
- Store the current pathname + search in `loginRequest.state`
- On redirect callback, extract state and navigate to original URL
- Fallback to dashboard ("/") if no state present

**Implementation**:
```tsx
// Before redirect
const loginRequest = {
  scopes: ["openid", "profile", "User.Read"],
  state: JSON.stringify({ returnUrl: location.pathname + location.search })
};

// After redirect (in handleRedirectPromise callback)
const state = JSON.parse(response.state || "{}");
navigate(state.returnUrl || "/");
```

**Alternatives Considered**:
- Session storage for return URL → Works but MSAL state is more reliable through OAuth flow
- URL query parameter → Visible to user, less clean

---

### 4. Protected Route Implementation

**Question**: What is the best pattern for protecting routes in React Router v7 with MSAL?

**Decision**: Create a `ProtectedRoute` component that checks authentication status and redirects unauthenticated users.

**Rationale**:
- Follows Constitution I (Component-First Architecture) - self-contained, reusable
- Uses MSAL's `useIsAuthenticated` hook for auth state
- Stores current location before redirect for post-login restoration
- Shows loading state during auth check (Constitution II - UX Consistency)

**Pattern**:
```tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const location = useLocation();

  if (inProgress !== InteractionStatus.None) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Store location for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
```

**Alternatives Considered**:
- `MsalAuthenticationTemplate` component → Considered but ProtectedRoute gives more control over redirect behavior
- Route-level middleware → React Router v7 doesn't have traditional middleware

---

### 5. API Client Token Integration

**Question**: How to attach access tokens to API requests?

**Decision**: Modify the existing `apiClient` to accept an optional token parameter, with a wrapper hook that acquires tokens before requests.

**Rationale**:
- Existing `apiClient` is well-structured; minimal changes needed
- Use `acquireTokenSilent` before API calls to get fresh tokens
- Handle `InteractionRequiredAuthError` by triggering interactive login
- Token acquisition should be handled at the hook level, not in every component

**Implementation**:
```tsx
// Updated apiClient signature
export async function apiClient<T>(
  endpoint: string, 
  config?: RequestConfig & { accessToken?: string }
): Promise<T>

// Hook handles token acquisition
function useAuthenticatedApi() {
  const { instance, accounts } = useMsal();
  
  const callApi = async (endpoint, config) => {
    const token = await instance.acquireTokenSilent({
      scopes: [import.meta.env.VITE_API_SCOPE],
      account: accounts[0]
    });
    return apiClient(endpoint, { ...config, accessToken: token.accessToken });
  };
  
  return { callApi };
}
```

**Alternatives Considered**:
- Axios interceptors → Would require adding Axios dependency; current fetch-based client is simpler
- Global token in context → Less explicit about when tokens are needed

---

### 6. Environment Configuration

**Question**: What environment variables are needed for MSAL configuration?

**Decision**: Use Vite's `import.meta.env` with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_AZURE_CLIENT_ID` | Entra ID Application (client) ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `VITE_AZURE_TENANT_ID` | Entra ID Directory (tenant) ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `VITE_AZURE_REDIRECT_URI` | OAuth redirect URI | `http://localhost:5173` |
| `VITE_API_SCOPE` | API scope for token requests | `api://xxx/.default` |

**Rationale**:
- `VITE_` prefix required for Vite to expose to client code
- Separate from existing `VITE_API_BASE_URL` which remains for API endpoint
- Tenant ID enables single-tenant authentication (more secure than multi-tenant)

---

### 7. Logout Implementation

**Question**: What logout method should be used - popup or redirect?

**Decision**: Use `logoutRedirect` with `postLogoutRedirectUri` pointing to the login page.

**Rationale**:
- Redirect is more reliable across browsers than popup
- Clear session on Entra ID side, not just local tokens
- User ends up on login page, ready to re-authenticate if needed
- Consistent with the login experience (both use redirect)

**Implementation**:
```tsx
const handleLogout = () => {
  instance.logoutRedirect({
    postLogoutRedirectUri: window.location.origin + "/login"
  });
};
```

**Alternatives Considered**:
- `logoutPopup` → Can be blocked by popup blockers
- Local-only logout (clear cache without server logout) → Less secure, session may persist on Entra ID

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@azure/msal-browser` | ^3.x | Core MSAL library for browser |
| `@azure/msal-react` | ^2.x | React bindings for MSAL |

**Note**: No new dependencies beyond MSAL packages. React Router already present in project.

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Token refresh failure | Low | High | Handle `InteractionRequiredAuthError`, prompt re-login |
| Popup blockers affecting auth | Low | Medium | Using redirect flow, not popup |
| Session timeout UX confusion | Medium | Medium | Clear notification before redirect |
| Environment config errors | Medium | High | Zod validation of env vars at startup |
