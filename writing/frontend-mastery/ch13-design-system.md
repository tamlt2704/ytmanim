# Chapter 13: Pixel Says the Status Badges Are Inconsistent

*In which you learn that copy-paste is not a component library, and design tokens are the contract between design and code.*

[← Chapter 12: A Deploy Breaks Everything](ch12-testing-ci.md) | [Chapter 14: The 20-Minute Build →](ch14-monorepo.md)

---

## The Incident

Pixel has been auditing the dashboard. She opens a spreadsheet. It has screenshots.

> **@Pixel:** I found 4 different implementations of the job status badge across the app.

| Location | Border radius | Font size | Colors | Component |
|----------|--------------|-----------|--------|-----------|
| Job list | 6px | 12px | `bg-red-100 text-red-700` | `JobStatusBadge.tsx` |
| Job detail | 4px | 14px | `bg-red-500 text-white` | inline JSX |
| Metrics tooltip | 8px | 11px | `bg-red-200 text-red-800` | `StatusDot.tsx` |
| Notification dropdown | 0px (square) | 13px | `bg-red-100 text-red-600` | `NotifBadge.tsx` |

> **@Pixel:** Four components. Four different reds. Four different border radii. The FAILED badge is a different shade of red depending on where you look. This is not a design system. This is chaos.

She's right. Every time someone needed a status badge, they built a new one. Copy-paste with slight modifications. No shared source of truth.

## The Problem — Copy-Paste Components

```tsx
// In JobListPage.tsx
<span className="px-2 py-1 rounded-md text-xs bg-red-100 text-red-700">Failed</span>

// In JobDetailPage.tsx (different dev, different day)
<span className="px-3 py-1 rounded text-sm bg-red-500 text-white">FAILED</span>

// In MetricsTooltip.tsx (yet another dev)
<div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] bg-red-200 text-red-800">
  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
  Failed
</div>
```

Three devs, three interpretations of "red badge that says failed." None of them wrong individually. All of them wrong together.

## Fix 1: Design Tokens — The Single Source of Truth

Design tokens are named values that represent design decisions. Not `bg-red-100` — that's an implementation detail. `status-failed-bg` — that's a decision.

```typescript
// src/design-system/tokens.ts

export const colors = {
  // Status colors — used by ALL status-related components
  status: {
    pending:   { bg: 'bg-gray-100',   text: 'text-gray-700',   dot: 'bg-gray-400' },
    running:   { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500' },
    completed: { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
    failed:    { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
    cancelled: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    timedOut:  { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  },

  // Priority colors
  priority: {
    low:      { bg: 'bg-gray-100',   text: 'text-gray-600' },
    normal:   { bg: 'bg-blue-50',    text: 'text-blue-600' },
    high:     { bg: 'bg-orange-100', text: 'text-orange-700' },
    critical: { bg: 'bg-red-100',    text: 'text-red-700' },
  },
} as const;

export const spacing = {
  badge: { px: 'px-2', py: 'py-1' },
  card:  { p: 'p-4' },
  section: { gap: 'gap-4' },
} as const;

export const radii = {
  badge: 'rounded-md',
  card: 'rounded-lg',
  button: 'rounded-md',
} as const;

export const typography = {
  badge: 'text-xs font-medium',
  heading: 'text-2xl font-bold',
  label: 'text-sm font-medium text-gray-700',
  mono: 'font-mono text-sm',
} as const;
```

Now there's one place that defines what "failed" looks like. Change it here, it changes everywhere.

## Fix 2: The Component Library

### Badge — The Universal Badge Component

```tsx
// src/design-system/Badge.tsx
import { type ReactNode } from 'react';
import { radii, typography } from './tokens';

interface BadgeProps {
  children: ReactNode;
  bg: string;
  text: string;
  dot?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, bg, text, dot, size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        ${size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1'}
        ${radii.badge} ${typography.badge}
        ${bg} ${text}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {children}
    </span>
  );
}
```

### JobStatusBadge — Built on Badge + Tokens

```tsx
// src/design-system/JobStatusBadge.tsx
import { Badge } from './Badge';
import { colors } from './tokens';
import type { JobStatus } from '../types/api';

const statusLabels: Record<JobStatus, string> = {
  PENDING: 'Pending',
  RUNNING: 'Running',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled',
  TIMED_OUT: 'Timed Out',
};

const statusKeys: Record<JobStatus, keyof typeof colors.status> = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  TIMED_OUT: 'timedOut',
};

export function JobStatusBadge({ status, showDot = false }: { status: JobStatus; showDot?: boolean }) {
  const colorSet = colors.status[statusKeys[status]];

  return (
    <Badge bg={colorSet.bg} text={colorSet.text} dot={showDot ? colorSet.dot : undefined}>
      {statusLabels[status]}
    </Badge>
  );
}
```

