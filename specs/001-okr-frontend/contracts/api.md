# API Contracts: OKR Management Frontend

**Base URL**: `http://localhost:3000/api/v1`  
**Source**: OpenAPI 3.0 spec at http://localhost:3000/api/docs

## Objectives API

### List Objectives

```
GET /objectives
```

**Query Parameters**:
| Param | Type | Description |
|-------|------|-------------|
| timePeriodId | string? | Filter by time period |

**Response** `200 OK`:
```typescript
ObjectiveResponseDto[]
```

### Get Objective by ID

```
GET /objectives/{id}
```

**Response** `200 OK`:
```typescript
ObjectiveResponseDto
```

**Response** `404 Not Found`:
```typescript
ErrorResponseDto
```

### Create Objective

```
POST /objectives
```

**Request Body**:
```typescript
CreateObjectiveDto {
  title: string;          // Required, 1-200 chars
  description?: string;   // Optional
  timePeriodId?: string;  // Optional UUID
}
```

**Response** `201 Created`:
```typescript
ObjectiveResponseDto
```

**Response** `400 Bad Request`:
```typescript
ErrorResponseDto  // Validation errors
```

### Update Objective

```
PATCH /objectives/{id}
```

**Request Body**:
```typescript
UpdateObjectiveDto {
  title?: string;
  description?: string;
  timePeriodId?: string | null;  // null to remove association
}
```

**Response** `200 OK`:
```typescript
ObjectiveResponseDto
```

### Delete Objective

```
DELETE /objectives/{id}
```

**Response** `204 No Content`

**Response** `404 Not Found`:
```typescript
ErrorResponseDto
```

---

## Key Results API

### List Key Results for Objective

```
GET /objectives/{objectiveId}/key-results
```

**Response** `200 OK`:
```typescript
KeyResultResponseDto[]
```

### List All Key Results

```
GET /key-results
```

**Response** `200 OK`:
```typescript
KeyResultResponseDto[]
```

### Get Key Result by ID

```
GET /key-results/{id}
```

**Response** `200 OK`:
```typescript
KeyResultResponseDto
```

### Create Key Result

```
POST /key-results
```

**Request Body**:
```typescript
CreateKeyResultDto {
  objectiveId: string;    // Required UUID
  title: string;          // Required, 1-200 chars
  targetValue: number;    // Required, > 0
  currentValue?: number;  // Optional, defaults to 0
}
```

**Response** `201 Created`:
```typescript
KeyResultResponseDto
```

### Update Key Result

```
PATCH /key-results/{id}
```

**Request Body**:
```typescript
UpdateKeyResultDto {
  title?: string;
  targetValue?: number;
  currentValue?: number;
}
```

**Response** `200 OK`:
```typescript
KeyResultResponseDto
```

### Update Key Result Progress

```
PATCH /key-results/{id}/progress
```

**Request Body**:
```typescript
UpdateKeyResultProgressDto {
  currentValue: number;  // Required, >= 0
}
```

**Response** `200 OK`:
```typescript
KeyResultResponseDto
```

### Delete Key Result

```
DELETE /key-results/{id}
```

**Response** `204 No Content`

---

## Time Periods API

### List Time Periods

```
GET /time-periods
```

**Response** `200 OK`:
```typescript
TimePeriodResponseDto[]
```

### Get Time Period by ID

```
GET /time-periods/{id}
```

**Response** `200 OK`:
```typescript
TimePeriodResponseDto
```

### Create Time Period

```
POST /time-periods
```

**Request Body**:
```typescript
CreateTimePeriodDto {
  name: string;       // Required
  startDate: string;  // Required, ISO 8601 date
  endDate: string;    // Required, ISO 8601 date, must be after startDate
}
```

**Response** `201 Created`:
```typescript
TimePeriodResponseDto
```

### Update Time Period

```
PATCH /time-periods/{id}
```

**Request Body**:
```typescript
UpdateTimePeriodDto {
  name?: string;
  startDate?: string;
  endDate?: string;
}
```

**Response** `200 OK`:
```typescript
TimePeriodResponseDto
```

### Archive Time Period

```
POST /time-periods/{id}/archive
```

**Response** `200 OK`:
```typescript
TimePeriodResponseDto  // with isArchived: true
```

### Delete Time Period

```
DELETE /time-periods/{id}
```

**Response** `204 No Content`

---

## Reports API

### Get Progress Summary

```
GET /reports/progress-summary
```

**Response** `200 OK`:
```typescript
ProgressSummaryDto {
  totalObjectives: number;
  completedObjectives: number;
  averageProgress: number;
  totalKeyResults: number;
  completedKeyResults: number;
}
```

### Get Status Distribution

```
GET /reports/status-distribution
```

**Response** `200 OK`:
```typescript
StatusDistributionDto {
  buckets: StatusBucketDto[];
}

StatusBucketDto {
  status: string;     // "on-track" | "at-risk" | "behind" | "no-period"
  count: number;
  percentage: number;
}
```

---

## Health API

### Health Check

```
GET /health
```

**Response** `200 OK`:
```typescript
{ status: "ok" }
```

---

## Common Response DTOs

### ObjectiveResponseDto

```typescript
{
  id: string;
  title: string;
  description: string | null;
  timePeriodId: string | null;
  progress: number;
  keyResults: KeyResultSummaryDto[];
  createdAt: string;
  updatedAt: string;
}
```

### KeyResultSummaryDto

```typescript
{
  id: string;
  title: string;
  progress: number;
}
```

### KeyResultResponseDto

```typescript
{
  id: string;
  objectiveId: string;
  title: string;
  targetValue: number;
  currentValue: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}
```

### TimePeriodResponseDto

```typescript
{
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### ErrorResponseDto

```typescript
{
  statusCode: number;
  message: string;
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
```
