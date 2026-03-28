# Germany Migrant/Student Guide

Multilingual web app helping migrants and international students navigate German bureaucracy — visa guides, document tracking, deadline management, email notifications, and PDF export.

- **Stack:** Next.js 16 (App Router), TypeScript, TailwindCSS, Supabase (Postgres + Auth), Stripe, Resend, PostHog, Vercel
- **Live:** https://my-germany-guide.vercel.app
- **GitHub:** https://github.com/MontherAlnimri/germany-guide
- **Path alias:** `@/*` maps to `./src/*`
- **TypeScript strict mode:** OFF (`strict: false` in tsconfig)

---

## Critical Rules

These rules exist because breaking them has caused real bugs. Read before touching any code.

### 1. Dictionary access MUST use optional chaining
```tsx
{dict?.section?.key ?? "Fallback"}     // CORRECT
{dict.section.key}                      // WRONG — crashes if dict not loaded yet
```
Non-English dictionaries may have missing keys. The `deepMerge` fallback catches most, but optional chaining is the safety net.

### 2. Badge variants are: `success | warning | danger | info | neutral`
There is NO `"default"` or `"secondary"` variant. Using them causes TypeScript errors and renders no styles.

### 3. Verify `en.ts` is non-empty after any dictionary operation
The file has ~1300 lines when healthy. It was previously wiped to 0 bytes by a PowerShell string replacement. After any edit to dictionary files, verify: `(Get-Item src/lib/i18n/dictionaries/en.ts).Length` should be > 40000.

### 4. Never use PowerShell `.Replace()` on dictionary files
Key names like `limitReachedDesc`, `feature1Title`, `ctaButton` appear in multiple sections. `.Replace()` hits the wrong section. Use section-aware insertion or full section rewrites instead.

### 5. Three Supabase clients — never mix them
| Client | File | Usage | Key Detail |
|--------|------|-------|------------|
| Browser | `@/lib/supabase/client` | `"use client"` components | Sync: `const supabase = createClient()` |
| Server | `@/lib/supabase/server` | Server Components, Route Handlers | **ASYNC:** `const supabase = await createClient()` |
| Admin | `@/lib/supabase/admin` | Webhooks, admin operations | Exports `createAdminClient` (NOT `createClient`) |

### 6. i18n imports must use full path
```tsx
import { useDict } from "@/lib/i18n/context";    // CORRECT
import { useDict } from "@/lib/i18n";             // WRONG — causes build errors
```

---

## Import Reference

### Default exports (use `import X from`)
```tsx
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import I18nClientProvider from "@/components/i18n/I18nClientProvider";
import LegalFooter from "@/components/layout/LegalFooter";
import PostHogProvider from "@/components/analytics/PostHogProvider";
import AuthCodeHandler from "@/components/AuthCodeHandler";
import EmailVerificationBanner from "@/components/EmailVerificationBanner";
import StructuredData from "@/components/StructuredData";
```

### Named exports (use `import { X } from`)
```tsx
import { FeaturedGuides, FAQSection } from "@/components/FeaturedGuidesAndFAQ";
import { Skeleton, SkeletonText, SkeletonCard } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";  // All ui/ components are named
```

### Analytics
```tsx
import { trackEvent, identifyUser, resetAnalytics } from "@/lib/analytics";            // Client-side
import { trackStepCompleted, trackFlowStarted, trackFlowCompleted, trackDocumentAdded, trackDeadlineAdded, trackPdfExported } from "@/lib/analytics-events"; // Domain helpers
import { trackServerEvent } from "@/lib/analytics-server";                               // Server-side (HTTP POST)
import { useAnalytics } from "@/hooks/useAnalytics";                                     // React hook
```

### Stripe & Resend (Proxy lazy-init pattern)
```tsx
import { stripe } from "@/lib/stripe/server";        // Proxy — lazy init on first access
import { PLANS, FREE_LIMITS } from "@/lib/stripe/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";  // Proxy — lazy init on first access
import { welcomeEmail, deadlineReminderEmail, visaExpiryEmail, flowCompletionEmail } from "@/lib/email/templates";
```

---

## Architecture