One component. Used everywhere. Same colors, same radius, same font size. Pixel can sleep.

### JobPriorityBadge

```tsx
// src/design-system/JobPriorityBadge.tsx
import { Badge } from './Badge';
import { colors } from './tokens';
import type { JobPriority } from '../types/api';

const priorityKeys: Record<JobPriority, keyof typeof colors.priority> = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export function JobPriorityBadge({ priority }: { priority: JobPriority }) {
  const colorSet = colors.priority[priorityKeys[priority]];

  return (
    <Badge bg={colorSet.bg} text={colorSet.text}>
      {priority}
    </Badge>
  );
}
```

### Button

```tsx
// src/design-system/Button.tsx
import { type ButtonHTMLAttributes } from 'react';
import { radii } from './tokens';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
  secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({ variant = 'primary', loading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 ${radii.button} text-sm font-medium
        min-h-[44px]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${variantStyles[variant]}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
```

## Fix 3: Storybook — Visual Documentation

```bash
npx storybook@latest init
```

### JobStatusBadge Story — All Variants

```tsx
// src/design-system/__stories__/JobStatusBadge.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { JobStatusBadge } from '../JobStatusBadge';

const meta: Meta<typeof JobStatusBadge> = {
  title: 'Components/JobStatusBadge',
  component: JobStatusBadge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof JobStatusBadge>;

export const Pending: Story = { args: { status: 'PENDING' } };
export const Running: Story = { args: { status: 'RUNNING' } };
export const Completed: Story = { args: { status: 'COMPLETED' } };
export const Failed: Story = { args: { status: 'FAILED' } };
export const Cancelled: Story = { args: { status: 'CANCELLED' } };
export const TimedOut: Story = { args: { status: 'TIMED_OUT' } };

export const WithDot: Story = {
  args: { status: 'RUNNING', showDot: true },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT'] as const).map(
        status => <JobStatusBadge key={status} status={status} showDot />
      )}
    </div>
  ),
};
```

### Button Story

```tsx
// src/design-system/__stories__/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: 'Submit Job' } };
export const Secondary: Story = { args: { children: 'Clear', variant: 'secondary' } };
export const Danger: Story = { args: { children: 'Cancel Job', variant: 'danger' } };
export const Loading: Story = { args: { children: 'Submitting...', loading: true } };
export const Disabled: Story = { args: { children: 'Submit Job', disabled: true } };
```

Now Pixel can open Storybook, see every component variant, and verify they match the design. No more "is this the right red?" conversations.

## The Design System Structure

```
src/design-system/
├── tokens.ts              ← colors, spacing, typography, radii
├── Badge.tsx              ← base badge component
├── Button.tsx             ← button with variants
├── Card.tsx               ← card container
├── JobStatusBadge.tsx     ← status-specific badge
├── JobPriorityBadge.tsx   ← priority-specific badge
├── index.ts               ← barrel export
└── __stories__/
    ├── JobStatusBadge.stories.tsx
    ├── JobPriorityBadge.stories.tsx
    └── Button.stories.tsx
```

```typescript
// src/design-system/index.ts
export { Badge } from './Badge';
export { Button } from './Button';
export { JobStatusBadge } from './JobStatusBadge';
export { JobPriorityBadge } from './JobPriorityBadge';
export { colors, spacing, radii, typography } from './tokens';
```

## The Result

| Before | After |
|--------|-------|
| 4 status badge implementations | 1 |
| 4 different reds for FAILED | 1 (from tokens) |
| No visual documentation | Storybook with all variants |
| "Is this the right color?" in Slack | Open Storybook and check |
| Copy-paste components | Import from design system |

Pixel opens Storybook. Clicks through every badge variant. Checks the colors against her Figma file. Measures the border radius.

"6px. Correct." She pauses. "The font weight on the priority badge is 500. Figma says 600." She files a ticket.

Linus has a different concern. "The job engine backend is in a separate repo. The `Job` type is defined in Java AND in our TypeScript types. They're already drifting apart — the backend added a `tags` field last week and nobody updated the frontend types. We need to fix this."

---

[← Chapter 12: A Deploy Breaks Everything](ch12-testing-ci.md) | [Chapter 14: The 20-Minute Build →](ch14-monorepo.md)
