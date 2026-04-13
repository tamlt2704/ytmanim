# Chapter 11: Real-Time Updates Lag 30 Seconds

*In which you learn that polling is asking "are we there yet?" every 30 seconds, and WebSockets are the parent saying "I'll tell you when we get there."*

[← Chapter 10: Dashboard Breaks on Mobile](ch10-responsive.md) | [Chapter 12: A Deploy Breaks Everything →](ch12-testing-ci.md)

---

## The Incident

FiveNines is watching the dashboard during a batch processing run. 500 jobs submitted. He's watching them transition from PENDING → RUNNING → COMPLETED. Except he's not watching them in real time. He's watching them in 30-second snapshots.

> **@FiveNines:** Job-847 failed 25 seconds ago. The dashboard still shows RUNNING. I only found out because I checked the logs. What's the point of a dashboard if it's 30 seconds behind reality?

Your current setup: TanStack Query polls `/api/jobs` every 30 seconds. Between polls, the dashboard is a snapshot of the past. In a system where jobs complete in 2-3 seconds, a 30-second polling interval means you're always looking at stale data.

## The Problem — Polling Is Wasteful and Slow

```tsx
// ❌ Current approach: poll every 30 seconds
const { data: jobs } = useQuery({
  queryKey: ['jobs'],
  queryFn: () => api.jobs.list(),
  refetchInterval: 30_000, // 30 seconds of staleness
});
```

Problems:
1. **30 seconds of stale data.** A job fails at T+1s. You see it at T+31s.
2. **Wasteful when nothing changes.** At 3 AM, no jobs are running. You're still polling every 30 seconds.
3. **Wasteful when everything changes.** During a batch run, 50 jobs change status per second. You see one snapshot every 30 seconds.
4. **Scales poorly.** 200 users × 1 poll/30s = 400 requests/minute to the job list endpoint. For data that mostly hasn't changed.

## The Fix — WebSocket for Live Job Status

The job engine already exposes a WebSocket endpoint at `/ws/jobs` that pushes status changes as they happen.

### Step 1: The WebSocket Hook

```tsx
// src/features/jobs/useJobWebSocket.ts
import { useEffect, useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Job, JobStatus } from '../../types/api';

interface JobStatusEvent {
  type: 'JOB_STATUS_CHANGED';
  jobId: string;
  status: JobStatus;
  timestamp: string;
}

interface MetricsEvent {
  type: 'METRICS_UPDATED';
  submitted: number;
  completed: number;
  failed: number;
  activeJobs: number;
}

type WSEvent = JobStatusEvent | MetricsEvent;

export function useJobWebSocket() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [connected, setConnected] = useState(false);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws/jobs';
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      reconnectAttempts.current = 0;
      console.log('[WS] Connected to job engine');
    };

    ws.onmessage = (event) => {
      const data: WSEvent = JSON.parse(event.data);

      if (data.type === 'JOB_STATUS_CHANGED') {
        // Update the specific job in the cached job list
        queryClient.setQueryData<Job[]>(['jobs', 'list'], (old) =>
          old?.map(job =>
            job.id === data.jobId
              ? { ...job, status: data.status }
              : job
          )
        );

        // Update individual job cache if it exists
        queryClient.setQueryData<Job>(['jobs', data.jobId, 'detail'], (old) =>
          old ? { ...old, status: data.status } : old
        );
      }

      if (data.type === 'METRICS_UPDATED') {
        queryClient.setQueryData(['metrics'], {
          submitted: data.submitted,
          completed: data.completed,
          failed: data.failed,
          activeJobs: data.activeJobs,
        });
      }
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;

      // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
      const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30_000);
      reconnectAttempts.current++;

      console.log(`[WS] Disconnected. Reconnecting in ${delay / 1000}s...`);
      reconnectTimeoutRef.current = setTimeout(connect, delay);
    };

    ws.onerror = () => {
      ws.close(); // triggers onclose → reconnect
    };
  }, [queryClient]);

  useEffect(() => {
    connect();

    return () => {
      wsRef.current?.close();
      clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connect]);

  return { connected };
}
```

### Step 2: Connection Status Indicator

Users should know if they're seeing live data or stale data:

