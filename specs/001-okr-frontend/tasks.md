# Tasks: OKR Management Frontend

**Input**: Design documents from `/specs/001-okr-frontend/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Not explicitly requested in feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single SPA project**: `src/` at repository root per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Vite + React + TypeScript scaffold

- [ ] T001 Initialize Vite project with React + TypeScript template using `npm create vite@latest`
- [ ] T002 Install core dependencies (react-router-dom, @tanstack/react-query, zod, react-hook-form, @hookform/resolvers) in package.json
- [ ] T003 [P] Install and configure Tailwind CSS with postcss and autoprefixer in tailwind.config.ts
- [ ] T004 [P] Initialize shadcn/ui and install required components (button, input, label, sheet, dialog, card, progress, toast) in src/components/ui/
- [ ] T005 [P] Configure TypeScript strict mode and path aliases in tsconfig.json
- [ ] T006 [P] Configure Vite with path aliases and API proxy in vite.config.ts
- [ ] T007 [P] Configure ESLint and Prettier with pre-commit rules in eslint.config.js and .prettierrc
- [ ] T008 Create environment configuration with VITE_API_BASE_URL in .env and .env.example

**Checkpoint**: Project builds and runs with `npm run dev`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Create TypeScript types and Zod schemas for Objective in src/types/objective.ts
- [ ] T010 [P] Create TypeScript types and Zod schemas for KeyResult in src/types/key-result.ts
- [ ] T011 [P] Create TypeScript types and Zod schemas for TimePeriod in src/types/time-period.ts
- [ ] T012 [P] Create TypeScript types and Zod schemas for API responses (ProgressSummary, StatusDistribution, Error) in src/types/api.ts
- [ ] T013 Implement API client with fetch wrapper, error handling, and base URL config in src/api/client.ts
- [ ] T014 [P] Implement Objectives API functions (list, get, create, update, delete) in src/api/objectives.ts
- [ ] T015 [P] Implement Key Results API functions (list, listByObjective, get, create, update, updateProgress, delete) in src/api/key-results.ts
- [ ] T016 [P] Implement Time Periods API functions (list, get, create, update, archive, delete) in src/api/time-periods.ts
- [ ] T017 [P] Implement Reports API functions (getProgressSummary, getStatusDistribution) in src/api/reports.ts
- [ ] T018 Create TanStack Query hooks for Objectives (useObjectives, useObjective, useCreateObjective, useUpdateObjective, useDeleteObjective) in src/hooks/useObjectives.ts
- [ ] T019 [P] Create TanStack Query hooks for Key Results (useKeyResults, useKeyResultsByObjective, useCreateKeyResult, useUpdateKeyResult, useUpdateKeyResultProgress, useDeleteKeyResult) in src/hooks/useKeyResults.ts
- [ ] T020 [P] Create TanStack Query hooks for Time Periods (useTimePeriods, useTimePeriod, useCreateTimePeriod, useUpdateTimePeriod, useArchiveTimePeriod, useDeleteTimePeriod) in src/hooks/useTimePeriods.ts
- [ ] T021 [P] Create TanStack Query hooks for Reports (useProgressSummary, useStatusDistribution) in src/hooks/useReports.ts
- [ ] T022 Implement status calculator utility (calculateObjectiveStatus) in src/lib/status-calculator.ts
- [ ] T023 [P] Create cn() utility and date formatting helpers in src/lib/utils.ts
- [ ] T024 Create ProgressBar shared component in src/components/shared/ProgressBar.tsx
- [ ] T025 [P] Create StatusBadge shared component (on-track, at-risk, behind, no-period) in src/components/shared/StatusBadge.tsx
- [ ] T026 [P] Create ConfirmDialog shared component for delete confirmations in src/components/shared/ConfirmDialog.tsx
- [ ] T027 [P] Create EmptyState shared component for empty lists in src/components/shared/EmptyState.tsx
- [ ] T028 Create Sidebar navigation component with collapsible sections in src/components/layout/Sidebar.tsx
- [ ] T029 [P] Create Header component with app title in src/components/layout/Header.tsx
- [ ] T030 Create AppShell layout component with Sidebar and Outlet in src/components/layout/AppShell.tsx
- [ ] T031 Configure React Router with lazy-loaded routes in src/App.tsx
- [ ] T032 Setup QueryClientProvider and Toaster in src/main.tsx

**Checkpoint**: Foundation ready - app shell renders with sidebar navigation; API hooks ready for use

---

## Phase 3: User Story 1 - View and Track OKR Progress (Priority: P1) 🎯 MVP

**Goal**: Users can view dashboard with progress summary, status distribution, and drill into objectives to see key results

**Independent Test**: Load app → see dashboard stats → click objective → see key results with progress

### Implementation for User Story 1

- [ ] T033 [US1] Create ProgressSummaryCard component displaying totalObjectives, averageProgress, completedObjectives in src/features/dashboard/ProgressSummaryCard.tsx
- [ ] T034 [P] [US1] Create StatusDistributionChart component displaying buckets as visual bars/cards in src/features/dashboard/StatusDistributionChart.tsx
- [ ] T035 [US1] Create DashboardPage with ProgressSummaryCard, StatusDistributionChart, and recent objectives list in src/features/dashboard/DashboardPage.tsx
- [ ] T036 [US1] Create ObjectiveCard component displaying title, progress bar, time period, and status badge in src/features/objectives/ObjectiveCard.tsx
- [ ] T037 [US1] Create ObjectiveList component with loading/empty states in src/features/objectives/ObjectiveList.tsx
- [ ] T038 [US1] Create ObjectivesPage with ObjectiveList and time period filter dropdown in src/features/objectives/ObjectivesPage.tsx
- [ ] T039 [US1] Create KeyResultCard component displaying title, currentValue/targetValue, progress percentage in src/features/key-results/KeyResultCard.tsx
- [ ] T040 [US1] Create KeyResultList component for displaying key results under an objective in src/features/key-results/KeyResultList.tsx
- [ ] T041 [US1] Create ObjectiveDetail page showing objective info and KeyResultList in src/features/objectives/ObjectiveDetail.tsx
- [ ] T042 [US1] Add route for ObjectiveDetail at /objectives/:id in src/App.tsx
- [ ] T043 [US1] Connect DashboardPage to useProgressSummary and useStatusDistribution hooks
- [ ] T044 [US1] Connect ObjectivesPage to useObjectives hook with time period filter
- [ ] T045 [US1] Connect ObjectiveDetail to useObjective and useKeyResultsByObjective hooks

**Checkpoint**: User Story 1 complete - Dashboard shows stats, objectives list displays with status, clicking objective shows key results

---

## Phase 4: User Story 2 - Manage Objectives (Priority: P2)

**Goal**: Users can create, edit, and delete objectives via slide-out panel forms

**Independent Test**: Click "New Objective" → fill form → submit → see in list → edit → delete with confirmation

### Implementation for User Story 2

- [ ] T046 [US2] Create ObjectiveForm component with title, description, timePeriodId fields using react-hook-form and Zod validation in src/features/objectives/ObjectiveForm.tsx
- [ ] T047 [US2] Integrate ObjectiveForm into Sheet (slide-out panel) for create/edit modes in src/features/objectives/ObjectivesPage.tsx
- [ ] T048 [US2] Add "New Objective" button to ObjectivesPage that opens Sheet with ObjectiveForm
- [ ] T049 [US2] Add Edit button to ObjectiveCard/ObjectiveDetail that opens Sheet with pre-filled ObjectiveForm
- [ ] T050 [US2] Connect ObjectiveForm submit to useCreateObjective mutation with success toast
- [ ] T051 [US2] Connect ObjectiveForm submit to useUpdateObjective mutation for edit mode with success toast
- [ ] T052 [US2] Add Delete button to ObjectiveCard/ObjectiveDetail with ConfirmDialog
- [ ] T053 [US2] Connect delete confirmation to useDeleteObjective mutation with success toast
- [ ] T054 [US2] Implement inline validation error display in ObjectiveForm (empty title, etc.)
- [ ] T055 [US2] Add keyboard support: Escape to close Sheet, Enter to submit form

**Checkpoint**: User Story 2 complete - Full CRUD for objectives with slide-out forms and confirmations

---

## Phase 5: User Story 3 - Manage Key Results (Priority: P3)

**Goal**: Users can create, edit, delete key results and update progress quickly

**Independent Test**: View objective → add key result → update progress → edit details → delete with confirmation

### Implementation for User Story 3

- [ ] T056 [US3] Create KeyResultForm component with title, targetValue, currentValue fields using react-hook-form and Zod validation in src/features/key-results/KeyResultForm.tsx
- [ ] T057 [US3] Create ProgressInput component for quick progress updates (input + save button) in src/features/key-results/ProgressInput.tsx
- [ ] T058 [US3] Integrate KeyResultForm into Sheet for create/edit modes in src/features/objectives/ObjectiveDetail.tsx
- [ ] T059 [US3] Add "Add Key Result" button to ObjectiveDetail that opens Sheet with KeyResultForm
- [ ] T060 [US3] Add Edit button to KeyResultCard that opens Sheet with pre-filled KeyResultForm
- [ ] T061 [US3] Connect KeyResultForm submit to useCreateKeyResult mutation with success toast
- [ ] T062 [US3] Connect KeyResultForm submit to useUpdateKeyResult mutation for edit mode with success toast
- [ ] T063 [US3] Integrate ProgressInput into KeyResultCard for inline progress updates
- [ ] T064 [US3] Connect ProgressInput to useUpdateKeyResultProgress mutation with optimistic update
- [ ] T065 [US3] Add Delete button to KeyResultCard with ConfirmDialog
- [ ] T066 [US3] Connect delete confirmation to useDeleteKeyResult mutation with success toast
- [ ] T067 [US3] Implement inline validation error display in KeyResultForm (empty title, targetValue <= 0, etc.)
- [ ] T068 [US3] Handle over-achievement display (progress > 100%) with distinct styling in ProgressBar

**Checkpoint**: User Story 3 complete - Full CRUD for key results with quick progress updates

---

## Phase 6: User Story 4 - Manage Time Periods (Priority: P4)

**Goal**: Users can create, edit, archive, delete time periods and filter objectives by period

**Independent Test**: Navigate to time periods → create period → archive it → verify objectives become read-only

### Implementation for User Story 4

- [ ] T069 [US4] Create TimePeriodForm component with name, startDate, endDate fields using react-hook-form and Zod validation in src/features/time-periods/TimePeriodForm.tsx
- [ ] T070 [US4] Create TimePeriodCard component displaying name, date range, archive status in src/features/time-periods/TimePeriodCard.tsx
- [ ] T071 [US4] Create TimePeriodList component with loading/empty states in src/features/time-periods/TimePeriodList.tsx
- [ ] T072 [US4] Create TimePeriodsPage with TimePeriodList and Sheet for forms in src/features/time-periods/TimePeriodsPage.tsx
- [ ] T073 [US4] Add "New Period" button that opens Sheet with TimePeriodForm
- [ ] T074 [US4] Add Edit button to TimePeriodCard that opens Sheet with pre-filled TimePeriodForm
- [ ] T075 [US4] Connect TimePeriodForm submit to useCreateTimePeriod and useUpdateTimePeriod mutations
- [ ] T076 [US4] Add Archive button to TimePeriodCard with ConfirmDialog
- [ ] T077 [US4] Connect archive confirmation to useArchiveTimePeriod mutation with success toast
- [ ] T078 [US4] Add Delete button to TimePeriodCard (non-archived only) with ConfirmDialog
- [ ] T079 [US4] Connect delete confirmation to useDeleteTimePeriod mutation with success toast
- [ ] T080 [US4] Implement read-only mode for objectives in archived time periods (disable edit/delete buttons)
- [ ] T081 [US4] Add visual indicator for archived time periods in TimePeriodCard and ObjectiveCard
- [ ] T082 [US4] Implement date validation in TimePeriodForm (endDate must be after startDate)

**Checkpoint**: User Story 4 complete - Full CRUD for time periods with archive functionality affecting objective editability

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories

- [ ] T083 [P] Add loading skeletons for all list components (ObjectiveList, KeyResultList, TimePeriodList)
- [ ] T084 [P] Add error boundary with user-friendly error messages and retry option in src/components/shared/ErrorBoundary.tsx
- [ ] T085 Implement responsive sidebar collapse for mobile viewports (320px-768px) in Sidebar.tsx
- [ ] T086 [P] Add focus management and visible focus indicators for keyboard navigation
- [ ] T087 Verify all forms support Enter to submit and Escape to close
- [ ] T088 [P] Add aria-labels and roles for accessibility compliance
- [ ] T089 Run build verification (`npm run build`) and fix any TypeScript/lint errors
- [ ] T090 Validate quickstart.md instructions work end-to-end with fresh clone

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Story 1 (Phase 3)**: Depends on Foundational - can start after T032
- **User Story 2 (Phase 4)**: Depends on Foundational - can start after T032, benefits from US1 components
- **User Story 3 (Phase 5)**: Depends on Foundational - can start after T032, benefits from US1/US2 components
- **User Story 4 (Phase 6)**: Depends on Foundational - can start after T032
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Can Start After | Independent? | Notes |
|-------|-----------------|--------------|-------|
| US1 (P1) | T032 | ✅ Yes | Core viewing - MVP |
| US2 (P2) | T032 | ✅ Yes | Reuses ObjectiveCard from US1 |
| US3 (P3) | T032 | ✅ Yes | Reuses KeyResultCard from US1, works within ObjectiveDetail |
| US4 (P4) | T032 | ✅ Yes | Standalone, read-only integration with objectives |

### Parallel Opportunities by Phase

**Phase 1 (Setup)**: T003, T004, T005, T006, T007 can run in parallel after T001, T002

**Phase 2 (Foundational)**:
- Types: T009, T010, T011, T012 in parallel
- API: T014, T015, T016, T017 in parallel (after T013)
- Hooks: T018, T019, T020, T021 in parallel (after respective API modules)
- Shared components: T024, T025, T026, T027 in parallel
- Layout: T028, T029 in parallel, then T030

**Phase 3-6 (User Stories)**: All user stories can run in parallel once Foundational is complete

---

## Parallel Example: User Story 1 (Phase 3)

```bash
# After Foundational complete, launch these in parallel:
T033: ProgressSummaryCard
T034: StatusDistributionChart

