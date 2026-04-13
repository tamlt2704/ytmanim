# Chapter 5: Bobby Tables Says You're Making 200 API Calls

*In which you discover that REST is chatty, GraphQL is not, and your DBA has feelings.*

[← Chapter 4: Data Fetching](ch04-data-fetching.md) | [Chapter 6: 10,000 Jobs →](ch06-virtualization.md)

---

## The Incident

The dashboard loads. Bobby Tables pings you:

> **@BobbyTables:** Your dashboard makes 6 API calls on page load. The job detail page makes 4 more. Multiply that by 200 concurrent users and my database connection pool is at 95%.

You check the Network tab. He's right:

```
GET /api/jobs                    → job list (47 fields per job, you show 5)
GET /api/jobs/job-42             → expanded job detail
GET /api/jobs/job-42/dependencies → dependency chain
GET /api/metrics                 → dashboard counters
GET /api/users/me                → current user info
GET /api/notifications           → unread notifications
GET /api/settings                → user preferences
```

Each REST endpoint returns a fixed shape. The job list returns 47 fields per job — id, name, priority, status, submittedAt, startedAt, completedAt, failureReason, dependsOn, retryCount, maxRetries, timeout, payload, result, tags, createdBy, updatedAt... You display 5 of them in the list view.

NullPointer shrugs. "The API returns everything. That's how REST works."

**Over-fetching:** downloading 47 fields when you need 5.
**Under-fetching:** needing 4 calls to assemble the job detail page.

## The Problem — REST's Fixed Responses

```tsx
// Dashboard needs data from 6 endpoints
function DashboardPage() {
  const jobs = useQuery({ queryKey: ['jobs'], queryFn: () => api.jobs.list() });
  const metrics = useQuery({ queryKey: ['metrics'], queryFn: () => api.metrics.get() });
  const user = useQuery({ queryKey: ['user'], queryFn: () => fetch('/api/users/me') });
  const notifications = useQuery({ queryKey: ['notifications'], queryFn: () => fetch('/api/notifications') });
  const settings = useQuery({ queryKey: ['settings'], queryFn: () => fetch('/api/settings') });

  // 5 loading states, 5 error states, 5 network requests
  if (jobs.isLoading || metrics.isLoading || user.isLoading) {
    return <LoadingSpinner />;
  }

  // jobs.data has 47 fields per job — we use 5 for the list
  // Each expanded row needs another fetch for dependencies
}
```

6 requests. 6 round trips. 6x the latency. And most of the data downloaded is thrown away.

## The Fix — GraphQL: Ask for Exactly What You Need

One request. One round trip. Only the fields you need.

### Setup

```bash
npm install graphql @apollo/client
```

```tsx
// src/lib/apollo.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8080/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Job: { keyFields: ['id'] },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
```

### The Dashboard Query — One Request, Everything You Need

```tsx
// src/features/dashboard/useDashboardData.ts
import { gql, useQuery } from '@apollo/client';

const DASHBOARD_QUERY = gql`
  query Dashboard {
    me {
      name
      avatar
    }
    jobs(limit: 20, sortBy: SUBMITTED_AT) {
      id
      name
      priority
      status
      submittedAt
    }
    metrics {
      submitted
      completed
      failed
      activeJobs
    }
    notifications(unreadOnly: true) {
      id
      message
      createdAt
    }
  }
`;

export function useDashboardData() {
  return useQuery(DASHBOARD_QUERY, {
    pollInterval: 30_000, // refresh every 30s
  });
}
```

5 fields per job instead of 47. 4 metrics instead of the full stats object. One request.

```tsx
// src/features/dashboard/DashboardPage.tsx
export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  if (loading && !data) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-6">
      <MetricsCards metrics={data.metrics} />
      <JobList jobs={data.jobs} />
      <NotificationBell count={data.notifications.length} />
    </div>
  );
}
```

**1 request** instead of 6. **~2KB** response instead of **~18KB**. Bobby Tables can breathe.

