# Quickstart: OKR Management Frontend

**Feature**: 001-okr-frontend  
**Date**: 2026-01-18

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Backend API running at `http://localhost:3000` (see backend repo)

## Project Setup

### 1. Initialize Vite Project

```bash
npm create vite@latest okra-web -- --template react-ts
cd okra-web
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install react-router-dom @tanstack/react-query zod react-hook-form @hookform/resolvers

# UI dependencies (Tailwind CSS v4)
npm install tailwindcss @tailwindcss/postcss postcss
npm install clsx tailwind-merge lucide-react date-fns sonner

# Dev dependencies
npm install -D @types/node
```

### 3. Configure Tailwind CSS v4

Create `postcss.config.js`:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

Update `src/index.css`:
```css
@import "tailwindcss";

/* Base styles */
@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    /* ... additional CSS variables ... */
  }
}

/* Additional component styles */
```

### 4. Initialize shadcn/ui

First, add path aliases to both `tsconfig.json` and `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Then initialize shadcn/ui:
```bash
npx shadcn@latest init
```

Select options:
- Style: Default  
- Base color: Slate
- CSS variables: Yes

Install required components:
```bash
npx shadcn@latest add button input label sheet dialog card progress sonner form select textarea
```

### 5. Configure TypeScript

Ensure `tsconfig.json` has strict mode and path aliases:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Also add path aliases to `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 6. Configure Vite

Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

### 7. Environment Variables

Create `.env`:
```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Create `.env.example` (committed to repo):
```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run typecheck  # Add to package.json: "typecheck": "tsc --noEmit"

# Linting
npm run lint

# Run tests
npm run test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure Overview

```
src/
├── api/           # API client functions
├── components/    # UI components (ui/, layout/, shared/)
├── features/      # Feature modules (dashboard, objectives, key-results, time-periods)
├── hooks/         # Custom React hooks (useObjectives, useKeyResults, etc.)
├── lib/           # Utilities (cn, status-calculator)
├── types/         # TypeScript types and Zod schemas
├── App.tsx        # Router setup
└── main.tsx       # Entry point with QueryClientProvider
```

## Verifying Setup

1. Start the backend API:
   ```bash
   # In backend directory
   npm run start:dev
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 - you should see the Vite + React template

4. Verify API connectivity:
   ```bash
   curl http://localhost:3000/api/v1/health
   # Expected: {"status":"ok"}
   ```

## Next Steps

After setup is complete, implementation proceeds in this order:

1. **Phase 1 (Setup)**: Project structure, routing, API client
2. **Phase 2 (Foundational)**: Shared components (ProgressBar, StatusBadge, etc.)
3. **Phase 3 (US1)**: Dashboard with progress summary and status distribution
4. **Phase 4 (US2)**: Objectives list, detail view, CRUD operations
5. **Phase 5 (US3)**: Key results management and progress updates
6. **Phase 6 (US4)**: Time periods management and filtering

See `tasks.md` for detailed implementation tasks.
