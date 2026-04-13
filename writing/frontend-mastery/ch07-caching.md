# Chapter 7: Job Status Stuck After Cancel

*In which you learn that there are only two hard things in computer science: cache invalidation and naming things.*

[← Chapter 6: 10,000 Jobs](ch06-virtualization.md) | [Chapter 8: The API Key in DevTools →](ch08-auth-security.md)

---

## The Incident

A user cancels job-42. They navigate back to the job list. Job-42 still shows RUNNING. They refresh. Still RUNNING. They wait. They file a ticket.

> **@TicketMaster:** 8 tickets today. "I cancelled a job but it still shows as running." Users think the cancel didn't work and they're submitting duplicate jobs to compensate.

Your TanStack Query config has `staleTime: 30 * 1000` — data is considered fresh for 30 seconds. After a cancel mutation, the cached job list is stale but TanStack Query doesn't know that. It happily serves the old status.

## The Problem — Stale Cache After Mutations

```tsx
// The cancel succeeds on the server...
await api.jobs.cancel('job-42');

// ...but the job list still shows RUNNING
// because TanStack Query is serving from cache
const { data: jobs } = useQuery({
  queryKey: ['jobs'],
  queryFn: () => api.jobs.list(),
  staleTime: 30 * 1000, // won't refetch for 30 seconds
});
```

The server knows job-42 is CANCELLED. The cache doesn't. The user sees stale data. This is the classic cache invalidation problem.

## Fix 1: Invalidate After Mutation

The simplest fix — tell TanStack Query to refetch after the cancel:

```tsx
// src/features/jobs/useCancelJob.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function useCancelJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => api.jobs.cancel(jobId),
    onSuccess: () => {
      // Mark these queries as stale — they'll refetch immediately
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}
```

After the cancel, TanStack Query refetches the job list. The user sees CANCELLED. Simple, reliable, one extra network request.

## Fix 2: Optimistic Updates — Instant Feedback

Invalidation works but there's a flash — the old status shows for 200-500ms while the refetch happens. For a cancel action, users expect instant feedback. Update the cache immediately and roll back if the mutation fails:

```tsx
// src/features/jobs/useCancelJob.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Job } from '../../types/api';

export function useCancelJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => api.jobs.cancel(jobId),

    onMutate: async (jobId) => {
      // Cancel in-flight queries so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['jobs'] });

      // Snapshot the current cache (for rollback)
      const previousJobs = queryClient.getQueryData<Job[]>(['jobs']);

      // Optimistically update the job status in cache
      queryClient.setQueryData<Job[]>(['jobs'], (old) =>
        old?.map(job =>
          job.id === jobId
            ? { ...job, status: 'CANCELLED' as const }
            : job
        )
      );

      // Also update the individual job cache if it exists
      const previousJob = queryClient.getQueryData<Job>(['jobs', jobId]);
      if (previousJob) {
        queryClient.setQueryData<Job>(['jobs', jobId], {
          ...previousJob,
          status: 'CANCELLED',
        });
      }

      return { previousJobs, previousJob };
    },

    onError: (_err, jobId, context) => {
      // Mutation failed — roll back to the snapshot
      if (context?.previousJobs) {
        queryClient.setQueryData(['jobs'], context.previousJobs);
      }
      if (context?.previousJob) {
        queryClient.setQueryData(['jobs', jobId], context.previousJob);
      }
    },

    onSettled: () => {
      // Always refetch after mutation to ensure server truth
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}
```

The user clicks "Cancel." The status badge flips to CANCELLED instantly. If the server rejects it (job already completed, no permission), it rolls back. No spinner. No waiting.

### Using It in the UI

```tsx
// src/features/jobs/JobRow.tsx
import { useCancelJob } from './useCancelJob';

export function JobRow({ job }: { job: Job }) {
  const cancelJob = useCancelJob();
  const canCancel = job.status === 'PENDING' || job.status === 'RUNNING';

  return (
    <div className="flex items-center border-b px-4 py-3">
      <span className="w-28 font-mono text-sm">{job.id}</span>
      <span className="flex-1">{job.name}</span>
      <JobStatusBadge status={job.status} />
      {canCancel && (
        <button
          onClick={() => cancelJob.mutate(job.id)}
          disabled={cancelJob.isPending}
          className="ml-4 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
```

## Fix 3: Smart Cache Keys — Granular Invalidation

Don't use flat keys. Structure them so you can invalidate precisely:

```tsx
// ❌ Flat keys — invalidating 'jobs' refetches everything
useQuery({ queryKey: ['jobs'] });
useQuery({ queryKey: ['job-detail'] });
useQuery({ queryKey: ['job-metrics'] });

// ✅ Hierarchical keys — invalidate by prefix
useQuery({ queryKey: ['jobs', 'list'] });
useQuery({ queryKey: ['jobs', jobId, 'detail'] });
useQuery({ queryKey: ['jobs', jobId, 'dependencies'] });
useQuery({ queryKey: ['metrics'] });

// Invalidate all job-related queries
queryClient.invalidateQueries({ queryKey: ['jobs'] });

// Or just one job's detail and dependencies
queryClient.invalidateQueries({ queryKey: ['jobs', 'job-42'] });
```

### The Submit Job Hook — Same Pattern

```tsx
// src/features/submit/useSubmitJob.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export function useSubmitJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; priority: JobPriority }) =>
      api.jobs.submit(input),

    onSuccess: (newJob) => {
      // Add the new job to the top of the list cache
      queryClient.setQueryData<Job[]>(['jobs', 'list'], (old) =>
        old ? [newJob, ...old] : [newJob]
      );

      // Invalidate metrics (submitted count changed)
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });
}
```

## The Cache Strategy Cheat Sheet

| Scenario | Strategy | Why |
|----------|----------|-----|
| Cancel/submit job | Optimistic update + invalidate | Instant feedback, rolls back on error |
| Job list on navigation | `staleTime: 30s` | Show cached, refetch in background |
| Metrics counters | `refetchInterval: 10s` | Stay reasonably fresh |
| Job detail page | `staleTime: 60s` | Doesn't change often once viewed |
| After WebSocket status update | `setQueryData` | Update cache directly, no refetch |
| User profile/settings | `staleTime: Infinity` + manual invalidate | Fetch once, update explicitly |

## The Result

| Before | After |
|--------|-------|
| Job shows RUNNING after cancel | Status updates instantly |
| Users resubmit thinking cancel failed | Instant confirmation |
| 8 support tickets/day about stale status | 0 |
| 200-500ms flash of stale data | Optimistic update, zero delay |

TicketMaster closes 8 tickets at once. "Finally."

ZeroTrust walks over. "I was looking at the Network tab while testing the cancel flow. Your API key is in the request headers. I can see it in DevTools. Anyone can copy it and cancel jobs from curl."

---

[← Chapter 6: 10,000 Jobs](ch06-virtualization.md) | [Chapter 8: The API Key in DevTools →](ch08-auth-security.md)
