# Chapter 10: The Dashboard Breaks on Mobile

*In which you learn that "it works on my monitor" is not a responsive design strategy.*

[← Chapter 9: Lighthouse Score 23](ch09-performance.md) | [Chapter 11: Real-Time Updates →](ch11-realtime.md)

---

## The Incident

TicketMaster shares a screenshot from her phone. The dashboard is... not great.

> **@TicketMaster:** 40% of our users check job status on their phones. Here's what they see: the sidebar covers half the screen, the job table scrolls horizontally forever, the metrics cards are cut off, and the cancel button is so small I accidentally cancelled the wrong job twice.

You open Chrome DevTools, toggle device mode, pick iPhone 14. She's right. The 1200px-wide table is crammed into 390px. The sidebar is always visible, eating 240px. The metrics cards overflow. The status badges overlap the job names.

Pixel looks over your shoulder. "The tap target for that cancel button is 12×12 pixels. Apple's HIG says minimum 44×44. We're off by... a lot more than 1px."

## The Problem — Fixed-Width Everything

```tsx
// ❌ Desktop-only layout
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-60 h-screen bg-gray-900 text-white p-4">
        <Sidebar />
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
```

The sidebar is always 240px. The table columns are fixed widths. Nothing adapts. On a 390px screen, the main content gets 150px. That's not a dashboard — that's a bookmark.

## Fix 1: Mobile-First Tailwind Layout

Start with the mobile layout. Add complexity for larger screens.

### Tailwind Config — Breakpoint Strategy

```typescript
// tailwind.config.ts — default breakpoints are fine
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px
// Mobile-first: unprefixed styles = mobile, sm: = small tablets, md: = tablets, lg: = desktop
```

### Responsive Layout with Collapsible Sidebar

```tsx
// src/components/Layout.tsx
import { useState } from 'react';
import { Sidebar } from './Sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header with hamburger */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-md hover:bg-gray-100"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Job Engine</h1>
        <div className="w-10" /> {/* spacer for centering */}
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 h-full bg-gray-900 text-white p-4">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar — always visible on lg+ */}
        <aside className="hidden lg:block w-60 h-screen sticky top-0 bg-gray-900 text-white p-4">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
```

Mobile: hamburger menu, full-width content. Desktop: persistent sidebar.

## Fix 2: Responsive Metrics Grid

```tsx
// src/features/metrics/MetricsCards.tsx
import type { JobMetrics } from '../../types/api';

const cards = [
  { key: 'submitted', label: 'Submitted', color: 'text-blue-600' },
  { key: 'completed', label: 'Completed', color: 'text-green-600' },
  { key: 'failed', label: 'Failed', color: 'text-red-600' },
  { key: 'activeJobs', label: 'Active', color: 'text-purple-600' },
] as const;

export function MetricsCards({ metrics }: { metrics: JobMetrics }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {cards.map(({ key, label, color }) => (
        <div key={key} className="rounded-lg bg-white border p-3 md:p-4">
          <p className="text-xs md:text-sm text-gray-500">{label}</p>
          <p className={`text-2xl md:text-3xl font-bold mt-1 ${color}`}>
            {metrics[key].toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
```

Mobile: 2×2 grid. Tablet+: 4 across. Numbers scale down but stay readable.

## Fix 3: Job List — Table on Desktop, Cards on Mobile

This is the big one. A table with 5 columns doesn't work on a 390px screen. On mobile, show cards instead.