# Then:
T035: DashboardPage (uses T033, T034)

# In parallel:
T036: ObjectiveCard
T039: KeyResultCard

# Then:
T037: ObjectiveList (uses T036)
T040: KeyResultList (uses T039)

# Finally:
T038: ObjectivesPage (uses T037)
T041: ObjectiveDetail (uses T040)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup ✓
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories) ✓
3. Complete Phase 3: User Story 1 ✓
4. **STOP and VALIDATE**: Dashboard displays, objectives list works, can drill into details
5. Deploy/demo as MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 → Test independently → **MVP deployed!**
3. Add US2 → Test independently → Objectives CRUD live
4. Add US3 → Test independently → Key results CRUD live
5. Add US4 → Test independently → Time periods management live
6. Polish phase → Production-ready

### Suggested MVP Scope

**Minimum**: Phase 1 + Phase 2 + Phase 3 (User Story 1)
- Users can view dashboard, browse objectives, see key results
- Delivers core value proposition: "See your OKRs and track progress"

---

## Notes

- All tasks include exact file paths per plan.md structure
- [P] tasks can run in parallel (different files, no dependencies)
- [Story] labels (US1-US4) map tasks to user stories for traceability
- shadcn/ui components in src/components/ui/ are installed via CLI (T004), not manually created
- Toast notifications use shadcn/ui toast component for consistent UX
- Sheet component used for all slide-out panel forms per spec clarification
