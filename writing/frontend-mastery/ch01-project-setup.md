# Chapter 1: The Blank Page That Takes 12 Seconds

*In which you connect a frontend to the job engine and discover that showing a list of jobs is harder than processing them.*

[← Series Overview](README.md) | [Chapter 2: 300 Re-renders →](ch02-rendering.md)

---

## The Task

The job engine is humming. Jobs flow in, get processed, complete or fail. But the only way to see what's happening is to read log files. FiveNines has been doing this for two months.

> **@FiveNines:** I'm reading 10,000 lines of logs per day to check if jobs are healthy. I need a dashboard. Yesterday.

Linus looks at you. "You built the engine. You know the data model. Build the UI."

Pixel, the designer, slides a Figma link across the table. "Here's the mockup. The status badges need to be exactly 6px border-radius. Not 5. Not 7. Six."

You open the mockup. It's a dashboard with a job list, metrics cards, a search box, and real-time status indicators. You've built React apps before. How hard can it be?

## The Existing Attempt

Someone on the team tried building a dashboard six months ago with Create React App. You open the repo:

- `node_modules`: 800MB
- `package.json`: 67 dependencies (including `moment.js` for one date format)
- Dev server startup: 35 seconds
- Production bundle: 4.1MB
- First load on 3G: 12 seconds
- Lighthouse performance score: 31

You close the repo.

## Starting Fresh — Vite + TypeScript

```bash
npm create vite@latest job-engine-dashboard -- --template react-ts
cd job-engine-dashboard
npm install
```

Install only what you need:

```bash
# Routing
npm install react-router-dom

# Data fetching (Chapter 4)
npm install @tanstack/react-query

# Styling
npm install tailwindcss @tailwindcss/vite

# Date formatting (not moment.js — 72KB vs 2KB)
npm install date-fns
```

6 runtime dependencies. Not 67.

## Project Structure — Organized Around the Job Engine

```
src/
├── main.tsx
├── App.tsx
├── features/
│   ├── jobs/                    ← the core feature
│   │   ├── JobListPage.tsx      ← /jobs route
│   │   ├── JobDetailPage.tsx    ← /jobs/:id route
│   │   ├── JobRow.tsx           ← single row in the list
│   │   ├── JobStatusBadge.tsx   ← PENDING/RUNNING/COMPLETED/FAILED
│   │   ├── JobPriorityBadge.tsx ← LOW/NORMAL/HIGH/CRITICAL
│   │   ├── useJobs.ts           ← data fetching hook
│   │   └── job.types.ts         ← TypeScript types matching the API
│   ├── metrics/
│   │   ├── MetricsCards.tsx     ← submitted/completed/failed/active
│   │   └── useMetrics.ts
│   ├── submit/
│   │   ├── SubmitJobForm.tsx    ← form to submit a new job
│   │   └── useSubmitJob.ts
│   └── dashboard/
│       └── DashboardPage.tsx    ← combines metrics + recent jobs
├── components/                  ← shared UI
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── lib/
│   ├── api.ts                   ← API client for the job engine
│   └── utils.ts
└── types/
    └── api.ts                   ← shared API response types
```

## Types — Matching the Job Engine API

The backend returns jobs in a specific shape. Define it once, use it everywhere:

```typescript
// src/types/api.ts

export type JobStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'TIMED_OUT';

export type JobPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export interface Job {
  id: string;
  name: string;
  priority: JobPriority;
  status: JobStatus;
  submittedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  failureReason: string | null;
  dependsOn: string[];
}

export interface JobMetrics {
  submitted: number;
  completed: number;
  failed: number;
  cancelled: number;
  timedOut: number;
  activeJobs: number;
  averageProcessingTimeMs: number;
}
```

These types mirror the Java models from the job engine. When the backend changes, TypeScript catches the mismatch at compile time.

## API Client — Talking to the Job Engine

```typescript
// src/lib/api.ts

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  jobs: {
    list: () => fetchJson<Job[]>('/api/jobs'),
    get: (id: string) => fetchJson<Job>(`/api/jobs/${id}`),
    submit: (job: { name: string; priority: JobPriority }) =>
      fetchJson<Job>('/api/jobs', {
        method: 'POST',
        body: JSON.stringify(job),
      }),
    cancel: (id: string) =>
      fetchJson<Job>(`/api/jobs/${id}/cancel`, { method: 'POST' }),
  },
  metrics: {
    get: () => fetchJson<JobMetrics>('/api/metrics'),
  },
};
```

## The First Component — Job Status Badge

Pixel's first requirement: status badges with the right colors.

```tsx
// src/features/jobs/JobStatusBadge.tsx
import type { JobStatus } from '../../types/api';

const statusConfig: Record<JobStatus, { label: string; color: string }> = {
  PENDING:   { label: 'Pending',   color: 'bg-gray-100 text-gray-700' },
  RUNNING:   { label: 'Running',   color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  FAILED:    { label: 'Failed',    color: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-yellow-100 text-yellow-700' },
  TIMED_OUT: { label: 'Timed Out', color: 'bg-orange-100 text-orange-700' },
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
```

## The Job List — Naive Version

```tsx
// src/features/jobs/JobListPage.tsx
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { JobStatusBadge } from './JobStatusBadge';
import type { Job } from '../../types/api';

export default function JobListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.jobs.list()
      .then(setJobs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th>ID</th>
            <th>Name</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.id} className="border-t">
              <td className="py-2 font-mono text-sm">{job.id}</td>
              <td>{job.name}</td>
              <td>{job.priority}</td>
              <td><JobStatusBadge status={job.status} /></td>
              <td className="text-sm text-gray-500">
                {new Date(job.submittedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Smoke Test

```bash
npm run dev
```

Open `http://localhost:5173`. The job list loads. Status badges show the right colors. Pixel checks the border-radius. "6px. Acceptable."

You show Linus. He nods. "Deploy to staging."

It works. One user at a time. One page load. No search, no filtering, no real-time updates. But it works.

Then FiveNines opens React DevTools...

> **@FiveNines:** Every time a job status changes, the entire list re-renders. All 500 rows. For one status update.

---

[← Series Overview](README.md) | [Chapter 2: 300 Re-renders →](ch02-rendering.md)