```
src/
  app/
    (auth)/            Login, register, forgot-password, reset-password
    (dashboard)/       Dashboard, flow, documents, deadlines, settings, premium, onboarding, admin, support
    (legal)/           Privacy, terms, about
    api/
      stripe/          checkout, portal, tip, webhook
      email/           welcome, flow-complete
      reminders/       Cron endpoint (visa expiry + deadline emails)
      auth/callback    OAuth code exchange
      og/              Dynamic OG image (edge runtime)
      account/delete   Account deletion (FK-ordered cascade)
      admin/           Admin stats (email whitelist: montheralnimri2003@gmail.com)
    auth/confirm       Email verification handler
    guides/            Public guide pages with [slug] dynamic route
  components/
    ui/                Badge, Button, Card, Input, Modal, ProgressBar, Select, Skeleton, LimitModal, UsageBar
    layout/            Navbar (fixed bottom on mobile), LegalFooter
    analytics/         PostHogProvider
    i18n/              I18nClientProvider, LanguageSwitcher
    auth/, flow/, documents/, deadlines/, onboarding/  — feature components
  hooks/               useUser, useProfile, useSubscription, useUsageLimits, useEmailVerified, useAnalytics
  lib/
    i18n/              config (11 locales), context (useDict, useLocale), getDictionary (deepMerge), dictionaries/
    supabase/          client.ts, server.ts (async), admin.ts (service role)
    stripe/            client.ts, server.ts (Proxy + PLANS + FREE_LIMITS), index.ts
    email/             resend.ts (Proxy), templates.ts (4 HTML templates), index.ts
    types/             database.ts (Profile, BaseFlow, FlowVariant, FlowStep, FlowInstance, StepSnapshot, Document, Deadline, Subscription, Tip)
    analytics.ts       Client-side trackEvent (type-safe), identifyUser, resetAnalytics
    analytics-events.ts  Domain helpers (trackStepCompleted, trackFlowStarted, etc.)
    analytics-server.ts  Server-side PostHog capture via HTTP POST
    constants.ts       VISA_TYPES, APPLICATION_TYPES, GERMAN_CITIES, DOCUMENT_TYPES, DOCUMENT_STATUSES
    utils.ts           cn(), formatDate, daysUntil, computeDocumentStatus, truncate, capitalize
    pdf-export.ts      jsPDF export (exportFlowToPDF, exportDocumentsToPDF)
middleware.ts          Auth protection — PUBLIC_ROUTES whitelist, static file bypasses
```

---

## Key Patterns

### Proxy Lazy Initialization (Stripe & Resend)
Both `stripe` and `resend` are ES6 Proxy objects. The actual client instance is created on first property access at runtime, not at import time. This prevents build failures when env vars aren't available during static page data collection.

### i18n System
- **11 locales:** en, de, ar (RTL), tr, uk, fr, es, ru, zh, hi, hu
- `getDictionary(locale)` deep-merges requested locale over English — missing keys fall back to English
- `en.ts` is the canonical schema — exports the `Dictionary` TypeScript interface (~400 keys across 23 sections)
- Non-English dicts cast `as unknown as Dictionary`
- `useDict()` and `useLocale()` hooks from `@/lib/i18n/context`
- RTL: `isRtl(locale)` / `getDirection(locale)` from `@/lib/i18n/config`
- Language persisted via `NEXT_LOCALE` cookie (no page reload on switch)

### Freemium Model
- `FREE_LIMITS = { maxFlows: 3, maxDocuments: 10 }` in `@/lib/stripe/server`
- `useUsageLimits()` returns `canStartFlow`, `canAddDoc` (true if premium/trialing OR under limit)
- `useSubscription()` returns `isPremium`, `isTrialing`, `trialDaysLeft`, `plan`, `status`
- Premium = `is_premium === true` OR active paid subscription OR active trial
- `LimitModal` shown when free user hits limit — prompts upgrade

### Analytics (Three Layers)
| Layer | File | Where | How |
|-------|------|-------|-----|
| Client | `analytics.ts` | React components | `trackEvent("name", props)` — checks `posthog.__loaded` |
| Server | `analytics-server.ts` | API routes/webhooks | `trackServerEvent(userId, "name", props)` — direct HTTP POST |
| Helpers | `analytics-events.ts` | Components | Typed wrappers like `trackStepCompleted(flow, step, order)` |

All client-side functions are SSR-safe (no-op if `window` undefined).

### Middleware Auth
- `PUBLIC_ROUTES` array in `middleware.ts` — routes that skip auth check
- Static/metadata routes bypassed by prefix matching
- Non-public routes: if no Supabase user session, redirect to `/login`

---

## Environment Variables

### Required
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (webhooks, account deletion) |
| `STRIPE_SECRET_KEY` | Stripe server-side secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client-side key |
| `STRIPE_MONTHLY_PRICE_ID` | Stripe price ID for monthly plan |
| `STRIPE_YEARLY_PRICE_ID` | Stripe price ID for yearly plan |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification |
| `RESEND_API_KEY` | Resend email service key |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `CRON_SECRET` | Protects `/api/reminders` endpoint |
| `NEXT_PUBLIC_APP_URL` | App base URL (e.g., `https://my-germany-guide.vercel.app`) |

