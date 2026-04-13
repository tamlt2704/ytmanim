# Chapter 15: You Ship It. Pixel Says It's 1px Off.

*In which everything comes together, the dashboard goes to production, and you learn what makes a senior frontend engineer.*

[← Chapter 14: The 20-Minute Build](ch14-monorepo.md) | [Series Overview →](README.md)

---

## The PR

You open the pull request. Title: "Job Engine Dashboard v1.0 — Production Ready."

The diff is large. 14 chapters of work. But every piece has been reviewed, tested, and argued about in Slack threads that went on too long.

Linus reviews the PR. He goes file by file.

## The Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser                                   │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Zustand  │  │ TanStack │  │  Apollo   │  │WebSocket │       │
│  │  (forms)  │  │  Query   │  │  Client   │  │  Hook    │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │              │              │              │              │
│  ┌────┴──────────────┴──────────────┴──────────────┴────┐       │
│  │              React Component Tree                      │       │
│  │                                                        │       │
│  │  Layout ─┬─ Sidebar (collapsible on mobile)           │       │
│  │          ├─ MetricsCards (2×2 mobile, 4×1 desktop)    │       │
│  │          ├─ VirtualJobList (react-window, 10k+ rows)  │       │
│  │          ├─ SubmitJobForm (Zustand draft persistence)  │       │
│  │          └─ ConnectionIndicator (WS status)            │       │
│  │                                                        │       │
│  │  Design System: Badge, Button, Card, tokens.ts         │       │
│  └────────────────────────────────────────────────────────┘       │
│                                                                  │
│  Vite ─── lazy routes ─── code splitting ─── 180KB initial       │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                    JWT + httpOnly cookies
                           │
                    ┌──────┴──────┐
                    │  BFF Layer  │  (auth, rate limiting, API key)
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │    Job Engine API        │
              │    (Spring Boot, Java)   │
              │                          │
              │  REST: /api/jobs         │
              │  REST: /api/metrics      │
              │  GraphQL: /graphql       │
              │  WS: /ws/jobs            │
              └──────────┬──────────────┘
                         │
                    ┌────┴────┐
                    │   DB    │
                    └─────────┘
```

## The Review

Linus goes through the checklist.

### Rendering (Ch 2)
> "Job status change re-renders 3 components instead of 300. `memo` on `JobRow`, state pushed down to `SearchableJobList`. Good."

### State Management (Ch 3)
> "Form draft in Zustand. Survives navigation. Clears on submit. `useWarnUnsaved` for tab close. Clean."

### Data Fetching (Ch 4)
> "TanStack Query with 30s staleTime. Skeleton loaders. No spinners on navigation. Background refetch. Solid."

### API Layer (Ch 5)
> "GraphQL for the dashboard query — 1 request instead of 6. REST for simple mutations. Fragments for job fields. Bobby Tables approved."

### Virtualization (Ch 6)
> "react-window for the job list. 22 DOM nodes instead of 10,847. 60fps scroll. FiveNines approved."

### Cache Invalidation (Ch 7)
> "Optimistic updates on cancel. Rollback on error. Hierarchical cache keys. No stale status badges."

### Security (Ch 8)
> "JWT auth. httpOnly cookies. No API key in the bundle. XSS sanitization. BFF pattern. ZeroTrust said 'acceptable.'"

### Performance (Ch 9)
> "Lazy routes. Dynamic imports for charts. Skeleton loaders for CLS. 180KB initial bundle."

### Responsive (Ch 10)
> "Mobile-first. Cards on mobile, table on desktop. Collapsible sidebar. 44px tap targets."

### Real-Time (Ch 11)
> "WebSocket for live status. Fallback to polling. Reconnection with exponential backoff. Connection indicator."

### Testing (Ch 12)
> "Vitest + RTL for components. Playwright for E2E. GitHub Actions CI. No more silent breakage."

### Design System (Ch 13)
> "One `JobStatusBadge`. One set of tokens. Storybook for documentation. Pixel approved (mostly)."

### Monorepo (Ch 14)
> "Shared types from OpenAPI. Turborepo caching. No more type drift between Java and TypeScript."

Linus approves the PR. "Ship it."

## The Deploy

CI runs. All green.

```
✓ Type check          (4s)
✓ Lint                 (6s)
✓ Unit tests           (8s)   — 47 passed
✓ Component tests      (12s)  — 23 passed
✓ Build                (9s)   — 180KB initial chunk
✓ E2E tests            (34s)  — 8 passed
✓ Lighthouse CI        (15s)  — Score: 96