```tsx
// src/components/ConnectionIndicator.tsx
export function ConnectionIndicator({ connected }: { connected: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <div
        className={`w-2 h-2 rounded-full ${
          connected ? 'bg-green-500' : 'bg-red-500 animate-pulse'
        }`}
      />
      <span className={connected ? 'text-green-600' : 'text-red-600'}>
        {connected ? 'Live' : 'Reconnecting...'}
      </span>
    </div>
  );
}
```

### Step 3: Wire It Into the Dashboard

```tsx
// src/features/dashboard/DashboardPage.tsx
import { useJobWebSocket } from '../jobs/useJobWebSocket';
import { ConnectionIndicator } from '../../components/ConnectionIndicator';

export default function DashboardPage() {
  const { connected } = useJobWebSocket();
  const { data: metrics } = useMetrics();
  const { data: jobs } = useJobs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <ConnectionIndicator connected={connected} />
      </div>

      {metrics && <MetricsCards metrics={metrics} />}
      {jobs && <ResponsiveJobList jobs={jobs} />}
    </div>
  );
}
```

### Step 4: Fallback to Polling When WebSocket Fails

WebSockets can fail — corporate proxies, load balancers that kill idle connections, flaky networks. Fall back to polling when disconnected:

```tsx
// src/features/jobs/useJobs.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useJobWebSocket } from './useJobWebSocket';

export function useJobs(search?: string) {
  const { connected } = useJobWebSocket();

  return useQuery({
    queryKey: ['jobs', 'list'],
    queryFn: () => api.jobs.list(),
    // Poll every 10s when WebSocket is down, don't poll when connected
    refetchInterval: connected ? false : 10_000,
    select: (jobs) =>
      search
        ? jobs.filter(j =>
            j.name.toLowerCase().includes(search.toLowerCase())
          )
        : jobs,
  });
}
```

WebSocket connected → live updates, no polling. WebSocket down → fall back to 10-second polling. Best of both worlds.

## How the Data Flows

```
WebSocket connected:
  Server: job-42 status → COMPLETED
  WebSocket message → useJobWebSocket
  → queryClient.setQueryData(['jobs', 'list'], ...)
  → JobRow for job-42 re-renders with new status
  → Latency: ~50ms

WebSocket disconnected (fallback):
  TanStack Query polls /api/jobs every 10s
  → Full job list refetch
  → Latency: 0-10 seconds
```

## The Reconnection Strategy

```
Attempt 1: reconnect after 1 second
Attempt 2: reconnect after 2 seconds
Attempt 3: reconnect after 4 seconds
Attempt 4: reconnect after 8 seconds
Attempt 5: reconnect after 16 seconds
Attempt 6+: reconnect after 30 seconds (max)

On successful reconnect: reset counter, refetch all data
```

The exponential backoff prevents hammering the server when it's down. The max cap of 30 seconds means you'll always try again within half a minute.

## When to Use What

| Approach | Use When | Latency |
|----------|----------|---------|
| Polling (refetchInterval) | Low-frequency updates, simple setup | 0 to interval |
| WebSocket | Real-time status, live dashboards | ~50ms |
| Server-Sent Events (SSE) | One-way server → client, simpler than WS | ~50ms |
| Long polling | WebSocket not available (old infra) | ~100ms |

For the job engine dashboard, WebSocket is the right call. Job statuses change frequently during batch runs, and users expect to see changes immediately.

## The Result

| Metric | Before (polling) | After (WebSocket) |
|--------|-----------------|-------------------|
| Update latency | 0-30 seconds | ~50ms |
| Requests during idle | 2/min (polling) | 0 (WS heartbeat only) |
| Requests during batch run | 2/min (same, missing updates) | 0 (push-based) |
| Stale data window | 30 seconds | <100ms |

FiveNines watches a batch run. Jobs flip from PENDING → RUNNING → COMPLETED in real time. The metrics counters tick up live. The green "Live" indicator glows in the corner.

"Now that's a dashboard," he says.

Linus walks over. "Looks great. Ship it." You push to main. The deploy goes out. TicketMaster pings you 2 hours later.

> **@TicketMaster:** The submit job form is broken. Users click submit and nothing happens. Since when?

> **@Linus:** Since the last deploy. Who reviewed that PR?

Nobody. There are no tests. There is no CI. There is no review gate. Someone pushed a change that broke the form validation, and nobody noticed for 2 hours.

---

[← Chapter 10: Dashboard Breaks on Mobile](ch10-responsive.md) | [Chapter 12: A Deploy Breaks Everything →](ch12-testing-ci.md)
