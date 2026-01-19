<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0 (initial ratification)
Modified principles: N/A (initial version)
Added sections:
  - Core Principles (5 principles)
  - Technology Stack
  - Development Workflow
  - Governance
Removed sections: None
Templates requiring updates:
  ✅ plan-template.md - compatible, Constitution Check section maps to principles
  ✅ spec-template.md - compatible, requirements structure aligns
  ✅ tasks-template.md - compatible, phase structure supports principle-driven work
Follow-up TODOs: None
-->

# Okra Web Constitution

## Core Principles

### I. Component-First Architecture

All UI features MUST be built as self-contained, reusable components.

- Components MUST be independently testable with isolated props/state
- Components MUST have a single, clear responsibility (SRP)
- Shared components MUST live in `src/components/` with explicit public exports
- Feature-specific components MUST be co-located within their feature directory
- No prop drilling beyond 2 levels—use composition or context instead

**Rationale**: Reusable components reduce duplication, improve testability, and enable parallel development across features.

### II. UX Consistency (NON-NEGOTIABLE)

User experience MUST be predictable, accessible, and visually coherent across all views.

- All interactive elements MUST follow established design tokens (colors, spacing, typography)
- Loading states MUST be explicit—no blank screens or silent failures
- Error states MUST provide actionable feedback to users
- Navigation MUST be intuitive with consistent patterns (breadcrumbs, back actions)
- Accessibility: All interactive elements MUST be keyboard-navigable; WCAG 2.1 AA compliance required
- Responsive design MUST support viewport widths from 320px to 1920px

**Rationale**: Inconsistent UX erodes user trust and increases support burden. A coherent interface is a non-negotiable quality bar.

### III. Type Safety & Code Quality

TypeScript strict mode MUST be enabled; no `any` types without explicit justification.

- All exported functions/components MUST have explicit type annotations
- API responses MUST be validated against defined schemas (Zod or similar)
- Linting (ESLint) and formatting (Prettier) MUST pass before commit
- No console.log in production code—use structured logging utilities
- Dead code and unused imports MUST be removed before merge

**Rationale**: Type safety catches bugs at compile time, reducing runtime errors and improving developer confidence during refactors.

### IV. Vite SPA Conventions

The application MUST follow Vite-based SPA best practices for performance and developer experience.

- Client-side routing via React Router (or equivalent); no full page reloads for navigation
- Code splitting MUST be used for route-level components (`lazy()` + `Suspense`)
- Environment variables MUST use `import.meta.env` prefix; no `process.env`
- Static assets MUST be placed in `public/` or imported for hashing
- Build output MUST target modern browsers (ES2020+); legacy support via explicit polyfills only
- Hot Module Replacement (HMR) MUST remain functional during development

**Rationale**: Vite's architecture enables fast builds and optimal production bundles; violating conventions breaks tooling and performance.

### V. Simplicity & Incremental Delivery

Start with the simplest implementation that meets requirements; complexity MUST be justified.

- YAGNI: Do not implement features "just in case"
- Prefer standard library/platform APIs over external dependencies
- New dependencies MUST be justified with documented rationale
- Features SHOULD be deliverable in vertical slices (end-to-end functionality per user story)
- Refactor only when proven necessary by tests or performance data

**Rationale**: Premature abstraction and over-engineering slow delivery and increase maintenance burden.

## Technology Stack

The following technologies define the standard stack for this project:

| Layer | Technology | Version/Notes |
|-------|------------|---------------|
| Build Tool | Vite | Latest stable |
| Language | TypeScript | Strict mode enabled |
| UI Framework | React | 18.x with functional components |
| Routing | React Router | v6+ |
| Styling | CSS Modules or Tailwind | Consistent across project |
| State Management | React Context + hooks | Zustand/Jotai for complex global state |
| API Layer | fetch + custom hooks | Or TanStack Query for caching |
| Testing | Vitest + React Testing Library | Unit + integration coverage |
| Linting | ESLint + Prettier | Pre-commit hooks required |

Deviations from this stack MUST be documented and approved via constitution amendment.

## Development Workflow

### Quality Gates

All changes MUST pass the following gates before merge:

1. **Lint Check**: `npm run lint` passes with zero errors
2. **Type Check**: `npm run typecheck` (tsc --noEmit) passes
3. **Test Suite**: `npm run test` passes; no regression in coverage
4. **Build Verification**: `npm run build` completes without errors
5. **Manual Review**: At least one peer review approval

### Commit Conventions

- Commits MUST follow Conventional Commits format: `type(scope): description`
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`
- Breaking changes MUST include `BREAKING CHANGE:` in commit body

### Branch Strategy

- Feature branches: `feat/###-feature-name`
- Bug fixes: `fix/###-bug-description`
- Main branch MUST always be deployable

## Governance

This constitution supersedes all other development practices for the Okra Web project.

- **Compliance**: All PRs and code reviews MUST verify adherence to these principles
- **Violations**: Violations require explicit justification documented in PR description
- **Amendments**: Changes to this constitution require:
  1. Written proposal with rationale
  2. Impact analysis on existing code
  3. Migration plan if breaking
  4. Version bump following semantic versioning
- **Versioning**: MAJOR for principle removal/redefinition, MINOR for additions, PATCH for clarifications

**Version**: 1.0.0 | **Ratified**: 2026-01-18 | **Last Amended**: 2026-01-18
