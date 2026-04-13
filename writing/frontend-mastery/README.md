# The Intern Who Built the Dashboard — A Senior Frontend Story

The job engine is running. Jobs come in, get processed, complete or fail. Linus is happy. But nobody can *see* what's happening. There's no UI. When something breaks, FiveNines stares at log files.

"We need a dashboard," Linus says. "Show me the jobs. Status, priority, metrics. Real-time. Make it fast."

You built the backend. Now you build the frontend that talks to it. This is the story of how you go from a blank Vite project to a production dashboard — and learn every technique a senior frontend engineer needs along the way.

**The backend:** The job engine from the previous series (Spring Boot, Java 21). It exposes a REST API for jobs, metrics, and status.

**Target audience:** Frontend devs who can build things but want to build them *well*.

**Prerequisites:** JavaScript/TypeScript basics, React fundamentals.

**Stack:** React 19, TypeScript, Vite, TanStack Query, GraphQL, Tailwind CSS.

---

## The Cast

| Name | Role | Why the nickname |
|------|------|-----------------|
| **Linus** | Tech lead | "Where's my dashboard?" |
| **FiveNines** | Ops | "The Lighthouse score dropped 2 points. ROLL IT BACK." |
| **TicketMaster** | PM | "Users say the job list takes 8 seconds to load" |
| **ZeroTrust** | Security | "Why is the API key in the bundle?" |
| **NullPointer** | Data engineer | "The jobs API returns 47 fields per job. Good luck." |
| **Bobby Tables** | DBA | "Your dashboard makes 200 API calls on page load." |
| **Pixel** | Designer | New character. "The status badge is 1px off. Ship it again." |

---

## The Job Engine API

The backend exposes these endpoints (from the job engine series):

```
GET  /api/jobs                  → list all jobs (status, priority, timestamps)
GET  /api/jobs/{id}             → job detail
POST /api/jobs                  → submit a new job
POST /api/jobs/{id}/cancel      → cancel a pending job
GET  /api/metrics               → submitted, completed, failed, active counts
WS   /ws/jobs                   → real-time job status updates (WebSocket)
```

Each job looks like:

```json
{
  "id": "job-42",
  "name": "send-email",
  "priority": "HIGH",
  "status": "RUNNING",
  "submittedAt": "2025-03-15T10:30:00Z",
  "startedAt": "2025-03-15T10:30:01Z",
  "completedAt": null,
  "failureReason": null,
  "dependsOn": ["job-41"]
}
```

---

## The Story

### Part I: The Foundations (You Break Things)

| Ch | Problem | What You Learn | Key Technique |
|----|---------|----------------|---------------|
| 1 | [The blank page that takes 12 seconds](ch01-project-setup.md) | Project setup, why Vite, connecting to the job engine API | Vite, TypeScript, project structure |
| 2 | [The job list re-renders 300 times](ch02-rendering.md) | React rendering, wasted renders when job status updates | `memo`, `useMemo`, `useCallback`, React DevTools |
| 3 | [The job form loses your data](ch03-state.md) | State management for the "submit job" form | Local vs global state, Zustand |
| 4 | [The dashboard shows a spinner for 3 seconds](ch04-data-fetching.md) | Naive fetch() for job list and metrics | TanStack Query, stale-while-revalidate |

### Part II: Real-World Patterns (You Lose Things)

| Ch | Problem | What You Learn | Key Technique |
|----|---------|----------------|---------------|
| 5 | [Bobby Tables says 200 API calls](ch05-graphql.md) | REST over-fetching job fields, N+1 for dependencies | GraphQL, query batching, fragments |
| 6 | [10,000 jobs freeze the browser](ch06-virtualization.md) | DOM overload rendering the full job list | Virtual scrolling, `react-window` |
| 7 | [Job status stuck after cancel](ch07-caching.md) | Stale cache after mutations (cancel, submit) | Cache invalidation, optimistic updates |
| 8 | [API key visible in DevTools](ch08-auth-security.md) | Frontend security for the job engine API | Auth tokens, BFF pattern |

### Part III: Performance & Scale (Everything Is Slow)

| Ch | Problem | What You Learn | Key Technique |
|----|---------|----------------|---------------|
| 9 | [Lighthouse score: 23](ch09-performance.md) | Core Web Vitals for the dashboard | Code splitting, lazy loading, image optimization |
| 10 | [Dashboard breaks on mobile](ch10-responsive.md) | Job list unreadable on small screens | Tailwind, container queries, mobile-first |
| 11 | [Real-time updates lag 30 seconds](ch11-realtime.md) | Polling vs WebSocket for live job status | WebSocket, server-sent events, live indicators |
| 12 | [A deploy breaks the job submission form](ch12-testing-ci.md) | No tests, no CI | Vitest, Playwright, CI/CD |

### Part IV: The Senior Leap (You Build Real Things)

| Ch | Problem | What You Learn | Key Technique |
|----|---------|----------------|---------------|
| 13 | [Pixel says the status badges are inconsistent](ch13-design-system.md) | Copy-paste components for job status, priority | Component library, Storybook, design tokens |
| 14 | [The monorepo that takes 20 minutes](ch14-monorepo.md) | Sharing types between job engine backend and frontend | Turborepo, shared packages |
| 15 | [You ship it. Pixel says it's 1px off.](ch15-ship-it.md) | Everything together | Architecture review, the senior mindset |

---

## What the Dashboard Shows

```
┌─────────────────────────────────────────────────────────┐
│  Job Engine Dashboard                          [user] ▼ │
├──────────┬──────────────────────────────────────────────┤
│          │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ Sidebar  │  │ 1205 │ │  847 │ │   23 │ │   12 │       │
│          │  │submit│ │ done │ │ fail │ │active│       │
│ • Jobs   │  └──────┘ └──────┘ └──────┘ └──────┘       │
│ • Metrics│                                              │
│ • Submit │  ┌─────────────────────────────────────────┐ │
│ • Settings│ │ Job List                    [search] 🔍 │ │
│          │  ├─────────────────────────────────────────┤ │
│          │  │ ● job-42  send-email   HIGH   RUNNING   │ │
│          │  │ ● job-41  gen-report   NORM   COMPLETED │ │
│          │  │ ● job-40  cleanup      LOW    PENDING   │ │
│          │  │ ○ job-39  payment      CRIT   FAILED    │ │
│          │  │ ...                                     │ │
│          │  └─────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────┘
```

Each chapter adds a feature to this dashboard while teaching a frontend engineering concept.
