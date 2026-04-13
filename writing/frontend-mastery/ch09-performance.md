# Chapter 9: Lighthouse Score: 23

*In which you learn that shipping fast code doesn't mean users experience it fast.*

[← Chapter 8: The API Key in DevTools](ch08-auth-security.md) | [Chapter 10: Dashboard Breaks on Mobile →](ch10-responsive.md)

---

## The Incident

Pixel runs a Lighthouse audit on the production dashboard. She shares the screenshot in Slack without comment. Just the numbers.

> **Performance: 23**
> LCP: 4.2s | FID: 380ms | CLS: 0.42

> **@Pixel:** This is embarrassing. The marketing site scores 94. Our dashboard scores 23. Users on slower connections wait 6+ seconds to see anything.

You open Lighthouse yourself. The diagnostics are brutal:

- **Largest Contentful Paint (4.2s):** The job list table doesn't render until the entire JS bundle loads and the API responds.
- **First Input Delay (380ms):** The main thread is blocked parsing a 1.8MB JavaScript bundle.
- **Cumulative Layout Shift (0.42):** The metrics cards pop in after the data loads, pushing the job list down.

## The Problems

### Problem 1: No Code Splitting

Every route is in one bundle. Visit `/jobs` and you download the code for `/metrics`, `/submit`, `/settings`, the chart library, the date picker, everything.

```tsx
// ❌ All routes loaded upfront
import JobListPage from './features/jobs/JobListPage';
import JobDetailPage from './features/jobs/JobDetailPage';
import MetricsPage from './features/metrics/MetricsPage';
import SubmitJobPage from './features/submit/SubmitJobPage';
import SettingsPage from './features/settings/SettingsPage';

function Router() {
  return (
    <Routes>
      <Route path="/jobs" element={<JobListPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/metrics" element={<MetricsPage />} />
      <Route path="/submit" element={<SubmitJobPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
```

Bundle analysis shows: the chart library for the metrics page is 340KB. The date picker for the submit form is 120KB. Users on the job list page download both. For nothing.

### Problem 2: Unoptimized Images

The company logo in the header is a 2.4MB PNG. The user avatars are 500×500 JPEGs rendered at 32×32.

### Problem 3: Layout Shift

The metrics cards have no fixed height. When data loads, they pop into existence and push everything below them down by 96px.

## Fix 1: Lazy Routes — Load Code on Demand

```tsx
// ✅ Each route is a separate chunk, loaded on navigation
import { lazy, Suspense } from 'react';

const JobListPage = lazy(() => import('./features/jobs/JobListPage'));
const JobDetailPage = lazy(() => import('./features/jobs/JobDetailPage'));
const MetricsPage = lazy(() => import('./features/metrics/MetricsPage'));
const SubmitJobPage = lazy(() => import('./features/submit/SubmitJobPage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));

function Router() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/jobs" element={<JobListPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/metrics" element={<MetricsPage />} />
        <Route path="/submit" element={<SubmitJobPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}
```

Now Vite splits each route into its own chunk. Visit `/jobs` → download only the job list code. Navigate to `/metrics` → download the metrics chunk (with the chart library) on demand.

### Prefetch on Hover

Don't wait for the click. Start loading when the user hovers over the nav link:

```tsx
// src/components/NavLink.tsx
import { Link } from 'react-router-dom';

const routeLoaders: Record<string, () => Promise<unknown>> = {
  '/jobs': () => import('./features/jobs/JobListPage'),
  '/metrics': () => import('./features/metrics/MetricsPage'),
  '/submit': () => import('./features/submit/SubmitJobPage'),
};

export function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const prefetch = () => {
    const loader = routeLoaders[to];
    if (loader) loader(); // Vite caches the import — second call is instant
  };

  return (
    <Link to={to} onMouseEnter={prefetch} className="px-3 py-2 hover:bg-gray-100 rounded">
      {children}
    </Link>
  );
}
```

## Fix 2: Dynamic Import for Heavy Components

The metrics page has a chart that uses recharts (340KB). Don't load it until the user actually visits metrics:

