# Chapter 12: A Deploy Breaks the Job Submission Form

*In which you learn that "it works on my machine" is not a deployment strategy, and tests are cheaper than incidents.*

[← Chapter 11: Real-Time Updates](ch11-realtime.md) | [Chapter 13: Inconsistent Status Badges →](ch13-design-system.md)

---

## The Incident

The submit job form has been broken for 2 hours. Nobody noticed because nobody tested it. The PR that broke it changed the form validation logic — a one-line change that made `priority` always fail validation.

> **@Linus:** We need tests. We need CI. We need a gate that prevents broken code from reaching production. This is the last time a deploy breaks something silently.

You nod. You've been meaning to add tests. For three months.

## The Testing Stack

```bash
# Unit + component tests
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# E2E tests
npm install -D @playwright/test
npx playwright install
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
```

## Layer 1: Unit Tests — Pure Logic

Test the things that don't need React. Utility functions, formatters, validators.

```typescript
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatJobDuration, getStatusColor, isJobCancellable } from '../utils';

describe('formatJobDuration', () => {
  it('formats milliseconds into human-readable duration', () => {
    expect(formatJobDuration(500)).toBe('500ms');
    expect(formatJobDuration(2500)).toBe('2.5s');
    expect(formatJobDuration(65000)).toBe('1m 5s');
    expect(formatJobDuration(3661000)).toBe('1h 1m');
  });

  it('returns "—" for null/undefined', () => {
    expect(formatJobDuration(null)).toBe('—');
    expect(formatJobDuration(undefined)).toBe('—');
  });
});

describe('getStatusColor', () => {
  it('returns correct Tailwind classes for each status', () => {
    expect(getStatusColor('RUNNING')).toContain('blue');
    expect(getStatusColor('COMPLETED')).toContain('green');
    expect(getStatusColor('FAILED')).toContain('red');
    expect(getStatusColor('PENDING')).toContain('gray');
    expect(getStatusColor('CANCELLED')).toContain('yellow');
  });
});

describe('isJobCancellable', () => {
  it('returns true for PENDING and RUNNING jobs', () => {
    expect(isJobCancellable('PENDING')).toBe(true);
    expect(isJobCancellable('RUNNING')).toBe(true);
  });

  it('returns false for terminal states', () => {
    expect(isJobCancellable('COMPLETED')).toBe(false);
    expect(isJobCancellable('FAILED')).toBe(false);
    expect(isJobCancellable('CANCELLED')).toBe(false);
  });
});
```

## Layer 2: Component Tests — React Components in Isolation

Test components with React Testing Library. Render them, interact with them, assert on what the user sees.

### JobStatusBadge

```tsx
// src/features/jobs/__tests__/JobStatusBadge.test.tsx
import { render, screen } from '@testing-library/react';
import { JobStatusBadge } from '../JobStatusBadge';

describe('JobStatusBadge', () => {
  it('renders the correct label for each status', () => {
    const statuses = ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'] as const;

    statuses.forEach(status => {
      const { unmount } = render(<JobStatusBadge status={status} />);
      expect(screen.getByText(status.charAt(0) + status.slice(1).toLowerCase())).toBeInTheDocument();
      unmount();
    });
  });

  it('applies the correct color class for FAILED', () => {
    render(<JobStatusBadge status="FAILED" />);
    const badge = screen.getByText('Failed');
    expect(badge.className).toContain('red');
  });
});
```

### SubmitJobForm — The One That Broke

```tsx
// src/features/submit/__tests__/SubmitJobForm.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SubmitJobForm } from '../SubmitJobForm';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe('SubmitJobForm', () => {
  it('renders all form fields', () => {
    renderWithProviders(<SubmitJobForm />);

    expect(screen.getByLabelText(/job name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('disables submit when name is empty', () => {
    renderWithProviders(<SubmitJobForm />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit when name is filled', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubmitJobForm />);

    await user.type(screen.getByLabelText(/job name/i), 'send-email');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeEnabled();
  });

  it('allows selecting all priority levels', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubmitJobForm />);

    const select = screen.getByLabelText(/priority/i);
    await user.selectOptions(select, 'HIGH');
    expect(select).toHaveValue('HIGH');

    await user.selectOptions(select, 'CRITICAL');
    expect(select).toHaveValue('CRITICAL');
  });

  it('shows clear button only when form is dirty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SubmitJobForm />);

    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();

    await user.type(screen.getByLabelText(/job name/i), 'test');

    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });
});
```

