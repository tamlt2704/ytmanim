# Chapter 2: The Job List That Re-renders 300 Times

*In which you learn that React renders more than you think, and a single job status change shouldn't repaint the entire dashboard.*

[← Chapter 1: The Blank Page](ch01-project-setup.md) | [Chapter 3: The Form That Loses Data →](ch03-state.md)

---

## The Incident

The dashboard shows 500 jobs. FiveNines opens React DevTools Profiler:

> **@FiveNines:** One job changes from RUNNING to COMPLETED. The entire page re-renders. Every row, every badge, every metrics card. 300 components. For one status change.

You open the Profiler. He's right. The job list fetches all jobs into a single state variable. When one job updates, `setJobs()` triggers a re-render of the parent. Every child re-renders. The metrics cards re-render. The sidebar re-renders.

On mobile, there's visible jank every time a job completes.

## Why This Happens

React's rendering rule is simple: **when a component's state changes, it re-renders itself and ALL its children.** Every single one. Even if their props didn't change.

```tsx
// ❌ The problem — entire dashboard re-renders when jobs update
function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  return (
    <div>
      <SearchBox />
      <MetricsCards />        {/* re-renders when jobs update */}
      <JobList jobs={jobs} /> {/* 500 rows, all re-render */}
      <Sidebar />             {/* re-renders when jobs update */}
    </div>
  );
}
```

`MetricsCards` doesn't depend on the job list. Doesn't matter. Its parent re-rendered, so it re-renders too.

## The Failing Test — React DevTools Profiler

No code test here — the Profiler IS the test. Open React DevTools → Profiler → Record → type one character → Stop.

You'll see:
- 300+ components rendered
- Most highlighted as "Did not render" reason: "Parent re-rendered"
- Total render time: 50-100ms per keystroke
- On mobile: 200ms+ per keystroke = visible lag

## Fix 1: `React.memo` — Skip Re-renders When Props Don't Change

```tsx
// ✅ Wrap expensive components
const MetricsCards = memo(function MetricsCards({ metrics }: { metrics: JobMetrics }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard title="Submitted" value={metrics.submitted} />
      <StatCard title="Completed" value={metrics.completed} />
      <StatCard title="Failed" value={metrics.failed} />
      <StatCard title="Active" value={metrics.activeJobs} />
    </div>
  );
});

const JobRow = memo(function JobRow({ job }: { job: Job }) {
  // Only re-renders when THIS job's data changes
  return (
    <tr>
      <td>{job.id}</td>
      <td>{job.name}</td>
      <td><JobStatusBadge status={job.status} /></td>
    </tr>
  );
});
```

`memo()` tells React: "Before re-rendering this component, check if the props changed. If they're the same, skip it."

## Fix 2: `useMemo` — Cache Expensive Computations

```tsx
function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  // ❌ Recalculates on every render
  const sorted = transactions.sort((a, b) => b.date - a.date);
  const totals = transactions.reduce((sum, t) => sum + t.amount, 0);

  // ✅ Only recalculates when transactions change
  const sorted = useMemo(
    () => [...transactions].sort((a, b) => b.date - a.date),
    [transactions]
  );

  const totals = useMemo(
    () => transactions.reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  return <table>...</table>;
}
```

`useMemo` caches the result. If `transactions` hasn't changed since last render, it returns the cached value without recomputing.

## Fix 3: `useCallback` — Stable Function References

```tsx
function Dashboard() {
  const [search, setSearch] = useState('');

  // ❌ New function created every render → children see new prop → re-render
  const handleSearch = (value: string) => setSearch(value);

  // ✅ Same function reference across renders
  const handleSearch = useCallback(
    (value: string) => setSearch(value),
    []
  );

  return (
    <div>
      <SearchBox value={search} onChange={handleSearch} />
      <StatsCards />
      <RevenueChart />
      <TransactionTable />
    </div>
  );
}
```

Without `useCallback`, `handleSearch` is a new function object every render. If `SearchBox` is wrapped in `memo`, it still re-renders because the `onChange` prop is a "new" function (different reference, same behavior).

## Fix 4: Move State Down — The Real Fix

The best optimization is structural. Don't lift state higher than it needs to be:

```tsx
// ✅ Job search state lives in the job list, not the dashboard
function DashboardPage() {
  return (
    <div>
      <MetricsSection />           {/* fetches its own data */}
      <SearchableJobList />        {/* owns search state + job data */}
      <Sidebar />                  {/* never re-renders from job updates */}
    </div>
  );
}

function SearchableJobList() {
  const [search, setSearch] = useState('');
  const { data: jobs } = useJobs(search);

  return (
    <div>
      <SearchBox value={search} onChange={setSearch} />
      <JobTable jobs={jobs} />
    </div>
  );
}
```

Now a job status change only re-renders `SearchableJobList` and its children. `MetricsSection` and `Sidebar` are untouched.

## When to Use What

| Technique | Use When | Don't Use When |
|-----------|----------|----------------|
| `memo()` | Expensive component, parent re-renders often, props rarely change | Simple/cheap components (memo has overhead too) |
| `useMemo()` | Expensive computation (sorting, filtering, aggregation) | Simple values, primitives |
| `useCallback()` | Passing functions to `memo`-wrapped children | Functions not passed as props |
| Move state down | State only affects part of the tree | State genuinely needed by many siblings |

## The Rule

> **Don't optimize first. Measure first.** Open React DevTools Profiler. Find the components that re-render unnecessarily. Fix those. Ignore the rest. Premature `memo()` everywhere is worse than no optimization — it adds complexity and can actually slow things down if props change frequently.

## The Result

After the fixes:
- Job status changes → only the affected `JobRow` re-renders
- MetricsCards, Sidebar: zero re-renders from job updates
- Render time per update: 3ms (down from 80ms)
- Mobile jank: gone

FiveNines checks the Profiler. "3 components instead of 300. That's more like it."

TicketMaster walks over. "Users are complaining that the 'submit job' form loses their data when they switch tabs. Can you look at that?"

---

[← Chapter 1: The 4MB Bundle](ch01-project-setup.md) | [Chapter 3: The Form That Loses Data →](ch03-state.md)
