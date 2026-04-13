# Chapter 4: The Dashboard Shows a Spinner for 3 Seconds

*In which you learn that fetching data on every navigation is a choice, and a bad one.*

[← Chapter 3: The Form That Loses Data](ch03-state.md) | [Chapter 5: 200 API Calls →](ch05-graphql.md)

---

## The Incident

FiveNines is clicking through the dashboard. Jobs page. Metrics page. Back to jobs. Every single navigation: a loading spinner. 1-3 seconds of blank screen. For data that was on screen 5 seconds ago.

> **@FiveNines:** I just looked at the job list. I clicked metrics. I clicked back. Why is it fetching the job list again? It hasn't changed. I was gone for 2 seconds.

You open the Network tab. He's right. Every page mount fires a fresh `fetch()`. No caching. No background updates. Just: mount → spinner → data → unmount → repeat.

## The Problem — Naive useEffect + fetch

This is what every React tutorial teaches you:

```tsx
// ❌ The pattern that causes the spinner problem
function JobListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.jobs.list()
      .then(setJobs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return <JobTable jobs={jobs} />;
}
```

Problems:
1. **No cache.** Navigate away and back → fetch again. Every time.
2. **No background refetch.** Data goes stale. You never know.
3. **Loading state on every mount.** Users see spinners for data they just had.
4. **Race conditions.** Fast navigation can cause responses to arrive out of order.
5. **No deduplication.** Two components fetching `/api/jobs` = two requests.

You're managing loading, error, data, and caching by hand. In every component. This doesn't scale.

## The Fix — TanStack Query

TanStack Query (formerly React Query) handles all of this. Install it:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### Setup

```tsx
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,      // data is fresh for 30 seconds
      gcTime: 5 * 60 * 1000,     // keep unused data in cache for 5 minutes
      retry: 2,                   // retry failed requests twice
      refetchOnWindowFocus: true, // refetch when user returns to tab
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### The useJobs Hook

```tsx
// src/features/jobs/useJobs.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function useJobs(search?: string) {
  return useQuery({
    queryKey: ['jobs', { search }],
    queryFn: () => api.jobs.list(),
    select: (jobs) =>
      search
        ? jobs.filter(j =>
            j.name.toLowerCase().includes(search.toLowerCase()) ||
            j.id.toLowerCase().includes(search.toLowerCase())
          )
        : jobs,
  });
}
```

### The useMetrics Hook

```tsx
// src/features/metrics/useMetrics.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: () => api.metrics.get(),
    refetchInterval: 10 * 1000, // metrics update every 10 seconds
  });
}
```

### The Job List — With Caching

```tsx
// src/features/jobs/JobListPage.tsx
import { useState } from 'react';
import { useJobs } from './useJobs';
import { JobStatusBadge } from './JobStatusBadge';

export default function JobListPage() {
  const [search, setSearch] = useState('');
  const { data: jobs, isLoading, isFetching, error } = useJobs(search);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Jobs</h1>
        {isFetching && !isLoading && (
          <span className="text-xs text-gray-400">Refreshing...</span>
        )}
      </div>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search jobs..."
        className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2"
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error.message} />
      ) : (
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
            {jobs?.map(job => (
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
      )}
    </div>
  );
}
```

## How Stale-While-Revalidate Works

This is the key concept. Here's what happens when you navigate:

```
First visit to /jobs:
  1. No cache → isLoading: true → show spinner
  2. Data arrives → cache it → show jobs
  3. staleTime: 30s starts counting

Navigate to /metrics, then back to /jobs (within 30s):
  1. Cache exists, data is FRESH → show jobs instantly (no spinner!)
  2. No refetch needed

Navigate to /metrics, then back to /jobs (after 30s):
  1. Cache exists, data is STALE → show stale jobs instantly (no spinner!)
  2. Background refetch starts → isFetching: true
  3. Fresh data arrives → update seamlessly

After 5 minutes of not viewing /jobs:
  1. gcTime expires → cache is garbage collected
  2. Next visit → isLoading: true → spinner → fresh fetch
```

The user sees data immediately. The refetch happens in the background. No spinner. No jank.

## The Dashboard — Combining Hooks

```tsx
// src/features/dashboard/DashboardPage.tsx
import { useJobs } from '../jobs/useJobs';
import { useMetrics } from '../metrics/useMetrics';
import { MetricsCards } from '../metrics/MetricsCards';

export default function DashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useMetrics();
  const { data: recentJobs, isLoading: jobsLoading } = useJobs();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {metricsLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : metrics ? (
        <MetricsCards metrics={metrics} />
      ) : null}

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Jobs</h2>
        {jobsLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-gray-100" />
            ))}
          </div>
        ) : (
          <ul className="divide-y">
            {recentJobs?.slice(0, 10).map(job => (
              <li key={job.id} className="flex items-center justify-between py-2">
                <span className="font-mono text-sm">{job.name}</span>
                <JobStatusBadge status={job.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

Both hooks fire in parallel. Both cache independently. Skeleton loaders instead of a single spinner.

## Key Concepts

| Concept | What It Does |
|---------|-------------|
| `staleTime` | How long data is considered fresh (no refetch) |
| `gcTime` | How long unused cache entries survive before garbage collection |
| `refetchOnWindowFocus` | Refetch when user returns to the browser tab |
| `refetchInterval` | Poll at a fixed interval (good for metrics) |
| `select` | Transform/filter data without affecting the cache |
| `queryKey` | Cache key — same key = same cache entry, different key = different fetch |

## The Result

| Before | After |
|--------|-------|
| Spinner on every navigation | Instant page transitions with cached data |
| 3-second blank screen | Data appears in <50ms from cache |
| No background updates | Stale data refreshes silently |
| Race conditions on fast navigation | TanStack Query handles deduplication |
| Manual loading/error state in every component | Declarative `isLoading` / `error` |

FiveNines clicks between pages. Jobs → Metrics → Jobs → Dashboard → Jobs. No spinners. Data appears instantly. Background refreshes are invisible.

"That's more like it," he says. Then he checks the Network tab. "Wait. The dashboard makes 6 API calls on load. The job list returns 47 fields per job and we show 5. Bobby Tables is going to have words."

---

[← Chapter 3: The Form That Loses Data](ch03-state.md) | [Chapter 5: 200 API Calls →](ch05-graphql.md)