This test would have caught the bug. The priority validation change would have failed the "allows selecting all priority levels" test.

### JobRow

```tsx
// src/features/jobs/__tests__/JobRow.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobRow } from '../JobRow';

const mockJob = {
  id: 'job-42',
  name: 'send-email',
  priority: 'HIGH' as const,
  status: 'RUNNING' as const,
  submittedAt: '2025-03-15T10:30:00Z',
  startedAt: '2025-03-15T10:30:01Z',
  completedAt: null,
  failureReason: null,
  dependsOn: [],
};

describe('JobRow', () => {
  it('displays job information', () => {
    render(<JobRow job={mockJob} />);

    expect(screen.getByText('job-42')).toBeInTheDocument();
    expect(screen.getByText('send-email')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('shows cancel button for running jobs', () => {
    render(<JobRow job={mockJob} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('hides cancel button for completed jobs', () => {
    render(<JobRow job={{ ...mockJob, status: 'COMPLETED' }} />);
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });
});
```

## Layer 3: E2E Tests — The Full Flow

Playwright tests run in a real browser against the running app.

```typescript
// e2e/submit-job.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Submit Job Flow', () => {
  test('submits a job and sees it in the list', async ({ page }) => {
    await page.goto('/submit');

    // Fill out the form
    await page.getByLabel(/job name/i).fill('e2e-test-job');
    await page.getByLabel(/priority/i).selectOption('HIGH');

    // Submit
    await page.getByRole('button', { name: /submit/i }).click();

    // Should navigate to job list or show success
    await expect(page.getByText('e2e-test-job')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
  });

  test('cancel button works for running jobs', async ({ page }) => {
    await page.goto('/jobs');

    // Find a running job and cancel it
    const runningRow = page.locator('tr', { hasText: 'Running' }).first();
    await runningRow.getByRole('button', { name: /cancel/i }).click();

    // Status should update
    await expect(runningRow.getByText('Cancelled')).toBeVisible({ timeout: 5000 });
  });

  test('dashboard shows metrics and recent jobs', async ({ page }) => {
    await page.goto('/');

    // Metrics cards should be visible
    await expect(page.getByText('Submitted')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();
    await expect(page.getByText('Failed')).toBeVisible();
    await expect(page.getByText('Active')).toBeVisible();

    // Job list should have items
    const jobRows = page.locator('[data-testid="job-row"]');
    await expect(jobRows.first()).toBeVisible();
  });
});
```

## Layer 4: GitHub Actions CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Unit + Component tests
        run: npx vitest run --coverage

      - name: Build
        run: npm run build

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: E2E tests
        run: npx playwright test
        env:
          VITE_API_URL: http://localhost:8080

      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
```

Now every PR runs: type check → lint → unit tests → component tests → build → E2E tests. If any step fails, the PR can't merge.

## The Testing Pyramid for the Job Dashboard

```
        ╱╲
       ╱ E2E ╲         3-5 tests: critical user flows
      ╱────────╲        (submit job, cancel job, view dashboard)
     ╱Component ╲       15-20 tests: UI components with interactions
    ╱────────────╲      (SubmitJobForm, JobRow, MetricsCards)
   ╱    Unit      ╲     30+ tests: pure functions, utils, formatters
  ╱────────────────╲    (formatDuration, getStatusColor, validators)
```

Unit tests are fast and cheap. E2E tests are slow and expensive. Write more of the cheap ones.

## The Result

The one-line validation bug? The component test for `SubmitJobForm` catches it. The PR fails CI. The author fixes it before merge. Nobody files a ticket. Nobody notices. That's the point.

| Before | After |
|--------|-------|
| No tests | 50+ tests across 3 layers |
| No CI | GitHub Actions on every PR |
| Broken form for 2 hours | Caught before merge |
| Manual deploys | Automated build + test + deploy |
| "It works on my machine" | "It works in CI" |

Linus reviews the CI setup. "Good. Now I can sleep."

Pixel walks over. She's been looking at the dashboard across different pages. "Why are there 4 different implementations of the status badge? The one on the job list has rounded corners. The one on the detail page is square. The one in the metrics tooltip uses different colors. And the one in the notification dropdown is a completely different component."

---

[← Chapter 11: Real-Time Updates](ch11-realtime.md) | [Chapter 13: Inconsistent Status Badges →](ch13-design-system.md)