### Fragments — Reusable Field Sets for Jobs

The job list shows 5 fields. The job detail page shows 12. The job row in the dependency graph shows 3. Use fragments to define these once:

```tsx
// src/features/jobs/job.fragments.ts
import { gql } from '@apollo/client';

export const JOB_LIST_FIELDS = gql`
  fragment JobListFields on Job {
    id
    name
    priority
    status
    submittedAt
  }
`;

export const JOB_DETAIL_FIELDS = gql`
  fragment JobDetailFields on Job {
    id
    name
    priority
    status
    submittedAt
    startedAt
    completedAt
    failureReason
    dependsOn {
      ...JobListFields
    }
    retryCount
    maxRetries
    tags
  }
  ${JOB_LIST_FIELDS}
`;
```

Now the job detail query fetches the full detail AND the dependency chain in one request:

```tsx
// src/features/jobs/useJobDetail.ts
import { gql, useQuery } from '@apollo/client';
import { JOB_DETAIL_FIELDS } from './job.fragments';

const JOB_DETAIL_QUERY = gql`
  query JobDetail($id: ID!) {
    job(id: $id) {
      ...JobDetailFields
    }
  }
  ${JOB_DETAIL_FIELDS}
`;

export function useJobDetail(id: string) {
  return useQuery(JOB_DETAIL_QUERY, {
    variables: { id },
  });
}
```

One request. Job detail + dependencies. No N+1.

### Mutations — Submitting and Cancelling Jobs

```tsx
// src/features/submit/useSubmitJob.ts
import { gql, useMutation } from '@apollo/client';
import { JOB_LIST_FIELDS } from '../jobs/job.fragments';

const SUBMIT_JOB = gql`
  mutation SubmitJob($input: SubmitJobInput!) {
    submitJob(input: $input) {
      ...JobListFields
    }
  }
  ${JOB_LIST_FIELDS}
`;

export function useSubmitJob() {
  return useMutation(SUBMIT_JOB, {
    update(cache, { data }) {
      cache.modify({
        fields: {
          jobs(existingJobs = []) {
            const newJobRef = cache.writeFragment({
              data: data.submitJob,
              fragment: JOB_LIST_FIELDS,
            });
            return [newJobRef, ...existingJobs];
          },
          metrics(existing) {
            return { ...existing, submitted: existing.submitted + 1 };
          },
        },
      });
    },
  });
}
```

Submit a job → the job list and metrics update instantly. No refetch. No spinner.

### When to Use GraphQL vs REST

| Scenario | Use | Why |
|----------|-----|-----|
| Dashboard with data from 5+ sources | GraphQL | One request, exact fields |
| Simple CRUD with fixed shapes | REST | Simpler, cacheable by URL |
| Mobile users on slow connections | GraphQL | Smaller payloads |
| Public API for third parties | REST | Easier to document, rate limit |
| Complex entity relationships (jobs + dependencies) | GraphQL | Nested queries, no N+1 |

You don't have to go all-in. Many teams use GraphQL for complex pages (dashboard, job detail) and REST for simple endpoints (health check, file upload). The BFF (Backend for Frontend) pattern works well: a thin GraphQL layer in front of the job engine's REST API.

## The Result

| Metric | Before (REST) | After (GraphQL) |
|--------|--------------|-----------------|
| API calls per page load | 6 | 1 |
| Data transferred (job list) | ~18 KB (47 fields × 20 jobs) | ~2 KB (5 fields × 20 jobs) |
| Time to interactive | 2.1s | 0.6s |
| Bobby Tables' connection pool | 95% | 40% |

Bobby Tables checks the connection pool. "Down to 40%. I can breathe again."

NullPointer walks over. "The job list works great with 20 jobs. Production has 10,000. The page freezes when you scroll. Can you fix that?"

---

[← Chapter 4: Data Fetching](ch04-data-fetching.md) | [Chapter 6: 10,000 Jobs →](ch06-virtualization.md)
