# Task Tracker

## In Progress
_No active tasks_

## Backlog (Prioritized)

### Phase 5 Remaining
- [ ] **7-day free trial** — Add trial_ends_at logic, trial banner, auto-expire (Revenue)
- [ ] **Date format localization** — Use locale-aware date formatting across all pages (Design)
- [ ] **Search + filtering** — Add search to documents, deadlines, and flow lists (High)
- [ ] **PWA / offline mode** — Service worker, offline caching, install prompt (High)
- [ ] **Onboarding dashboard tour** — Guided walkthrough for new users (Design)

### Phase 6: Growth
- [ ] **Blog system** — Full blog with categories, SEO, related posts (lib/blog partially exists)
- [ ] **Referral system** — Invite friends, track referrals, reward premium days
- [ ] **Social proof on landing** — Testimonials, user count, trust badges
- [ ] **Premium conversion funnel** — A/B test pricing, trial-to-paid nudges, churn reduction

### Phase 7: Polish
- [ ] **Dark mode** — Theme toggle, persist preference, update all components
- [ ] **Success celebrations** — Confetti/animations on flow completion, milestones
- [ ] **Rate limiting** — Add rate limits to API routes (reminders, email, account delete)
- [ ] **Fix `any` types** — Deadlines page state and onboarding visa label helper
- [ ] **Flow completion email integration** — Trigger `/api/email/flow-complete` from flow runner when progress = 100%

### Production Readiness
- [ ] **Stripe live mode** — Create live products, switch keys, test end-to-end
- [ ] **Resend custom domain** — Add domain in Resend dashboard for production emails
- [ ] **AdSense approval** — Monitor status, fix any policy issues
- [ ] **Error monitoring** — Add Sentry or similar for production error tracking

## Completed

### Phase 1-4: Foundation
- [x] Supabase auth (email/password)
- [x] Onboarding wizard (3-step)
- [x] Visa-conditional flow engine
- [x] Step runner with notes + progress
- [x] Document vault with status badges
- [x] Deadline management
- [x] 11-language i18n with RTL
- [x] Stripe subscriptions + tips
- [x] Legal pages (privacy, terms, about)
- [x] Free tier enforcement
- [x] Admin dashboard
- [x] PDF export (premium)
- [x] SEO (sitemap, robots, structured data, OG image)

### Phase 5: Polish & Features
- [x] 5.1: Mobile responsiveness audit (15 files)
- [x] 5.2: Password reset flow
- [x] 5.3: Email verification + error boundaries + loading skeletons
- [x] 5.4: Settings/profile page + account deletion
- [x] 5.5: Auto-start first flow after onboarding
- [x] 5.6: Email notifications via Resend (4 templates)
- [x] 5.7: Favicon + OG image + social cards
- [x] 5.8: Analytics (Vercel + PostHog)