Deploy to production... done.
```

## The Reactions

FiveNines opens the production dashboard. Runs a Lighthouse audit.

> **@FiveNines:** Performance: 96. LCP: 0.9s. CLS: 0.01. This is... acceptable.

He watches a batch run. 200 jobs submitted. Status badges flip in real time. The green "Live" indicator glows. The metrics counters tick up as jobs complete.

> **@FiveNines:** The WebSocket reconnected after I closed my laptop lid. No stale data. No manual refresh. This is how a dashboard should work.

TicketMaster checks her queue.

> **@TicketMaster:** Zero tickets about the dashboard today. First time in three months. The submit form works. The cancel button works. Mobile users can actually use it. I have nothing to complain about.

She pauses.

> **@TicketMaster:** That feels wrong. Let me check again.

She checks again. Zero tickets.

ZeroTrust runs his security scan.

> **@ZeroTrust:** No API keys in the bundle. JWT with 15-minute expiry. httpOnly refresh token. CSP headers. Source maps disabled in production.

He pauses.

> **@ZeroTrust:** Acceptable.

Bobby Tables checks the database.

> **@BobbyTables:** Connection pool at 35%. GraphQL reduced the API calls by 80%. The dashboard is no longer my top consumer. I can allocate connections to the batch processor again.

NullPointer checks the shared types package.

> **@NullPointer:** The TypeScript types match the Java models exactly. Auto-generated from OpenAPI. No drift. I added a `retryPolicy` field to the Job entity yesterday — the dashboard got a TypeScript error within 5 minutes. That's how it should work.

## The Key Decisions

| Decision | What We Chose | Why | Alternative |
|----------|--------------|-----|-------------|
| Build tool | Vite | Fast dev server, good defaults | webpack (slower), Next.js (SSR overkill for dashboard) |
| State (forms) | Zustand | Survives navigation, selector subscriptions | Context (re-render problem), Redux (too much boilerplate) |
| State (server) | TanStack Query | Caching, background refetch, devtools | SWR (less features), manual fetch (pain) |
| API (complex pages) | GraphQL | One request, exact fields | REST (over-fetching), tRPC (needs Node backend) |
| API (mutations) | REST | Simple, well-understood | GraphQL mutations (works too, more setup) |
| Long lists | react-window | Virtual scrolling, small bundle | react-virtuoso (heavier), pagination (different UX) |
| Styling | Tailwind CSS | Utility-first, responsive, fast | CSS Modules (more files), styled-components (runtime cost) |
| Real-time | WebSocket + polling fallback | Live updates, resilient | SSE (simpler, one-way), polling only (laggy) |
| Testing | Vitest + RTL + Playwright | Fast, standard, reliable | Jest (slower), Cypress (heavier E2E) |
| Monorepo | Turborepo + pnpm | Fast builds, shared packages | Nx (heavier), Lerna (legacy) |
| Types | OpenAPI → TypeScript | Auto-generated, no drift | Manual sync (always drifts), tRPC (needs Node) |

## What Makes a Senior Frontend Engineer

It's not knowing React. Every bootcamp grad knows React.

It's knowing *when* to use `memo` and when it's premature. It's knowing that `staleTime: 30000` means 30 seconds of stale data and choosing that tradeoff deliberately. It's knowing that a 10,000-row table needs virtualization before your PM files the ticket. It's knowing that the API key in the bundle is a security incident waiting to happen.

It's the difference between "it works" and "it works at scale, it's secure, it's fast, it's tested, it's maintainable, and the types are generated from the backend so they never drift."

A senior frontend engineer:
- **Measures before optimizing.** React DevTools Profiler, Lighthouse, bundle analyzer. Not guessing.
- **Chooses the right tool for the problem.** Zustand for form state, TanStack Query for server state, WebSocket for real-time. Not one tool for everything.
- **Thinks about the user on a slow phone.** Mobile-first. Lazy loading. Virtual scrolling. 44px tap targets.
- **Thinks about the next developer.** Design tokens. Shared types. Storybook. Tests. CI.
- **Ships.** Not "it's almost done." Not "I just need to refactor one more thing." Ships.

## The Final Check

You're about to close your laptop. Pixel sends one last message.

> **@Pixel:** I've been looking at the metrics cards on the production dashboard.

You wait.

> **@Pixel:** The "Active Jobs" counter is 1px lower than the other three. The baseline is off. It's subtle but I can see it.

You zoom in to 800%. She's right. The number "12" in the active jobs card sits 1px lower than "1205", "847", and "23" in the other cards. It's a font rendering quirk — single-line numbers with descenders in the font metrics.

> **@Pixel:** Fix it in the next sprint. Otherwise... it's good. Ship it.

That's the highest praise Pixel gives.

---

You started with a blank Vite project and a job engine API. You ended with a production dashboard that handles 10,000 jobs, updates in real time, scores 96 on Lighthouse, works on mobile, has a design system, a test suite, a CI pipeline, and shared types that never drift from the backend.

You broke things along the way. The form lost data. The cache served stale status. The API key was in the bundle. The list froze the browser. Every chapter was a mistake you made and fixed.

That's how you learn. That's how everyone learns.

You're not an intern anymore.

---

[← Chapter 14: The 20-Minute Build](ch14-monorepo.md) | [Series Overview →](README.md)
