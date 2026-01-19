# Tasks: User Authentication

**Input**: Design documents from `/specs/002-user-auth/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not explicitly requested - test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create basic auth module structure

- [X] T001 Install MSAL dependencies: `npm install @azure/msal-browser @azure/msal-react`
- [X] T002 [P] Create auth feature directory structure at src/features/auth/
- [X] T003 [P] Create auth types file in src/features/auth/types.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core MSAL configuration and provider that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create Zod schema for auth environment validation in src/features/auth/authConfig.ts
- [X] T005 Implement MSAL configuration factory in src/features/auth/authConfig.ts
- [X] T006 Create PublicClientApplication instance initialization in src/features/auth/authConfig.ts
- [X] T007 Create custom NavigationClient for React Router in src/features/auth/NavigationClient.ts
- [X] T008 Implement AuthProvider component with MsalProvider wrapper in src/features/auth/AuthProvider.tsx
- [X] T009 Create useAuth custom hook for auth state and actions in src/features/auth/useAuth.ts
- [X] T010 Wrap App component with AuthProvider in src/main.tsx

**Checkpoint**: Foundation ready - MSAL initialized, auth context available throughout app

---

## Phase 3: User Story 1 - User Login (Priority: P1) 🎯 MVP

**Goal**: Users can log into the application via Microsoft Entra ID

**Independent Test**: Navigate to app → Redirected to login → Click sign in → Authenticate with Entra ID → Arrive at dashboard

### Implementation for User Story 1

- [X] T011 [US1] Create LoginPage component with sign-in button in src/features/auth/LoginPage.tsx
- [X] T012 [US1] Add loading state UI during authentication in src/features/auth/LoginPage.tsx
- [X] T013 [US1] Implement error display for failed login attempts in src/features/auth/LoginPage.tsx
- [X] T014 [US1] Add /login route to App.tsx routing configuration
- [X] T015 [US1] Handle redirect callback with handleRedirectPromise in src/features/auth/AuthProvider.tsx

**Checkpoint**: Users can successfully log in via Entra ID and reach the dashboard

---

## Phase 4: User Story 2 - Redirect After Login (Priority: P1)

**Goal**: Users are redirected to their originally requested page after authentication

**Independent Test**: Visit /objectives/123 while logged out → Complete login → Arrive at /objectives/123

### Implementation for User Story 2

- [X] T016 [US2] Store returnUrl in MSAL login request state parameter in src/features/auth/useAuth.ts
- [X] T017 [US2] Extract and navigate to returnUrl after successful login in src/features/auth/AuthProvider.tsx
- [X] T018 [US2] Default to dashboard ("/") when no returnUrl is present in src/features/auth/AuthProvider.tsx

**Checkpoint**: Post-login redirect preserves originally requested URL

---

## Phase 5: User Story 3 - User Logout (Priority: P1)

**Goal**: Users can log out and their session is terminated

**Independent Test**: Log in → Click logout button → Session cleared → Cannot access protected routes

### Implementation for User Story 3

- [X] T019 [US3] Implement logout function using logoutRedirect in src/features/auth/useAuth.ts
- [X] T020 [US3] Update Header component with user display name in src/components/layout/Header.tsx
- [X] T021 [US3] Add logout button to Header component in src/components/layout/Header.tsx
- [X] T022 [US3] Style user info and logout button consistent with existing design in src/components/layout/Header.tsx

**Checkpoint**: Users can log out, session is terminated, header shows user info when authenticated

---

## Phase 6: User Story 4 - Session Timeout (Priority: P2)

**Goal**: Sessions automatically expire after 1 hour of inactivity

**Independent Test**: Log in → Wait 1 hour (or simulate) → Perform action → See timeout notification → Redirected to login

### Implementation for User Story 4

- [X] T023 [US4] Create session activity tracker utility in src/features/auth/sessionActivity.ts
- [X] T024 [US4] Implement lastActivityTime storage in sessionStorage in src/features/auth/sessionActivity.ts
- [X] T025 [US4] Add activity update on navigation in src/features/auth/useAuth.ts
- [X] T026 [US4] Check session expiry on route changes in src/features/auth/ProtectedRoute.tsx
- [X] T027 [US4] Display toast notification when session expires using existing Sonner integration

**Checkpoint**: Sessions expire after 1 hour inactivity with user notification

---

## Phase 7: User Story 5 - Protected Route Access (Priority: P2)

**Goal**: All routes except /login are protected from unauthenticated access

**Independent Test**: Clear session → Visit /objectives → Redirected to /login → Visit /time-periods → Redirected to /login

### Implementation for User Story 5

- [X] T028 [US5] Create ProtectedRoute component with auth check in src/features/auth/ProtectedRoute.tsx
- [X] T029 [US5] Add loading spinner during auth status check in src/features/auth/ProtectedRoute.tsx
- [X] T030 [US5] Store intended destination before redirect in src/features/auth/ProtectedRoute.tsx
- [X] T031 [US5] Wrap all existing routes with ProtectedRoute in src/App.tsx
- [X] T032 [US5] Redirect authenticated users from /login to dashboard in src/features/auth/LoginPage.tsx

**Checkpoint**: All routes protected, unauthenticated users redirected to login

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: API integration, documentation, and final validation

- [X] T033 [P] Update apiClient to accept and attach access tokens in src/api/client.ts
- [X] T034 [P] Create useAuthenticatedApi hook for token-attached requests in src/features/auth/useAuthenticatedApi.ts
- [X] T035 [P] Add TypeScript exports from src/features/auth/index.ts
- [ ] T036 Run quickstart.md validation to verify end-to-end auth flow *(Manual: requires Azure credentials)*
- [ ] T037 Verify all acceptance scenarios from spec.md pass manually *(Manual: requires Azure credentials)*

**⚠️ T036 & T037 require configured Azure Entra ID credentials in `.env` to complete.**

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
  - US1 (Login), US2 (Redirect), US3 (Logout) are P1 - complete these for MVP
  - US4 (Session Timeout), US5 (Protected Routes) are P2 - complete for full feature
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational - Integrates with US1 login flow
- **User Story 3 (P1)**: Can start after Foundational - Independent of US1/US2
- **User Story 4 (P2)**: Can start after Foundational - Independent, but benefits from US5 (ProtectedRoute)
- **User Story 5 (P2)**: Can start after Foundational - Shares redirect logic with US2

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Within Phase 1 (Setup)**:
- T002 and T003 can run in parallel

**Within Phase 2 (Foundational)**:
- T004, T005, T006 must be sequential (config → factory → instance)
- T007 can run in parallel with T004-T006
- T008 depends on T006 and T007
- T009 depends on T008
- T010 depends on T008

**Across User Stories (after Foundational)**:
- US1, US3 can start in parallel (different components)
- US2 integrates with US1 (sequential recommended)
- US4, US5 can start in parallel (different files)

**Within Phase 8 (Polish)**:
- T033, T034, T035 can all run in parallel

---

## Parallel Example: After Foundational

```bash
# After Phase 2 completes, two developers can split work:

# Developer A: Core Login Flow (US1 + US2)
T011 → T012 → T013 → T014 → T015 → T016 → T017 → T018

# Developer B: Logout + Session (US3 + US4)
T019 → T020 → T021 → T022 → T023 → T024 → T025 → T026 → T027

# Then converge for US5 (Protected Routes) which integrates both paths
```

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Login)
4. Complete Phase 4: User Story 2 (Redirect)
5. Complete Phase 5: User Story 3 (Logout)
6. **STOP and VALIDATE**: Test login → redirect → logout flow
7. Deploy/demo MVP

### Full Feature

1. Complete MVP (Phases 1-5)
2. Complete Phase 6: User Story 4 (Session Timeout)
3. Complete Phase 7: User Story 5 (Protected Routes)
4. Complete Phase 8: Polish
5. Final validation against spec.md acceptance scenarios

---

## Notes

- All tasks use strict TypeScript per Constitution III
- MSAL provides type definitions - no additional type packages needed
- Loading states required per Constitution II (UX Consistency)
- Use existing UI components (Button, Card) from src/components/ui/
- Toast notifications via existing Sonner integration
- No console.log in production - MSAL logger handles auth debugging
