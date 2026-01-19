# Data Model: OKR Management Frontend

**Feature**: 001-okr-frontend  
**Date**: 2026-01-18  
**Source**: Backend API at http://localhost:3000/api/docs

## Entities

### Objective

A high-level goal to achieve within a time period.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique identifier |
| title | string | Yes | Objective title (1-200 chars) |
| description | string | No | Detailed description |
| timePeriodId | string (UUID) | No | Associated time period |
| progress | number | Yes | Aggregated progress (0-100+), calculated from key results |
| keyResults | KeyResultSummary[] | Yes | Summary of associated key results |
| createdAt | string (ISO 8601) | Yes | Creation timestamp |
| updatedAt | string (ISO 8601) | Yes | Last update timestamp |

**Validation rules**:
- `title` must not be empty
- `progress` is read-only (calculated by backend)

**State transitions**:
- When associated time period is archived → Objective becomes read-only

### KeyResult

A measurable outcome that contributes to an objective.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique identifier |
| objectiveId | string (UUID) | Yes | Parent objective |
| title | string | Yes | Key result title (1-200 chars) |
| targetValue | number | Yes | Target value to achieve |
| currentValue | number | Yes | Current progress value |
| progress | number | Yes | Calculated percentage (currentValue / targetValue * 100) |
| createdAt | string (ISO 8601) | Yes | Creation timestamp |
| updatedAt | string (ISO 8601) | Yes | Last update timestamp |

**Validation rules**:
- `title` must not be empty
- `targetValue` must be > 0
- `currentValue` must be >= 0
- `progress` is read-only (calculated by backend)

**State transitions**:
- When parent objective's time period is archived → Key result becomes read-only

### TimePeriod

A defined timeframe for organizing objectives.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | Unique identifier |
| name | string | Yes | Period name (e.g., "Q1 2026") |
| startDate | string (ISO 8601 date) | Yes | Period start date |
| endDate | string (ISO 8601 date) | Yes | Period end date |
| isArchived | boolean | Yes | Whether period is archived |
| createdAt | string (ISO 8601) | Yes | Creation timestamp |
| updatedAt | string (ISO 8601) | Yes | Last update timestamp |

**Validation rules**:
- `name` must not be empty
- `endDate` must be after `startDate`

**State transitions**:
- Active → Archived (via archive endpoint, irreversible in MVP)

### ProgressSummary

Aggregated view of overall OKR completion.

| Field | Type | Description |
|-------|------|-------------|
| totalObjectives | number | Count of all objectives |
| completedObjectives | number | Count of objectives at 100% progress |
| averageProgress | number | Mean progress across all objectives |
| totalKeyResults | number | Count of all key results |
| completedKeyResults | number | Count of key results at 100% progress |

### StatusDistribution

Breakdown of objectives by calculated status.

| Field | Type | Description |
|-------|------|-------------|
| buckets | StatusBucket[] | Array of status categories with counts |

**StatusBucket**:
| Field | Type | Description |
|-------|------|-------------|
| status | "on-track" \| "at-risk" \| "behind" \| "no-period" | Status category |
| count | number | Number of objectives in this status |
| percentage | number | Percentage of total objectives |

## Relationships

```
TimePeriod (1) ←──────── (0..n) Objective
                              │
                              │
                              ▼
                         (0..n) KeyResult
```

- A **TimePeriod** can have zero or more **Objectives**
- An **Objective** belongs to zero or one **TimePeriod**
- An **Objective** has zero or more **KeyResults**
- A **KeyResult** belongs to exactly one **Objective**

## Derived/Calculated Fields

### Objective Status (Frontend Calculation)

Status is calculated by comparing time elapsed against progress achieved:

```typescript
type ObjectiveStatus = 'on-track' | 'at-risk' | 'behind' | 'no-period';

function calculateStatus(
  objective: Objective,
  timePeriod: TimePeriod | null,
  now: Date
): ObjectiveStatus {
  if (!timePeriod) return 'no-period';
  
  const totalDuration = timePeriod.endDate - timePeriod.startDate;
  const elapsed = now - timePeriod.startDate;
  const expectedProgress = Math.min(100, (elapsed / totalDuration) * 100);
  
  const actualProgress = objective.progress;
  const ratio = actualProgress / expectedProgress;
  
  if (ratio >= 0.9) return 'on-track';
  if (ratio >= 0.5) return 'at-risk';
  return 'behind';
}
```

### Key Result Progress (Backend Calculation)

```
progress = (currentValue / targetValue) * 100
```

Note: Progress can exceed 100% for over-achievement.

## Error Types

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| NOT_FOUND | 404 | Resource does not exist |
| VALIDATION_ERROR | 400 | Request body failed validation |
| CONFLICT | 409 | Operation conflicts with current state |
| INTERNAL_ERROR | 500 | Unexpected server error |

**Error Response Shape**:
```typescript
interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  details?: ErrorDetail[];
}

interface ErrorDetail {
  field: string;
  message: string;
}
```
