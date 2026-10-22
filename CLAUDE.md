@AGENTS.md

# Gigwise — project memory

> This file is loaded into every Claude Code session. It is the project's
> long-term memory. **Keep it current:** at the end of any task that changes
> behaviour, structure, or a decision, update §7 Status, §8 Decisions, and
> §9 Next steps. Keep entries short; delete what is no longer true.

## 1. What we're building
Gigwise: an independent (NOT affiliated with Fiverr) AI SaaS that helps Fiverr
sellers **Discover → Create → Optimize → Grow → Manage**. Three core journeys:
1. **Discover** — skills → specific service ideas with evidence + confidence.
2. **Create** — guided gig builder (title, description, packages, FAQs, …).
3. **Optimize** — audit an existing gig from content the user pastes/uploads.

Growth tools: Gig Problem Doctor, Thumbnail tester, Competitor gaps, Buyer
reply coach, Experiments, Profit calculator, Growth roadmap, Portfolio Studio
(portfolio website builder with 6 themes).

## 2. Source documents (read only the one you need)
| Need | File |
|---|---|
| Product scope, scoring model, pricing, roadmap | `docs/Fiverr_AI_Seller_Growth_Platform_Plan.md` |
| Stack, tables, security rules, API list | `docs/Fiverr_AI_Tech_Stack_Reference.md` |
| Visual system, IA, screen patterns | `docs/Fiverr_AI_UI_UX_Design_Guide.md` |
| Per-screen inputs/outputs, tokens (authoritative for UI) | `docs/Gigwise_UI_UX_Functional_Specification.md` |
| Original HTML prototype (converted → this app) | `docs/Gigwise_All_in_One_Landing_Dashboard_Portfolio.html` |

Where docs conflict: **Tech Stack doc wins for backend** (Supabase-only, no
Prisma/Express/Redis), **UI spec wins for UI/tokens**.

## 3. Non-negotiable product rules
- Never show order probabilities ("80% chance of orders"). Opportunity score =
  heuristic; quality score = "internal assessment", never "official SEO/ranking".
- Unknown data is `null`/"unknown", never 0 or invented numbers. Show source,
  date and confidence on any market claim.
- No Fiverr scraping, no Fiverr login/password, no auto-publishing gigs or
  auto-sending messages. URL = identifier only; users paste/upload content.
- No fabricated reviews, clients, portfolio work or earnings. Demo work is labeled.
- All AI output is editable and explains *why*.

## 4. Stack (actual installed versions matter)
- **Next.js 16.4** App Router, `cacheComponents: true`, `partialPrefetching: true`,
  Turbopack. `middleware.ts` is now **`src/proxy.ts`**. Read
  `node_modules/next/dist/docs/` before using unfamiliar APIs (see AGENTS.md).
- React 19.3, TypeScript, **Tailwind v4** (tokens in `src/app/globals.css`, no tailwind.config).
- **shadcn/ui "base-nova" style = Base UI, not Radix.** `cn` comes from the `cn`
  package. Add components with `npx shadcn@latest add <name>`.
- Supabase: `@supabase/ssr` + `@supabase/supabase-js`; Zod 4; React Hook Form +
  `@hookform/resolvers@5` (v6 has an npm peer conflict); TanStack Query; Recharts;
  Motion; Sonner toasts; lucide-react icons.

## 5. Commands
```bash
npm run dev            # http://localhost:3000 (demo mode if no .env.local)
npm run build          # also validates cacheComponents/Suspense rules
npm run lint
npx tsc --noEmit       # run `npx next typegen` first if route types are stale
```
Migrations live in `supabase/migrations/`. Apply with the Supabase CLI
(`npx supabase db push`) or paste into the SQL editor. Generate DB types later
with `npx supabase gen types typescript --project-id <id> > src/types/database.ts`.

