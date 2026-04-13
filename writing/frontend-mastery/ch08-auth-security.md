# Chapter 8: The API Key Visible in DevTools

*In which you learn that the browser is a hostile environment, and anything in JavaScript is public.*

[← Chapter 7: Stale Cache After Cancel](ch07-caching.md) | [Chapter 9: Lighthouse Score 23 →](ch09-performance.md)

---

## The Incident

ZeroTrust doesn't file tickets. ZeroTrust sends you a screenshot at 11 PM.

> **@ZeroTrust:** Open DevTools. Network tab. Click any request. Look at the headers.

```
GET /api/jobs HTTP/1.1
Host: job-engine.internal.company.com
Authorization: Bearer sk_live_4eC39HqLyjWDarjtT1zdp7dc
X-API-Key: je_prod_a1b2c3d4e5f6
```

> **@ZeroTrust:** That API key is in your JavaScript bundle. I searched the source maps. It's in `api.ts`, line 3. Anyone with a browser can extract it and cancel every job in production from curl.

You check. He's right.

```typescript
// ❌ src/lib/api.ts — the crime scene
const API_KEY = 'je_prod_a1b2c3d4e5f6'; // hardcoded. in the bundle. shipped to every browser.

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY, // visible in every request
    },
    ...options,
  });
  return response.json();
}
```

## The Problems (There Are Four)

### Problem 1: Hardcoded API Key

The API key is a string literal in the source code. It's in the git history. It's in the production bundle. It's in the source maps. It's in every CDN edge cache. It's everywhere.

### Problem 2: No Real Authentication

The API key authenticates the *app*, not the *user*. Anyone with the key can cancel any job. There's no way to know who did it.

### Problem 3: XSS Vulnerability

Job names come from user input. They're rendered without sanitization:

```tsx
// ❌ If job.name contains <script>alert('xss')</script>, you have a problem
<td dangerouslySetInnerHTML={{ __html: job.name }} />
```

Even without `dangerouslySetInnerHTML`, if you're injecting job names into URLs or attributes without escaping, you're vulnerable.

### Problem 4: No CSRF Protection

The API accepts requests from any origin. A malicious page could submit jobs on behalf of a logged-in user.

## Fix 1: JWT Authentication Flow

Replace the API key with user-specific JWT tokens.

```tsx
// src/lib/auth.ts
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

let tokens: AuthTokens | null = null;

export async function login(username: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include', // sends httpOnly cookies
  });

  if (!response.ok) throw new Error('Login failed');

  tokens = await response.json();
}

export async function getAccessToken(): Promise<string> {
  if (!tokens) throw new Error('Not authenticated');

  // Refresh if expired (with 30s buffer)
  if (Date.now() > tokens.expiresAt - 30_000) {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    tokens = await response.json();
  }

  return tokens.accessToken;
}

export function logout(): void {
  tokens = null;
  fetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
  window.location.href = '/login';
}
```

### Updated API Client

```tsx
// src/lib/api.ts — no more hardcoded keys
import { getAccessToken, logout } from './auth';

const API_BASE = import.meta.env.VITE_API_URL;
// ↑ Environment variable, not a secret. Just the URL.

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    ...options,
  });

  if (response.status === 401) {
    logout();
    throw new Error('Session expired');
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

Now each request carries a short-lived JWT (15 min expiry) that identifies the *user*, not the app. The refresh token is in an httpOnly cookie — JavaScript can't read it, XSS can't steal it.

## Fix 2: Environment Variables (Not Secrets)

```bash
# .env.development
VITE_API_URL=http://localhost:8080

# .env.production
VITE_API_URL=https://job-engine.company.com
```

```bash
# .env.example — committed to git
VITE_API_URL=http://localhost:8080

# .env.local — NOT committed (in .gitignore)
VITE_API_URL=https://staging.job-engine.company.com
```

**Rule:** anything prefixed with `VITE_` ends up in the browser bundle. Never put secrets there. URLs are fine. API keys are not.

## Fix 3: Sanitize Job Names

React escapes JSX by default — `{job.name}` is safe. But watch out for these traps:

```tsx
// ✅ Safe — React escapes this automatically
<td>{job.name}</td>

// ❌ Dangerous — raw HTML injection
<td dangerouslySetInnerHTML={{ __html: job.name }} />

// ❌ Dangerous — job name in href
<a href={`/jobs/${job.name}`}>View</a>
// If job.name is "javascript:alert('xss')" — bad day

// ✅ Safe — use the ID, not user input, in URLs
<a href={`/jobs/${job.id}`}>View</a>

// ❌ Dangerous — job name in title attribute via template
document.title = `Job: ${job.name}`; // fine for title
// But if you're building HTML strings manually — don't.
```

If you absolutely need to render rich text from job descriptions, use a sanitizer:

```tsx
import DOMPurify from 'dompurify';

function JobDescription({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre'],
    ALLOWED_ATTR: [],
  });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

## Fix 4: The BFF Pattern

For maximum security, don't let the browser talk to the job engine directly. Put a Backend for Frontend (BFF) in between:

```
Browser → BFF (Node.js/Next.js) → Job Engine API
           ↑
           Handles auth, sessions,
           API keys, rate limiting
```

```typescript
// BFF: /api/jobs route (server-side)
app.get('/api/jobs', requireAuth, async (req, res) => {
  // The REAL API key lives here — on the server, never in the browser
  const jobs = await fetch('http://job-engine:8080/api/jobs', {
    headers: {
      'X-API-Key': process.env.JOB_ENGINE_API_KEY, // server-only secret
      'X-User-Id': req.user.id,
    },
  });
  res.json(await jobs.json());
});
```

The browser never sees the job engine API key. The BFF handles authentication, authorization, and rate limiting. The job engine only accepts requests from the BFF's IP.

## The Security Checklist

| Threat | Fix | Status |
|--------|-----|--------|
| API key in bundle | JWT auth + BFF pattern | ✅ |
| XSS via job names | React auto-escaping + DOMPurify for rich text | ✅ |
| Session hijacking | httpOnly cookies, short-lived JWTs | ✅ |
| CSRF | SameSite cookies, CSRF tokens | ✅ |
| Secrets in git | `.env.local` in `.gitignore`, env vars in CI | ✅ |
| Source maps in production | Disable or upload to error tracking only | ✅ |

## The Result

ZeroTrust runs his checks again.

- DevTools Network tab: Bearer token, no API key. ✅
- Source maps: disabled in production. ✅
- XSS test with `<img onerror>` in job name: escaped. ✅
- curl with stolen token after 15 minutes: 401 Unauthorized. ✅

"Acceptable," he says. That's the highest praise ZeroTrust gives.

Pixel walks over with a Lighthouse report. "Have you seen this? Performance score: 23. LCP is 4.2 seconds. This is embarrassing."

---

[← Chapter 7: Stale Cache After Cancel](ch07-caching.md) | [Chapter 9: Lighthouse Score 23 →](ch09-performance.md)
