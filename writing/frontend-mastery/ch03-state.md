# Chapter 3: The Job Form That Loses Your Data

*In which you learn that component state dies when the component unmounts, and your users are not happy about it.*

[← Chapter 2: 300 Re-renders](ch02-rendering.md) | [Chapter 4: The Spinner That Won't Stop →](ch04-data-fetching.md)

---

## The Incident

TicketMaster pings you at 9:47 AM:

> **@TicketMaster:** Three tickets this morning. Users fill out the "submit job" form — name, priority, dependencies — then switch to the job list tab to check something. When they come back, the form is empty. They have to start over. One user lost a complex job config with 8 dependencies.

You open the submit job page. Fill in the form. Click "Jobs" in the sidebar. Click "Submit" again.

Empty form. Every field reset.

## Why This Happens

The `SubmitJobForm` component holds its state in `useState`. When you navigate away, React unmounts the component. When you navigate back, React mounts a *new* instance. Fresh state. Empty fields.

```tsx
// ❌ State lives in the component — dies when it unmounts
function SubmitJobForm() {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<JobPriority>('NORMAL');
  const [dependsOn, setDependsOn] = useState<string[]>([]);

  // User fills this out, navigates away, comes back — gone.
  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <select value={priority} onChange={e => setPriority(e.target.value as JobPriority)}>
        <option value="LOW">Low</option>
        <option value="NORMAL">Normal</option>
        <option value="HIGH">High</option>
        <option value="CRITICAL">Critical</option>
      </select>
      {/* ... dependency picker ... */}
    </form>
  );
}
```

This is React's contract: component unmounts → state is gone. It's not a bug. It's a feature you need to work around.

## The Fix — Zustand Store for Form Draft State

Move the form state out of the component and into a store that lives for the lifetime of the app.

```bash
npm install zustand
```

### Step 1: The Store

```typescript
// src/features/submit/useJobFormStore.ts
import { create } from 'zustand';
import type { JobPriority } from '../../types/api';

interface JobFormDraft {
  name: string;
  priority: JobPriority;
  dependsOn: string[];
  description: string;
}

interface JobFormStore {
  draft: JobFormDraft;
  setField: <K extends keyof JobFormDraft>(key: K, value: JobFormDraft[K]) => void;
  reset: () => void;
  isDirty: () => boolean;
}

const initialDraft: JobFormDraft = {
  name: '',
  priority: 'NORMAL',
  dependsOn: [],
  description: '',
};

export const useJobFormStore = create<JobFormStore>((set, get) => ({
  draft: { ...initialDraft },

  setField: (key, value) =>
    set(state => ({
      draft: { ...state.draft, [key]: value },
    })),

  reset: () => set({ draft: { ...initialDraft } }),

  isDirty: () => {
    const { draft } = get();
    return (
      draft.name !== '' ||
      draft.priority !== 'NORMAL' ||
      draft.dependsOn.length > 0 ||
      draft.description !== ''
    );
  },
}));
```

The store exists outside React's component tree. Navigate away, navigate back — the draft is still there.

### Step 2: The Form Component

```tsx
// src/features/submit/SubmitJobForm.tsx
import { useJobFormStore } from './useJobFormStore';
import { useSubmitJob } from './useSubmitJob';
import type { JobPriority } from '../../types/api';

const priorities: JobPriority[] = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'];

export function SubmitJobForm() {
  const { draft, setField, reset, isDirty } = useJobFormStore();
  const submitJob = useSubmitJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitJob.mutateAsync({
      name: draft.name,
      priority: draft.priority,
      dependsOn: draft.dependsOn,
    });
    reset(); // only clear after successful submit
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Job Name
        </label>
        <input
          type="text"
          value={draft.name}
          onChange={e => setField('name', e.target.value)}
          placeholder="send-email, generate-report, cleanup..."
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          value={draft.priority}
          onChange={e => setField('priority', e.target.value as JobPriority)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        >
          {priorities.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={draft.description}
          onChange={e => setField('description', e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!draft.name || submitJob.isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitJob.isPending ? 'Submitting...' : 'Submit Job'}
        </button>
        {isDirty() && (
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
```

Now: fill out the form, navigate to the job list, come back. Everything's still there.

### Step 3: Unsaved Changes Warning

Bonus — warn users before they close the tab with a half-filled form:

```tsx
// src/features/submit/useWarnUnsaved.ts
import { useEffect } from 'react';
import { useJobFormStore } from './useJobFormStore';

export function useWarnUnsaved() {
  const isDirty = useJobFormStore(state => state.isDirty);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty()) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}
```

## When to Use Local State vs Global State

This is the question every React dev gets wrong at least once. Here's the rule:

| State Type | Where | Examples |
|-----------|-------|---------|
| UI-only, single component | `useState` | Dropdown open/closed, tooltip visible, input focus |
| UI-only, parent + children | `useState` + props | Accordion expanded index, modal open state |
| Cross-page data | Zustand / Context | Form drafts, user preferences, sidebar collapsed |
| Server data | TanStack Query | Job list, metrics, user profile |
| URL-driven state | URL params | Current page, search query, filters, sort order |

The mistake: putting everything in a global store. Suddenly your Zustand store has `isDropdownOpen` and `tooltipText` and `modalStep` alongside actual business data. That's a mess.

The other mistake: putting everything in `useState`. That's how you get the form-that-loses-data bug.

**The rule:** if the state needs to survive a navigation, it doesn't belong in `useState`.

## What About Context?

React Context works for global state, but it has a re-render problem: every component that consumes a context re-renders when *any* value in that context changes. Zustand gives you selector-based subscriptions — components only re-render when the specific slice they use changes.

```tsx
// Context: ALL consumers re-render when ANY field changes
const FormContext = createContext<JobFormDraft>(initialDraft);

// Zustand: only re-renders when `name` changes
const name = useJobFormStore(state => state.draft.name);
```

For a form with 5 fields, Context means 5 re-renders per keystroke (one per field). Zustand means 1.

## The Result

| Before | After |
|--------|-------|
| Form resets on navigation | Form persists across pages |
| Users lose complex job configs | Draft survives until submit |
| No unsaved changes warning | Browser warns before tab close |
| 3 tickets/morning about lost data | 0 |

TicketMaster closes the tickets. "Finally. But now users are complaining about something else — the dashboard shows a loading spinner every time they switch pages. Even for data they just saw."

---

[← Chapter 2: 300 Re-renders](ch02-rendering.md) | [Chapter 4: The Spinner That Won't Stop →](ch04-data-fetching.md)