## 6. Code map & conventions
```
src/proxy.ts                     session refresh + auth gate (calls lib/supabase/proxy.ts)
src/lib/supabase/{env,client,server,admin,proxy}.ts
src/lib/auth.ts                  getCurrentUser() — the ONLY session read (DAL)
src/lib/nav.ts                   nav config used by sidebar, mobile nav, search
src/lib/local-store.ts           demo persistence (localStorage) — to be replaced
src/lib/tools/demo-logic.ts      prototype's rule/template logic (NOT AI)
src/lib/tools/schemas.ts         Zod form schemas (reuse for API input)
src/lib/portfolio/*              portfolio themes/types
src/app/(marketing)/page.tsx     landing page  (/)
src/app/(auth)/                  /login, /signup, server actions (signIn/signUp/signOut)
src/app/auth/callback/route.ts   PKCE code exchange for email links / OAuth
src/app/(app)/layout.tsx         workspace shell (sidebar, topbar, mobile nav)
src/app/(app)/…                  /dashboard /discover /gigs/new /optimize /growth-plan
                                 /tools/{gig-doctor,thumbnails,competitors,buyer-coach,experiments,profitability}
                                 /portfolio{,/themes,/new,/editor}  (PortfolioProvider in layout)
src/components/app/*             shell + form-bits (Field, controlClass, ResultPanel, Metric)
supabase/migrations/             schema + RLS + storage bucket (tested)
```
Conventions:
- **cacheComponents:** anything reading `cookies()`/session or `useSearchParams()`
  must be inside `<Suspense>`. No `new Date()`/`Date.now()` during render, even in
  client components (use `CurrentYear` pattern / event handlers).
- Session reads go through `getCurrentUser()`; re-check auth inside every Server
  Action / Route Handler. Proxy gating is UX, not security — RLS is.
