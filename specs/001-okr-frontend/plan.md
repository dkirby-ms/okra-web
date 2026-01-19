# Implementation Plan: OKR Management Frontend

**Branch**: `001-okr-frontend` | **Date**: 2026-01-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-okr-frontend/spec.md`

## Summary

Build a Vite-based React SPA for managing Objectives and Key Results. The frontend consumes an existing REST API (documented at http://localhost:3000/api/docs) to display dashboards with progress summaries, manage objectives and key results via CRUD operations, and organize goals by time periods. Key UX patterns include sidebar navigation, slide-out panels for forms, and calculated status indicators based on time elapsed vs. progress achieved.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)  
**Primary Dependencies**: React 18.x, React Router v6, Tailwind CSS, shadcn/ui, TanStack Query, Zod  
**Storage**: N/A (frontend only; backend API handles persistence)  
**Testing**: Vitest + React Testing Library  
**Target Platform**: Modern browsers (ES2020+), viewport 320px-1920px  
**Project Type**: Single SPA (frontend-only, backend exists separately)  
**Performance Goals**: Initial load <3s, UI feedback <200ms for 95% of actions  
**Constraints**: No authentication in MVP; single-user context  
**Scale/Scope**: ~8 routes, ~20 components, 4 API domains (objectives, key-results, time-periods, reports)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ PASS | Feature components co-located; shared components in `src/components/ui/` via shadcn/ui |
| II. UX Consistency (NON-NEGOTIABLE) | ✅ PASS | Tailwind design tokens; explicit loading/error states in spec; keyboard nav (FR-024) |
| III. Type Safety & Code Quality | ✅ PASS | TypeScript strict mode; Zod for API validation; ESLint + Prettier |
| IV. Vite SPA Conventions | ✅ PASS | React Router for client routing; lazy loading for routes; `import.meta.env` for config |
| V. Simplicity & Incremental Delivery | ✅ PASS | 4 user stories as vertical slices; TanStack Query over custom cache; shadcn/ui over custom components |

**Gate Result**: PASS — No violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-okr-frontend/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API types from OpenAPI)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── api/                    # API client layer
│   ├── client.ts           # Fetch wrapper with error handling
│   ├── objectives.ts       # Objectives API functions
│   ├── key-results.ts      # Key Results API functions
│   ├── time-periods.ts     # Time Periods API functions
│   └── reports.ts          # Reports API functions
├── components/
│   ├── ui/                 # shadcn/ui components (Button, Input, Sheet, etc.)
│   ├── layout/             # App shell components
│   │   ├── Sidebar.tsx
│   │   ├── AppShell.tsx
│   │   └── Header.tsx
│   └── shared/             # Reusable domain components
│       ├── ProgressBar.tsx
│       ├── StatusBadge.tsx
│       ├── ConfirmDialog.tsx
│       └── EmptyState.tsx
├── features/
│   ├── dashboard/          # US1: View and Track Progress
│   │   ├── DashboardPage.tsx
│   │   ├── ProgressSummaryCard.tsx
│   │   └── StatusDistributionChart.tsx
│   ├── objectives/         # US2: Manage Objectives
│   │   ├── ObjectivesPage.tsx
│   │   ├── ObjectiveList.tsx
│   │   ├── ObjectiveCard.tsx
│   │   ├── ObjectiveDetail.tsx
│   │   └── ObjectiveForm.tsx
│   ├── key-results/        # US3: Manage Key Results
│   │   ├── KeyResultList.tsx
│   │   ├── KeyResultCard.tsx
│   │   ├── KeyResultForm.tsx
│   │   └── ProgressInput.tsx
│   └── time-periods/       # US4: Manage Time Periods
│       ├── TimePeriodsPage.tsx
│       ├── TimePeriodList.tsx
│       └── TimePeriodForm.tsx
├── hooks/                  # Custom React hooks
│   ├── useObjectives.ts
│   ├── useKeyResults.ts
│   ├── useTimePeriods.ts
│   └── useReports.ts
├── lib/                    # Utilities
│   ├── utils.ts            # cn() helper, date formatting
│   └── status-calculator.ts # Time-based status calculation
├── types/                  # TypeScript types & Zod schemas
│   ├── objective.ts
│   ├── key-result.ts
│   ├── time-period.ts
│   └── api.ts
├── App.tsx                 # Root component with router
├── main.tsx                # Entry point
└── index.css               # Tailwind imports

tests/
├── unit/                   # Component unit tests
├── integration/            # Feature integration tests
└── setup.ts                # Test configuration

public/
└── (static assets)

# Config files at root
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.js
└── package.json
```

**Structure Decision**: Single SPA structure selected. Backend API exists separately at `localhost:3000`. All frontend code lives in `src/` with feature-based organization per Constitution Principle I (Component-First Architecture).

## Complexity Tracking

> No violations identified. Section intentionally left minimal.

## Constitution Re-Check (Post Phase 1 Design)

*GATE: Re-evaluated after research.md, data-model.md, and contracts/ completed.*

| Principle | Status | Post-Design Notes |
|-----------|--------|-------------------|
| I. Component-First Architecture | ✅ PASS | Feature structure defined; shadcn/ui provides accessible primitives; shared components identified |
| II. UX Consistency (NON-NEGOTIABLE) | ✅ PASS | Design tokens via Tailwind; Sheet component for slide-out panels; Toast for feedback; Progress component for visual indicators |
| III. Type Safety & Code Quality | ✅ PASS | Zod schemas defined in contracts/api.md; TypeScript strict mode; all DTOs typed |
| IV. Vite SPA Conventions | ✅ PASS | Route structure defined; lazy loading planned; environment variables use `VITE_` prefix |
| V. Simplicity & Incremental Delivery | ✅ PASS | 4 user stories as vertical slices; dependencies justified in research.md; no over-engineering |

**Gate Result**: PASS — Design phase complete. Ready for `/speckit.tasks` to generate implementation tasks.