```tsx
// src/features/metrics/MetricsPage.tsx
import { lazy, Suspense } from 'react';
import { useMetrics } from './useMetrics';
import { MetricsCards } from './MetricsCards';

const JobTrendChart = lazy(() => import('./JobTrendChart'));

export default function MetricsPage() {
  const { data: metrics, isLoading } = useMetrics();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Metrics</h1>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : (
        <MetricsCards metrics={metrics!} />
      )}

      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-gray-100" />}>
        <JobTrendChart />
      </Suspense>
    </div>
  );
}
```

## Fix 3: Fix Layout Shift — Reserve Space

```tsx
// ✅ Reserve space for metrics cards before data loads
function MetricsCards({ metrics }: { metrics?: JobMetrics }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {['Submitted', 'Completed', 'Failed', 'Active'].map((label, i) => (
        <div key={label} className="h-24 rounded-lg bg-white border p-4">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-bold mt-1">
            {metrics
              ? [metrics.submitted, metrics.completed, metrics.failed, metrics.activeJobs][i]
              : <span className="inline-block w-16 h-8 animate-pulse bg-gray-100 rounded" />
            }
          </p>
        </div>
      ))}
    </div>
  );
}
```

The cards are always 96px tall. Data or no data. No layout shift.

## Fix 4: Image Optimization

```tsx
// ❌ 2.4MB PNG, blocks LCP
<img src="/logo.png" />

// ✅ Modern formats, responsive sizes, explicit dimensions
<img
  src="/logo.webp"
  srcSet="/logo-200.webp 200w, /logo-400.webp 400w"
  sizes="200px"
  width={200}
  height={40}
  alt="Job Engine Dashboard"
  loading="eager"  // above the fold — load immediately
/>

// User avatars — lazy load, small size
<img
  src={`/avatars/${userId}.webp`}
  width={32}
  height={32}
  alt=""
  loading="lazy"   // below the fold — load when visible
  className="rounded-full"
/>
```

## Fix 5: Font Loading

```css
/* ✅ Prevent FOIT (Flash of Invisible Text) */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-display: swap; /* show fallback font immediately, swap when loaded */
}
```

```html
<!-- Preload the font file -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin />
```

## Core Web Vitals — What They Mean

| Metric | What It Measures | Good | Our Before | Our After |
|--------|-----------------|------|-----------|----------|
| LCP | Time until largest visible element renders | < 2.5s | 4.2s | 1.1s |
| FID / INP | Time until page responds to first interaction | < 100ms | 380ms | 45ms |
| CLS | How much the layout shifts during load | < 0.1 | 0.42 | 0.02 |

## The Bundle Analysis

```bash
npx vite-bundle-visualizer
```

Before:
```
main.js          1.8 MB (one chunk)
```

After:
```
main.js           180 KB (shell + shared)
jobs.chunk.js     45 KB  (job list page)
metrics.chunk.js  385 KB (metrics + recharts — loaded on demand)
submit.chunk.js   62 KB  (submit form + date picker)
settings.chunk.js 28 KB  (settings page)
```

Initial load: 180KB instead of 1.8MB. 90% reduction.

## The Result

| Metric | Before | After |
|--------|--------|-------|
| Lighthouse Performance | 23 | 91 |
| LCP | 4.2s | 1.1s |
| FID | 380ms | 45ms |
| CLS | 0.42 | 0.02 |
| Initial bundle | 1.8 MB | 180 KB |
| Time to interactive | 5.1s | 1.3s |

FiveNines runs the audit. "91. Not bad."

Pixel nods. "The numbers are better. But have you tried the dashboard on your phone?"

> **@TicketMaster:** 40% of our users access the dashboard on mobile. It's completely unusable. The table doesn't fit. The sidebar covers everything. I can't tap the cancel button — it's 12 pixels wide.

---

[← Chapter 8: The API Key in DevTools](ch08-auth-security.md) | [Chapter 10: Dashboard Breaks on Mobile →](ch10-responsive.md)