### Optional
| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` | PostHog API endpoint |
| `EMAIL_FROM` | `Germany Guide <onboarding@resend.dev>` | Email sender address |
| `NEXT_PUBLIC_APP_NAME` | `Germany Guide` | App display name |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | `en` | Default language |

---

## Database Schema (Supabase)

All tables have RLS policies. Profiles auto-created via trigger on `auth.users` insert.

| Table | Key Columns | Notes |
|-------|-------------|-------|
| `profiles` | id, email, full_name, visa_type, first_vs_renewal, city, zip_code, visa_expiry_date, onboarding_complete, locale, is_premium, trial_ends_at | User profile + visa info |
| `base_flows` | id, title, description, icon, category | Flow templates |
| `flow_variants` | id, base_flow_id, visa_type, first_vs_renewal | Visa-specific variants |
| `flow_steps` | id, flow_variant_id, title, description, step_order, required_documents, useful_links, tips, is_optional | Steps within a variant |
| `flow_instances` | id, user_id, flow_variant_id, status, progress, step_snapshot | User's active flow |
| `documents` | id, user_id, doc_type, doc_name, issue_date, expiry_date, status, flow_instance_id, notes | Document vault |
| `deadlines` | id, user_id, title, description, due_date, remind_at, is_done | Reminders |
| `subscriptions` | id, user_id (UNIQUE), stripe_customer_id, stripe_subscription_id, plan, status, period dates | Stripe sync |
| `tips` | id, user_id, amount (cents), currency, stripe_payment_intent_id, status | Donations |

**Note:** Local `supabase/schema.sql` and `supabase/seed.sql` are empty — all schema managed directly in Supabase dashboard.

---

## Known Gotchas

- **en.ts fragility:** Was previously found empty (0 bytes). Always verify file size after dictionary edits.
- **PowerShell + dictionaries:** `.Replace()` hits wrong sections because key names repeat across sections. Use Node.js or manual edits.
- **LinkedIn OG images:** Requires clean URLs without query params. OG image served via `/api/og` API route (NOT convention files which add cache-busting hashes).
- **Resend free tier:** `onboarding@resend.dev` sender can only email the account owner. Custom domain needed for production.
- **Vercel Cron:** Requires Pro plan. Using external cron-job.org to hit `/api/reminders` daily at 7am UTC.
- **PostHog proxy:** Routed through `/ingest/*` rewrites in `next.config.js` to avoid ad blockers.
- **AdSense:** Status "Getting ready" (under review). Pub ID: `ca-pub-3388930204483365`.
- **Stripe:** Currently in test mode. Switch to live products and keys before production.
- **Flow completion email:** API exists (`/api/email/flow-complete`) but not yet triggered from flow runner UI.
- **No rate limiting** on API routes.
- **`any` type** used in deadlines page state and onboarding visa label helper.

---

## Development

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

**Deploy:** Push to `main` branch — Vercel auto-deploys from GitHub.

**Testing a change:**
1. `npm run build` — must pass with zero errors
2. `npm run lint` — should be clean
3. Check dictionary files are non-empty after i18n changes
4. Verify no hardcoded English strings in components (use dict)
5. Verify correct Supabase client used (browser vs server vs admin)

---

## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately
- Write detailed specs upfront to reduce ambiguity
- Use plan mode for verification steps, not just building

### 2. Subagent Strategy
- Use subagents to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, use multiple subagents for focused execution
- One task per subagent

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules that prevent the same mistake
- Review lessons at session start for this project
- After completing a task, check: did anything break? Is there a gotcha not documented?

### 4. Verification Before Done
- Never mark a task complete without proving it works
- `npm run build` must pass
- Diff behavior between main and your changes when relevant
- Ask: "Would a staff engineer approve this?"

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky, implement the elegant solution
- Skip this for simple, obvious fixes — don't over-engineer

### 6. Autonomous Bug Fixing
- When given a bug: just fix it, no hand-holding
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user

---

## Task Management

Track work in `tasks/`:

```
tasks/
  todo.md       # Active tasks, backlog, prioritized roadmap
  lessons.md    # Patterns learned, mistakes to avoid, decisions made
```

**Workflow:**
1. Write plan to `tasks/todo.md` with checkable items
2. Check in with user before starting implementation
3. Mark items complete as you go
4. High-level summary at each step
5. Add review section to `tasks/todo.md` when done
6. Update `tasks/lessons.md` after corrections

---

## Core Principles

1. **Never break the build** — run `npm run build` before considering any task complete
2. **i18n first** — every user-facing string goes through the dictionary system, never hardcode
3. **Simplicity first** — make every change as simple as possible, impact minimal code
4. **No laziness** — find root causes, no temporary fixes, senior developer standards
5. **Minimal impact** — changes should only touch what's necessary, avoid introducing bugs
6. **Progressive enhancement** — free tier must work fully within limits; premium unlocks quantity
7. **Fail silently on analytics/email** — these must never crash the user experience
8. **Mobile-first** — TailwindCSS responsive design with custom `xs:475px` breakpoint
9. **Accessibility** — semantic HTML, ARIA labels, keyboard navigation, RTL for Arabic

---

## Remaining Roadmap

| # | Feature | Impact | Status |
|---|---------|--------|--------|
| 9 | 7-day free trial | Revenue | Not started |
| 10 | Date format localization | Design | Not started |
| 11 | Search + filtering | High | Not started |
| 12 | PWA / offline mode | High | Not started |
| 13 | Onboarding dashboard tour | Design | Not started |
| 14 | Blog system | Growth | Partially built (lib/blog exists) |
| 15 | Referral system | Growth | Not started |
| 16 | Success celebrations | Design | Not started |
| 17 | Dark mode | Design | Not started |
| 18 | Social proof on landing | Growth | Not started |
| 19 | Premium conversion funnel | Revenue | Not started |
