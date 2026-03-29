# Lessons Learned

Rules discovered through real bugs and corrections. Review at session start.

---

## Dictionary / i18n

### [2026-03] en.ts was wiped to 0 bytes by PowerShell string replacement
**What went wrong:** Used PowerShell `.Replace()` to edit `en.ts`. A replacement matched too broadly and corrupted the file, leaving it empty.
**Rule:** Never use PowerShell `.Replace()` on dictionary `.ts` files. Use Node.js scripts, manual edits, or section-aware insertion via `$content.IndexOf()`.

### [2026-03] Dictionary key names didn't match component code after rebuild
**What went wrong:** After `en.ts` was wiped, the rebuild used key names from documentation instead of scanning actual component files. Components used different names (e.g., `signIn` vs `loginButton`, `stepOf` vs `stepProgress`).
**Rule:** When rebuilding dictionary files, always scan `.tsx` files first with regex to discover actual key names — including alias patterns like `const f = dict.flows; f?.stepOf`.

### [2026-03] PowerShell .Replace() hits multiple sections with same key names
**What went wrong:** Key names like `limitReachedDesc`, `feature1Title`, `ctaButton` appear in multiple dictionary sections. `.Replace()` modified the wrong section.
**Rule:** Use section-boundary-aware insertion. Find exact section boundaries with `$content.IndexOf()` or rewrite entire sections.

### [2026-03] ~100 missing keys after en.ts rebuild
**What went wrong:** The Dictionary interface was rebuilt from documentation, missing keys that components actually used. Caused cascade of TypeScript build failures.
**Rule:** The Dictionary interface in `en.ts` is the source of truth. Every key used in any component MUST exist in the interface. Run `npm run build` after any dictionary change.

---

## Build & Deploy

### [2026-03] Stripe + Resend crash at build time without env vars
**What went wrong:** Both clients were initialized at module level. During static page data collection, env vars weren't available, causing build failures.
**Rule:** Use the Proxy lazy-init pattern (already implemented). Never initialize API clients at module top level — always use lazy initialization or dynamic imports.

### [2026-03] vercel.json BOM character broke Vercel deploy
**What went wrong:** PowerShell `[System.IO.File]::WriteAllText` with UTF8 encoding added a BOM that Vercel's JSON parser couldn't handle.
**Rule:** For JSON files, use `New-Object System.Text.UTF8Encoding $false` (UTF8 without BOM).

---

## SEO / Social Cards

### [2026-03] LinkedIn "No image found" with Next.js convention files
**What went wrong:** `opengraph-image.tsx` and `twitter-image.tsx` convention files append cache-busting query params (e.g., `?17bbc8efc5cd3c08`). LinkedIn's scraper couldn't process them.
**Rule:** Serve OG images via API routes with clean URLs (`/api/og`), not convention files. Reference the clean URL directly in metadata.

### [2026-03] Facebook "Invalid Image Content Type" from middleware redirect
**What went wrong:** Middleware was redirecting `/opengraph-image` route to `/login` because it wasn't in the public routes list.
**Rule:** Add image route prefixes (`/icon`, `/apple-icon`, `/opengraph-image`, `/twitter-image`) to middleware's static file bypass list.

### [2026-03] LinkedIn requires description > 100 chars
**What went wrong:** Original meta description was ~80 chars. LinkedIn showed "description too short" warning.
**Rule:** Keep meta description at 200+ chars for LinkedIn compliance.

---

## Components

### [2026-03] Badge variant "default" doesn't exist
**What went wrong:** Used `variant="default"` in settings page. Badge only supports: `success | warning | danger | info | neutral`.
**Rule:** Check component prop types before using. The default variant is `"neutral"`.

### [2026-03] Supabase admin client exports `createAdminClient`, not `createClient`
**What went wrong:** Import `{ createClient } from "@/lib/supabase/admin"` failed — the export is named `createAdminClient`.
**Rule:** Admin client: `import { createAdminClient } from "@/lib/supabase/admin"`. Browser/server client: `import { createClient } from "@/lib/supabase/client"` or `server`.

---

## Architecture Decisions

### Why Proxy pattern for Stripe/Resend
Build-time static analysis imports these modules but env vars aren't available yet. Lazy initialization via Proxy defers client creation to first runtime access.

### Why `/api/og` instead of `opengraph-image.tsx`
LinkedIn's scraper can't handle cache-busting query params that Next.js convention files add automatically. API route gives us a clean, stable URL.

### Why external cron instead of Vercel Cron
Vercel Cron requires Pro plan ($20/mo). cron-job.org is free and hits `/api/reminders` daily at 7am UTC with Bearer token auth.

### Why deepMerge for dictionaries instead of requiring complete translations
11 languages with ~400 keys each = 4400 translations. Deep-merging over English means new keys added to `en.ts` automatically fall back to English in other languages until translated. No build breakage from missing translations.
