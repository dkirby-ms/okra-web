# Research: OKR Management Frontend

**Feature**: 001-okr-frontend  
**Date**: 2026-01-18  
**Status**: Complete

## Research Tasks

### 1. Vite + React + TypeScript Project Setup

**Decision**: Use `npm create vite@latest` with React + TypeScript template

**Rationale**:
- Official Vite template ensures correct configuration out of the box
- TypeScript strict mode enabled by default in template
- HMR works immediately without additional configuration
- Aligns with Constitution Principle IV (Vite SPA Conventions)

**Alternatives considered**:
- Create React App: Deprecated, slower builds, no longer maintained
- Next.js: SSR/SSG overhead unnecessary for SPA; adds complexity
- Manual setup: Error-prone, time-consuming

### 2. Component Library Selection

**Decision**: shadcn/ui with Tailwind CSS

**Rationale**:
- Components are copied into project (not npm dependency), enabling full customization
- Built on Radix UI primitives with excellent accessibility (keyboard nav, ARIA)
- Tailwind integration provides consistent design tokens per Constitution Principle II
- Sheet component provides slide-out drawer pattern needed for forms
- No runtime bundle size from unused components

**Alternatives considered**:
- Material UI: Larger bundle, opinionated styling harder to customize
- Chakra UI: Good accessibility but heavier runtime
- Headless UI: Requires more custom styling work
- Custom components: Violates Principle V (Simplicity)

### 3. State Management & Data Fetching

**Decision**: TanStack Query (React Query) for server state

**Rationale**:
- Automatic caching, background refetching, and stale-while-revalidate
- Built-in loading/error states reduce boilerplate
- Optimistic updates for immediate UI feedback (SC-004: <200ms)
- Devtools for debugging cache state
- Constitution allows "TanStack Query for caching" in Technology Stack

**Alternatives considered**:
- Plain fetch + useState: Manual cache management, race conditions, no deduplication
- SWR: Similar to TanStack Query but fewer features
- Redux Toolkit Query: Heavier, requires Redux setup
- Zustand: Good for client state but not optimized for server state

### 4. Form Handling & Validation

**Decision**: React Hook Form + Zod

**Rationale**:
- React Hook Form: Uncontrolled inputs for performance, minimal re-renders
- Zod: TypeScript-first schema validation, reusable for API response validation
- `@hookform/resolvers` connects both seamlessly
- Aligns with Constitution Principle III (API responses validated against schemas)

**Alternatives considered**:
- Formik: More re-renders, larger bundle
- Native form validation: Limited, inconsistent across browsers
- Yup: Not as TypeScript-native as Zod

### 5. Routing Strategy

**Decision**: React Router v6 with lazy loading

**Rationale**:
- Industry standard for React SPAs
- Data loaders and actions for route-level data fetching
- Lazy loading via `React.lazy()` + `Suspense` for code splitting
- Outlet pattern for nested layouts (AppShell > Feature pages)

**Routes defined**:
| Path | Component | Description |
|------|-----------|-------------|
| `/` | `DashboardPage` | Progress summary & status distribution |
| `/objectives` | `ObjectivesPage` | List all objectives |
| `/objectives/:id` | `ObjectiveDetail` | Single objective with key results |
| `/time-periods` | `TimePeriodsPage` | Manage time periods |

### 6. API Client Architecture

**Decision**: Typed fetch wrapper with Zod validation

**Rationale**:
- Single `client.ts` handles base URL, error formatting, JSON parsing
- Domain-specific modules (`objectives.ts`, `key-results.ts`, etc.) export typed functions
- Zod schemas validate API responses at runtime, catching backend contract changes
- TanStack Query hooks wrap API functions for caching

**API Base URL**: Configured via `VITE_API_BASE_URL` environment variable (default: `http://localhost:3000/api/v1`)

### 7. Status Calculation Logic

**Decision**: Frontend calculates status from time period dates and progress

**Rationale**:
- Spec clarification: "Status is calculated based on time elapsed vs. progress achieved"
- Backend provides raw data; frontend derives status for display
- Formula: `expectedProgress = timeElapsed / totalDuration`, compare to `actualProgress`
  - On-track: `actualProgress >= expectedProgress * 0.9`
  - At-risk: `actualProgress >= expectedProgress * 0.5`
  - Behind: `actualProgress < expectedProgress * 0.5`

**Implementation**: `src/lib/status-calculator.ts` utility function

### 8. Testing Strategy

**Decision**: Vitest + React Testing Library + MSW

**Rationale**:
- Vitest: Native Vite integration, fast, Jest-compatible API
- React Testing Library: Tests user behavior, not implementation
- MSW (Mock Service Worker): Intercepts network requests for integration tests
- Aligns with Constitution quality gates (test suite must pass)

**Coverage targets**:
- Unit: Utility functions, status calculator, API client
- Integration: User flows (create objective, update progress)
- E2E: Deferred to future iteration (Playwright)

## Dependency Justification

| Dependency | Justification |
|------------|---------------|
| react, react-dom | Core UI framework (Constitution stack) |
| react-router-dom | Client-side routing (Constitution stack) |
| @tanstack/react-query | Server state management (Constitution allows) |
| zod | Runtime type validation (Constitution Principle III) |
| react-hook-form | Form state management (performance, minimal bundle) |
| @hookform/resolvers | Zod integration for react-hook-form |
| tailwindcss | Styling (Constitution stack) |
| shadcn/ui components | Accessible UI primitives (copied, not installed) |
| clsx, tailwind-merge | Conditional class utilities for Tailwind |
| lucide-react | Icons (shadcn/ui default, tree-shakeable) |
| date-fns | Date formatting/calculation (lightweight vs moment) |

**Dev dependencies**:
| Dependency | Justification |
|------------|---------------|
| vite | Build tool (Constitution stack) |
| typescript | Language (Constitution stack) |
| vitest | Testing (Constitution stack) |
| @testing-library/react | Component testing |
| msw | API mocking for tests |
| eslint, prettier | Code quality (Constitution workflow) |
| @types/* | TypeScript definitions |

## Open Questions (Resolved)

All NEEDS CLARIFICATION items from Technical Context have been resolved through research and spec clarifications. No blockers for Phase 1.