- `createAdminClient()` (service role) is server-only and only for tables users
  can't write: `gig_audits, service_opportunities, research_evidence, ai_jobs,
  usage_events, subscriptions, billing_events`. Check ownership first.
- Links styled as buttons: `<Link className={buttonVariants(...)}>`.
- Forms: RHF + `zodResolver(schema)` with `useForm<z.input<S>, unknown, z.output<S>>`;
  native `<select>`/`<input>` with `controlClass`; errors via `<Field error>`.
- **Palette (2026-10-22, replaces the doc hex values):** two OKLCH scales on hue 163
  in `globals.css` — `brand-50…950` (green; primary = `brand-600` ≈ #17855e, hover
  `brand-700`) and `ink-25…900` (green-tinted neutrals; page bg `ink-25`, text
  `ink-900`, muted `ink-500`, borders `ink-200`). No pure white surfaces (user
  feedback): cards/sidebar/popovers use `paper` (oklch 0.991 0.005 140 ≈ #fafdfa) on a
  `canvas` page (≈ #f1f6f2); use `bg-paper`, never `bg-white`. Pure #fff is only the
  text colour on green buttons.
  **Never hardcode hex in components** — use `bg-brand-*`/`text-ink-*` or semantic
  tokens (`primary`, `muted-foreground`, `border`). Exceptions: portfolio theme colours
  in `lib/portfolio/themes.ts` (user-chosen site themes). Shadows: `shadow-card`,
  `shadow-raised`. Fonts: Inter (UI) + Manrope (portfolio display).
  44px min touch targets; sidebar ≥1024px, bottom nav below.
- Demo mode = no Supabase env → no auth gate, `UserMenu` shows a "Demo mode" badge.
- **Visual rules (user feedback 2026-10-22: avoid the "AI-generated" look):**
  - Lucide icons only — never emoji or text glyphs (→ ← ✦ ↗) in UI copy.
  - No ALL-CAPS eyebrow labels; `PageHeader` takes `section` (sentence case nav section).
  - No hover lift/translate on cards; no middle-dot meta strings ("A · B").
  - Group related items in one bordered list with dividers instead of rows of identical cards.
  - One focal element per page (Overview: dark emerald `#143f35` next-step panel); keep the rest quiet.
  - Card = `rounded-xl border shadow-card` (very light shadow). Grid children holding
    truncated text need `min-w-0`.
  - One UI font: Inter. Manrope is only for portfolio site previews (user content).
  - Type scale = Tailwind defaults + `text-[13px]` for compact UI text. Never invent
    named sizes (`text-ui`): `cn()` treats unknown `text-*` as a colour and drops it.
  - Headings `font-semibold` (no extrabold); numbers `tabular-nums`; min text 12px
    in the app (portfolio miniature previews excepted).
  - No decorative blobs, rotated mock-ups, gradient section backgrounds, or fake
    controls (e.g. step rails that don't navigate). Landing hero max `text-5xl`.
- **Tool pages** use `ToolLayout` (input left, result right) from `components/app/form-bits.tsx`:
  `EmptyResult` before running, `ResultPanel source="template" | "calculated"` after.
  The source badge must stay truthful; switch to a new `"ai"` source when AI lands.
- Destructive actions use `ConfirmDialog` (`components/app/confirm-dialog.tsx`), never `confirm()`.
- `src/app/(app)/error.tsx` (Next 16 API: `{ error, retry }`) and `src/app/not-found.tsx` exist.

## 7. Current status (update me)
- ✅ DB migration `20261022000000_initial_schema.sql`: 20 tables, RLS on all,
  ownership helpers, `gig-images` private bucket. RLS tested on PGlite (Postgres 17).
- ✅ Next.js app scaffolded; HTML prototype fully converted (landing, 12 dashboard
  screens, Portfolio Studio). Build/lint/tsc clean; all routes 200; auth gate verified.
- ✅ Supabase auth: email/password sign-up/in/out, session refresh, protected routes.
- ✅ 2026-10-22 design pass: OKLCH palette, type scale, two-pane tool layout with
  empty states + honest source badges, landing redesign, confirm dialog, error/404 pages.
  Verified by screenshots; no horizontal overflow on any route at 390px.
- ⚠️ All tools still use **demo logic + localStorage** (same as the prototype).
  Nothing is written to Supabase yet besides auth/profile.
- ❌ No AI provider, no background jobs, no billing, no Sentry, no tests yet.
- ❌ Migration not yet applied to a real Supabase project (user to create one).

## 8. Decisions log
- 2026-10-22 Supabase-only backend (no Prisma/Express/BullMQ). Next route
  handlers/server actions for trusted logic.
- 2026-10-22 Routes follow the UI design guide (`/gigs/new`, `/tools/*`, `/growth-plan`);
  `/optimize` used instead of `/gigs/[id]/audit` until gigs are persisted.
- 2026-10-22 Breakpoint for sidebar vs bottom nav = `lg` (1024px) per spec §11.
- 2026-10-22 Users can't write AI outputs/billing/usage (RLS select-only); server writes.
- 2026-10-22 Kept demo mode so the UI runs without Supabase credentials.

## 9. Next steps (in order)
1. Create Supabase project → fill `.env.local` → apply migration → generate types.
2. Persist the core journeys: drafts → `gigs`+`gig_versions`; audits → `gig_audits`
   (server-side); roadmap → `growth_roadmaps`/`roadmap_tasks`; experiments →
   `gig_metrics`/`experiments`; portfolios → `portfolio_projects`; thumbnails →
   `gig-images` bucket. Then delete matching keys from `lib/local-store.ts`.
3. AI layer: `src/app/api/ai/*` route handlers → provider (Claude/OpenAI) with
   structured output validated by Zod; `ai_jobs` + `usage_events` metering;
   prompt-injection defence for pasted gig text.
4. Background jobs (Inngest/Trigger.dev), quotas, billing webhooks (idempotent).
5. Tests: RLS tests, Zod schema tests, Playwright for the three journeys; Sentry.
