# Implementation Plan: User Authentication

**Branch**: \`002-user-auth\` | **Date**: January 19, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from \`/specs/002-user-auth/spec.md\`

## Summary

Add Microsoft Entra ID authentication to the OKR web application using MSAL.js (Microsoft Authentication Library). Users will authenticate via Entra ID with redirect-based login flow, maintaining 1-hour session timeout with automatic token refresh. The implementation preserves the originally requested URL for post-login redirect.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19.x  
**Primary Dependencies**: @azure/msal-browser, @azure/msal-react, react-router-dom v7  
**Storage**: Browser sessionStorage (MSAL default for token cache)  
**Testing**: Vitest + React Testing Library (per constitution)  
**Target Platform**: Modern browsers (ES2020+, Vite SPA)  
**Project Type**: Web SPA (single frontend)  
**Performance Goals**: Login completion < 30 seconds (SC-001)  
**Constraints**: 1-hour session timeout (FR-003, FR-009), WCAG 2.1 AA compliance (Constitution II)  
**Scale/Scope**: Single-tenant Entra ID application

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ PASS | Auth components in \`src/features/auth/\`, shared context via MsalProvider |
| II. UX Consistency | ✅ PASS | Loading states during auth, error messages for failed login, keyboard navigable |
| III. Type Safety & Code Quality | ✅ PASS | Full TypeScript, MSAL types included, Zod for env validation |
| IV. Vite SPA Conventions | ✅ PASS | Client-side routing via React Router, lazy loading maintained, \`import.meta.env\` for config |
| V. Simplicity & Incremental Delivery | ✅ PASS | Using MSAL.js (official Microsoft library), minimal custom code |

**Pre-Design Gate**: PASSED

### Post-Design Re-check (Phase 1 Complete)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ PASS | \`ProtectedRoute\`, \`LoginPage\`, \`AuthProvider\` are self-contained; \`useAuth\` hook for reuse |
| II. UX Consistency | ✅ PASS | Loading spinner during auth check; toast notification for session expiry; accessible forms |
| III. Type Safety & Code Quality | ✅ PASS | Zod validation for env vars; MSAL provides full TypeScript types |
| IV. Vite SPA Conventions | ✅ PASS | Custom \`NavigationClient\` for SPA routing; \`import.meta.env\` for config |
| V. Simplicity & Incremental Delivery | ✅ PASS | 2 new dependencies (MSAL packages); reuses existing UI components |

**Post-Design Gate**: PASSED

## Project Structure

### Documentation (this feature)

\`\`\`text
specs/002-user-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── auth-config.md   # MSAL configuration contract
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
\`\`\`

### Source Code (repository root)

\`\`\`text
src/
├── features/
│   └── auth/
│       ├── authConfig.ts         # MSAL configuration
│       ├── AuthProvider.tsx      # MsalProvider wrapper with initialization
│       ├── ProtectedRoute.tsx    # Route guard component
│       ├── LoginPage.tsx         # Login UI with redirect handling
│       └── useAuth.ts            # Custom hook for auth state/actions
├── components/
│   └── layout/
│       └── Header.tsx            # Updated with user info + logout button
├── api/
│   └── client.ts                 # Updated to attach access tokens
├── App.tsx                       # Updated with MsalProvider + protected routes
└── main.tsx                      # Entry point (minimal changes)
\`\`\`

**Structure Decision**: Single SPA following existing feature-based organization. Auth feature lives in \`src/features/auth/\` per Constitution I (Component-First Architecture).

## Complexity Tracking

> No violations identified. Implementation uses standard patterns.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
