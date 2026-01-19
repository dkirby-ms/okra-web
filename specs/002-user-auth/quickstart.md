# Quickstart: User Authentication

**Feature**: 002-user-auth  
**Date**: January 19, 2026

## Prerequisites

1. **Azure Subscription** with access to Microsoft Entra ID
2. **Node.js** 18+ installed
3. **Existing Okra-Web project** cloned and dependencies installed

## 1. Register Application in Entra ID

### Step 1.1: Create App Registration

1. Navigate to [Azure Portal](https://portal.azure.com) → Microsoft Entra ID → App registrations
2. Click **New registration**
3. Configure:
   - **Name**: `okra-web` (or your preferred name)
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Single-page application (SPA) → `http://localhost:5173`
4. Click **Register**

### Step 1.2: Note Application IDs

After registration, note these values from the **Overview** page:
- **Application (client) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Directory (tenant) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Step 1.3: Configure Authentication

1. Go to **Authentication** in the left menu
2. Under **Single-page application**:
   - Verify redirect URI is `http://localhost:5173`
   - Add production URL when ready (e.g., `https://okra.yourdomain.com`)
3. Under **Implicit grant and hybrid flows**:
   - Check **ID tokens**
   - Leave **Access tokens** unchecked (SPA uses auth code flow)
4. Click **Save**

### Step 1.4: Configure API Permissions

1. Go to **API permissions**
2. Click **Add a permission** → **Microsoft Graph** → **Delegated permissions**
3. Add:
   - `openid`
   - `profile`
   - `User.Read`
4. Click **Grant admin consent for [Your Organization]** (if you have admin rights)

## 2. Configure Environment Variables

### Step 2.1: Create .env

```bash
cp .env.example .env
```

### Step 2.2: Edit .env

```env
# Microsoft Entra ID Configuration
VITE_AZURE_CLIENT_ID=your-client-id-from-step-1.2
VITE_AZURE_TENANT_ID=your-tenant-id-from-step-1.2
VITE_AZURE_REDIRECT_URI=http://localhost:5173

# Existing API configuration
VITE_API_BASE_URL=/api/v1
```

> **Note**: `.env` is already in `.gitignore`, so your credentials won't be committed.

## 3. Install Dependencies

```bash
npm install @azure/msal-browser @azure/msal-react
```

## 4. Verify Setup

### Step 4.1: Start Development Server

```bash
npm run dev
```

### Step 4.2: Test Login Flow

1. Open browser to `http://localhost:5173`
2. You should be redirected to Microsoft login
3. Sign in with your organizational account
4. After successful login, you'll be redirected to the dashboard

### Step 4.3: Test Logout

1. Click the logout button in the header
2. You should be redirected to the login page
3. Try accessing `/objectives` directly - should redirect to login

### Step 4.4: Test Session Timeout

1. Log in successfully
2. Wait 1 hour (or temporarily reduce `VITE_SESSION_TIMEOUT_MINUTES` to `1` for testing)
3. Perform any action
4. You should see a "Session expired" notification and be redirected to login

## 5. Common Issues & Solutions

### Issue: "AADSTS50011: Reply URL does not match"

**Cause**: Redirect URI mismatch between app registration and environment variable

**Solution**:
1. Check `VITE_AZURE_REDIRECT_URI` matches exactly what's registered in Azure
2. Include protocol (`http://` or `https://`)
3. No trailing slash

### Issue: "AADSTS700054: Invalid client secret"

**Cause**: SPA shouldn't use client secrets

**Solution**: This error shouldn't occur with SPA. Verify your app registration is configured as a Single-page application, not a Web application.

### Issue: Infinite redirect loop

**Cause**: MSAL not properly handling redirect callback

**Solution**:
1. Ensure `handleRedirectPromise()` is called on app initialization
2. Check that redirect URI is exactly `http://localhost:5173` (no trailing slash)

### Issue: "User not authenticated" after refresh

**Cause**: Session storage cleared or token expired

**Solution**:
1. Check browser dev tools → Application → Session Storage for MSAL cache
2. Verify tokens exist and haven't expired
3. Try clearing cache and logging in again

## 6. Development Tips

### Enable MSAL Logging

For debugging, MSAL logging is enabled in development mode. Check browser console for auth flow details.

### Testing with Different Users

1. Use browser incognito/private mode for fresh sessions
2. Or use `instance.logout()` to fully clear session before testing another user

### Mock Authentication (for UI development)

If you need to develop UI without real authentication:
1. Create a `mockAuth` flag in environment
2. Wrap `MsalProvider` conditionally to provide mock context
3. Remember to disable before deployment!

## Next Steps

After completing this quickstart:

1. **Implement protected API calls** - Use `acquireTokenSilent` to get access tokens
2. **Add user profile display** - Show user name/email in header
3. **Configure production redirect URI** - Add your production URL to app registration
4. **Set up CI/CD** - Ensure environment variables are configured in deployment