```tsx
// src/features/jobs/ResponsiveJobList.tsx
import type { Job } from '../../types/api';
import { JobStatusBadge } from './JobStatusBadge';
import { JobPriorityBadge } from './JobPriorityBadge';
import { formatDistanceToNow } from 'date-fns';

export function ResponsiveJobList({ jobs }: { jobs: Job[] }) {
  return (
    <>
      {/* Mobile: card layout */}
      <div className="md:hidden space-y-3">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Desktop: table layout */}
      <div className="hidden md:block">
        <JobTable jobs={jobs} />
      </div>
    </>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{job.name}</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{job.id}</p>
        </div>
        <JobStatusBadge status={job.status} />
      </div>
      <div className="flex items-center justify-between mt-3">
        <JobPriorityBadge priority={job.priority} />
        <span className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(job.submittedAt), { addSuffix: true })}
        </span>
      </div>
      {(job.status === 'PENDING' || job.status === 'RUNNING') && (
        <button className="mt-3 w-full rounded-md border border-red-200 py-2 text-sm text-red-600 hover:bg-red-50 active:bg-red-100">
          Cancel Job
        </button>
      )}
    </div>
  );
}

function JobTable({ jobs }: { jobs: Job[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-left text-sm text-gray-500 border-b">
          <th className="pb-2">ID</th>
          <th className="pb-2">Name</th>
          <th className="pb-2">Priority</th>
          <th className="pb-2">Status</th>
          <th className="pb-2">Submitted</th>
          <th className="pb-2"></th>
        </tr>
      </thead>
      <tbody>
        {jobs.map(job => (
          <tr key={job.id} className="border-b hover:bg-gray-50">
            <td className="py-3 font-mono text-sm text-gray-600">{job.id}</td>
            <td className="py-3">{job.name}</td>
            <td className="py-3"><JobPriorityBadge priority={job.priority} /></td>
            <td className="py-3"><JobStatusBadge status={job.status} /></td>
            <td className="py-3 text-sm text-gray-400">
              {new Date(job.submittedAt).toLocaleString()}
            </td>
            <td className="py-3">
              {(job.status === 'PENDING' || job.status === 'RUNNING') && (
                <button className="rounded px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                  Cancel
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Fix 4: Touch-Friendly Tap Targets

```tsx
// ❌ Too small for fingers (12×12px)
<button className="text-xs px-1 py-0.5">Cancel</button>

// ✅ Minimum 44×44px touch target
<button className="min-h-[44px] min-w-[44px] px-4 py-2 text-sm">
  Cancel
</button>
```

Apple says 44×44pt minimum. Google says 48×48dp. Either way, 12px is not it.

## Fix 5: Container Queries for Component-Level Responsiveness

Media queries respond to the *viewport*. Container queries respond to the *parent container*. This matters when the same component appears in different contexts:

```css
/* The job card adapts to its container, not the viewport */
@container (min-width: 400px) {
  .job-card {
    flex-direction: row;
    align-items: center;
  }
}
```

```tsx
// src/features/jobs/AdaptiveJobCard.tsx
export function AdaptiveJobCard({ job }: { job: Job }) {
  return (
    <div className="@container">
      <div className="rounded-lg border bg-white p-4 @sm:flex @sm:items-center @sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{job.name}</p>
          <p className="text-xs text-gray-400 font-mono">{job.id}</p>
        </div>
        <div className="mt-2 flex items-center gap-2 @sm:mt-0">
          <JobPriorityBadge priority={job.priority} />
          <JobStatusBadge status={job.status} />
        </div>
      </div>
    </div>
  );
}
```

The card is stacked vertically in narrow containers (sidebar widget) and horizontal in wide ones (main content area) — regardless of viewport width.

## The Responsive Checklist

| Element | Mobile | Desktop |
|---------|--------|---------|
| Sidebar | Hamburger menu, overlay | Persistent, 240px |
| Metrics | 2×2 grid | 4 across |
| Job list | Cards | Table |
| Cancel button | Full-width, 44px tall | Inline, padded |
| Padding | 16px | 32px |
| Font sizes | Slightly smaller | Standard |
| Search | Full-width, sticky top | Inline with header |

## The Result

TicketMaster opens the dashboard on her phone.

- Sidebar: hidden behind hamburger. ✅
- Metrics: 2×2 grid, all visible. ✅
- Job list: cards with clear status badges. ✅
- Cancel button: full-width, easy to tap. ✅
- No horizontal scrolling. ✅

"I can actually use this now," she says.

Pixel inspects the metrics cards on a Pixel 7. "The active jobs counter is 1px lower than the others on this screen size." She pauses. "I'll let it go. For now."

FiveNines has a different concern. "The job statuses on the dashboard are 30 seconds behind reality. I cancelled a job on my phone and it took half a minute to update. We're polling every 30 seconds. Can we do better?"

---

[← Chapter 9: Lighthouse Score 23](ch09-performance.md) | [Chapter 11: Real-Time Updates →](ch11-realtime.md)
