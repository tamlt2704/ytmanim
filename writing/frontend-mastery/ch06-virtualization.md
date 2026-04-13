# Chapter 6: 10,000 Jobs Freeze the Browser

*In which you learn that the DOM has limits, and rendering things nobody can see is a waste of everyone's time.*

[← Chapter 5: 200 API Calls](ch05-graphql.md) | [Chapter 7: Stale Cache After Cancel →](ch07-caching.md)

---

## The Incident

Staging has 500 jobs. Everything's smooth. Then you deploy to production.

> **@FiveNines:** The job list page is frozen. I can't scroll. I can't click. Chrome's memory usage is at 1.2GB. Production has 10,847 jobs.

You open the production dashboard. The page loads. You try to scroll. Nothing happens for 2 seconds. Then it jumps. You open DevTools Performance tab and record a scroll. The flame chart is a wall of red.

10,847 `<tr>` elements. 54,235 `<td>` elements. Each job row has a status badge, a priority badge, a formatted date. The browser is painting all of them. On every frame.

## The Problem — Rendering Everything

```tsx
// ❌ Renders ALL 10,847 rows into the DOM
function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <div className="h-[600px] overflow-auto">
      {jobs.map(job => (
        <JobRow key={job.id} job={job} />
      ))}
    </div>
  );
}
```

The user's screen shows ~20 rows at a time. The browser renders 10,847. That's 10,827 rows nobody can see, each consuming memory, each participating in layout calculations, each slowing down every scroll event.

## The Fix — Virtual Scrolling with react-window

Only render the rows that are visible. As the user scrolls, swap rows in and out of the DOM.

```bash
npm install react-window
npm install -D @types/react-window
```

### Step 1: The Virtual Job List

```tsx
// src/features/jobs/VirtualJobList.tsx
import { FixedSizeList } from 'react-window';
import { memo } from 'react';
import type { Job } from '../../types/api';
import { JobStatusBadge } from './JobStatusBadge';

const ROW_HEIGHT = 48;
const VISIBLE_HEIGHT = 600;

interface JobRowProps {
  index: number;
  style: React.CSSProperties;
  data: Job[];
}

const JobRow = memo(function JobRow({ index, style, data }: JobRowProps) {
  const job = data[index];

  return (
    <div
      style={style}
      className="flex items-center border-b border-gray-100 px-4 hover:bg-gray-50"
    >
      <span className="w-28 font-mono text-sm text-gray-600 truncate">
        {job.id}
      </span>
      <span className="flex-1 truncate">{job.name}</span>
      <span className="w-20 text-sm text-gray-500">{job.priority}</span>
      <span className="w-28">
        <JobStatusBadge status={job.status} />
      </span>
      <span className="w-40 text-sm text-gray-400">
        {new Date(job.submittedAt).toLocaleString()}
      </span>
    </div>
  );
});

export function VirtualJobList({ jobs }: { jobs: Job[] }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 border-b">
        <span className="w-28">ID</span>
        <span className="flex-1">Name</span>
        <span className="w-20">Priority</span>
        <span className="w-28">Status</span>
        <span className="w-40">Submitted</span>
      </div>

      {/* Virtual list — only renders ~15 visible rows */}
      <FixedSizeList
        height={VISIBLE_HEIGHT}
        itemCount={jobs.length}
        itemSize={ROW_HEIGHT}
        itemData={jobs}
        overscanCount={5}
      >
        {JobRow}
      </FixedSizeList>

      {/* Footer */}
      <div className="px-4 py-2 text-sm text-gray-400">
        {jobs.length.toLocaleString()} jobs
      </div>
    </div>
  );
}
```

### How It Works

`FixedSizeList` renders a container with the total scroll height (10,847 × 48px = ~521,000px) but only creates DOM nodes for the visible rows plus a few extras (`overscanCount`).

```
Total jobs: 10,847
Visible rows: ~12 (600px ÷ 48px)
Overscan: 5 above + 5 below
DOM nodes at any time: ~22

Before: 10,847 DOM rows
After:  22 DOM rows
```

As you scroll, react-window recycles the DOM nodes — updating their content and `style.top` position. The browser only paints ~22 rows per frame instead of 10,847.

### Step 2: Integrating with the Job List Page

```tsx
// src/features/jobs/JobListPage.tsx
import { useState } from 'react';
import { useJobs } from './useJobs';
import { VirtualJobList } from './VirtualJobList';

export default function JobListPage() {
  const [search, setSearch] = useState('');
  const { data: jobs, isLoading, error } = useJobs(search);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <span className="text-sm text-gray-400">
          {jobs?.length.toLocaleString()} total
        </span>
      </div>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or ID..."
        className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2"
      />

      {jobs && <VirtualJobList jobs={jobs} />}
    </div>
  );
}
```

### Step 3: Variable Height Rows (When You Need Them)

Some job names are long. Some have tags. If rows aren't all the same height, use `VariableSizeList`:

```tsx
import { VariableSizeList } from 'react-window';

function getRowHeight(index: number, jobs: Job[]): number {
  const job = jobs[index];
  const hasFailureReason = job.status === 'FAILED' && job.failureReason;
  const hasDependencies = job.dependsOn.length > 0;
  return hasFailureReason || hasDependencies ? 72 : 48;
}

export function VariableJobList({ jobs }: { jobs: Job[] }) {
  return (
    <VariableSizeList
      height={600}
      itemCount={jobs.length}
      itemSize={index => getRowHeight(index, jobs)}
      itemData={jobs}
      overscanCount={5}
    >
      {JobRow}
    </VariableSizeList>
  );
}
```

## The Performance Numbers

| Metric | Before (all rows) | After (virtual) |
|--------|-------------------|-----------------|
| DOM nodes | 54,235 | ~110 |
| Initial render | 2,400ms | 12ms |
| Scroll FPS | 8-12 fps (janky) | 60 fps (smooth) |
| Memory usage | 1.2 GB | 180 MB |
| Time to interactive | 4.1s | 0.3s |

## When NOT to Virtualize

Don't reach for react-window when you have 50 items. The overhead of virtualization (measuring, recycling, absolute positioning) isn't worth it for small lists. Rule of thumb:

| List size | Approach |
|-----------|----------|
| < 100 items | Just render them all |
| 100-500 items | Consider pagination first |
| 500+ items | Virtual scrolling |
| 10,000+ items | Virtual scrolling + server-side pagination |

## The Result

FiveNines scrolls through 10,847 jobs. Smooth. 60fps. No jank.

"That's production-grade," he says. Then he tries something: he cancels a job. Navigates back to the list. The job still shows RUNNING.

> **@FiveNines:** I just cancelled job-42. The list still says RUNNING. I refreshed — now it says CANCELLED. Why didn't it update?

TicketMaster overhears. "Add that to the ticket."

---

[← Chapter 5: 200 API Calls](ch05-graphql.md) | [Chapter 7: Stale Cache After Cancel →](ch07-caching.md)
