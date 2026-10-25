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
Prisma/Express/Redis), **for visuals the ref project wins** (see §6), then the UI spec.

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
# New colour tokens in globals.css not showing in dev (blank bg-*/text-* classes)?
# Turbopack's on-disk dev cache is stale: stop dev, delete .next/dev, run `npm run dev` again.
```
Migrations live in `supabase/migrations/`. Apply with the Supabase CLI
(`npx supabase db push`) or paste into the SQL editor. Generate DB types later
with `npx supabase gen types typescript --project-id <id> > src/types/database.ts`.

## 6. Code map & conventions
```
src/proxy.ts                     session refresh + auth gate (calls lib/supabase/proxy.ts)
src/lib/supabase/{env,client,server,admin,proxy}.ts
src/lib/auth.ts                  getCurrentUser() — the ONLY session read (DAL)
src/lib/nav.ts                   nav config + resolveNav(tools) (admin rename/reorder/disable)
src/lib/admin.ts                 getAdminContext()/requireSuperAdmin()/logAdminAction()
src/lib/site/schema.ts           SiteSettings Zod schemas + defaults (landing, tools, themes, announcement)
src/lib/site/store.ts            getSiteSettings() ("use cache" + cacheTag) / writeSettingsKey()
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
src/app/(app)/admin/…            super admin panel: overview+audit log, landing, tools, themes,
                                 announcement, users; actions.ts = all admin Server Actions
src/components/app/*             shell + form-bits; nav-context.tsx (NavProvider, RouteGate)
src/components/portfolio/themes-context.tsx   useThemes() (admin-managed theme list)
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
- **Design source = the user's Lovable "ref" project (2026-10-25, replaces the 2026-10-22
  design rules).** `ref.lnk` points to `F:/User/4b6de3c6-01e8-42fb-a74d-172aec06e03f`
  (TanStack Start app; copy its look only, never its stack). When in doubt, match the ref.
- **Palette** (`globals.css`): `brand-50…950` emerald; **`primary` = `evergreen` (#164d40, the
  combined ref's `--dark`), hover `pine` (#0E3B2E) = `emerald-deep`** (2026-10-25: buttons, links,
  progress, checkboxes, switches, badges) and `ink-25…900` (ink-900 ≈ #172B35 slate text; ink-500 =
  `ink-soft` body/muted; ink-400 = `ink-faint` labels; ink-200 borders; ink-300 =
  `border-strong`). White cards (`bg-card`/`paper`) on a `canvas` page (oklch 0.984).
  `surface-dark` for the auth brand panel. Use `primary`/`evergreen` for interactive green; `brand-600` only for decorative fills. Emerald only for actions, links, selected
  states and progress, never large surfaces.
  **Never hardcode hex in components**; use tokens. Exception: portfolio theme colours
  in `lib/portfolio/themes.ts`. Shadows: `shadow-card` (hairline), `shadow-raised` (previews,
  featured plan). Fonts: Inter (UI), Plus Jakarta Sans = `font-display` (headings, page
  titles, logo, stat numbers), Manrope only in portfolio site previews.
- Demo mode = no Supabase env → no auth gate; `UserMenu` (sidebar footer) shows "Demo mode".
- **Ref visual patterns:**
  - Shell: 240px white sidebar (`SidebarPanel`) with uppercase 11px group labels, 13px items,
    active = `bg-accent text-accent-foreground`, user block in the footer; 56px topbar with
    breadcrumb (Workspace › section › page), tool search, Help. Below `lg` the sidebar opens
    as a left `Sheet` drawer (no bottom nav).
  - `PageHeader`: `font-display text-[28px] font-bold` title + `text-ink-soft` description
    (no `section` prop; the breadcrumb shows it).
  - Section labels: `text-xs font-semibold uppercase tracking-wider text-ink-faint`.
    Landing eyebrows: `text-xs uppercase tracking-[0.14em] text-primary`.
  - Cards `rounded-xl border bg-card` (big panels `rounded-2xl`); hover = `hover:border-primary/40`.
    Badges `rounded-full px-2 py-0.5 text-[11px]`. Buttons h-10, `rounded-[10px]`, font-medium.
  - Lucide icons only. Grid children holding truncated text need `min-w-0`.
  - Type scale = Tailwind defaults + `text-[13px]`/`text-[11px]`; landing titles use
    arbitrary `text-[clamp(...)]`. Never invent named sizes (`text-hero`): `cn()` treats
    unknown `text-*` as a colour and drops it.
- **Graphics** (2026-10-25): one sketch family in `components/illustrations/previews.tsx`
  (white mini cards, hairline borders, `bg-ink-100` skeleton bars, one emerald accent,
  labels only, never numbers, always `aria-hidden`). Use them for empty states
  (`<EmptyResult preview={<XPreview />}>`) and landing step vignettes. No stock art,
  no new colours, no decorative graphics on forms, tables or data-dense screens.
- **Tool pages** use `ToolLayout` (input left, result right) from `components/app/form-bits.tsx`:
  `EmptyResult` before running, `ResultPanel source="template" | "calculated"` after.
  The source badge must stay truthful; switch to a new `"ai"` source when AI lands.
- **Super admin** (2026-10-25): accounts in `SUPER_ADMIN_EMAILS` (env) or with
  `profiles.role = 'super_admin'`. A DB trigger blocks users changing `role`/`suspended_at`;
  only the service role can. Admin pages 404 for non-admins (gate inside `<Suspense>` in
  `admin/layout.tsx`); **every admin Server Action calls `requireSuperAdmin()`** and validates
  with the `settingsSchemas` Zod schemas. Settings live in one public-read
  `site_settings.data` JSON row; after a write call `updateTag(SITE_SETTINGS_TAG)`. Anything
  new an admin should control = add a key to `lib/site/schema.ts` (+ default) and read it
  via `getSiteSettings()`, never hardcode it. Suspension = Supabase auth ban + `suspended_at`.
  Demo mode (no Supabase, dev only): panel is open locally and saves to git-ignored
  `.data/site-settings.json`; in production without Supabase the panel is disabled.
- **Landing page** (2026-10-25) follows `Gigwise Landing Page.html` (repo root; a bundled
  design export, decode the `__bundler/template` JSON to read it), not the workspace look:
  sage canvas, pill buttons, Inter Tight (`font-landing`) + Instrument Serif italic accents
  (`font-serif`, loaded in `components/marketing/fonts.ts`), dark `forest` panels and a `lime`
  highlight. Those tokens + `bg-dots`/`animate-float|marquee` are landing-only. Building blocks
  in `components/marketing/landing-ui.tsx`; hero mockup in `hero-stage.tsx`. Admin text uses
  `*word*` for the serif accent (`withAccent`) and `·` to split the hero note into checks.
- **Workspace shell + Overview** (2026-10-25) follow `Gigwise Dashboard Redesign.html` (user-supplied
  design export): `bg-sage` canvas, Plus Jakarta Sans for the whole shell (`font-display` on the layout
  root), 248px sidebar with the active item `bg-pine text-white` + lime icon, 72px topbar with 44px
  search/Help, lime avatar, demo-mode "Sync your workspace" card in `UserMenu`. Overview = pine hero
  with serif accent, colour-coded quick actions (amber/brand/blue/violet tiles), activity, next steps,
  roadmap timeline, stats, portfolio promo. `pine`/`pine-soft` tokens in `globals.css`.
- **Portfolio Studio** (2026-10-25) follows the Studio app embedded in
  `Gigwise_Combined_Landing_and_Portfolio.html` (its landing half is superseded by the newer landing
  ref). Pages use `StudioHeader` (eyebrow + title) / `StudioSection` from
  `components/portfolio/studio-header.tsx`; home has the intro card + saved-portfolio cards; `/portfolio/new`
  is a real 3-step wizard (profile → work & skills → theme & launch, per-step `trigger()` validation,
  Enter advances). Dark actions use the `pine` button variant.
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
- ✅ 2026-10-25 UI rebuilt to the ref design (tokens, shell, landing, overview, auth, tool
  building blocks). Build/lint/tsc clean; screenshots checked at 1440px and 390px.
- ✅ 2026-10-25 Super admin panel (`/admin`): landing sections (order/hide/custom sections,
  hero, FAQ, pricing), tools on/off/rename/reorder, portfolio themes, announcement bar,
  users (role, manual plan, suspend, delete), audit log. Migration
  `20261025000000_super_admin.sql` tested on PGlite (13 checks); admin flows tested
  end-to-end with Playwright in demo mode. Users/audit log untested against real Supabase.
- ✅ 2026-10-25 Visual pass: tool empty-state sketches, illustrated How it works, roadmap
  with per-step guidance + real progress ring, auth sample card, 404 graphic, breadcrumb
  dedupe. No overflow at 375/768/1024/1440 on any route; palette and fonts unchanged.
- ✅ 2026-10-25 Landing page rebuilt to `Gigwise Landing Page.html` (all admin-driven sections,
  hero copy, FAQ, plans, themes, tool toggles still apply). Build/tsc/lint clean; no overflow
  at 1440/390.
- ✅ 2026-10-25 Workspace shell + Overview rebuilt to the dashboard redesign ref. Build/tsc/lint
  clean; no overflow at 1440/390 on /dashboard, /discover, /tools/gig-doctor, /portfolio/themes.
  Tool page bodies (forms, results) keep their existing styling.
- ✅ 2026-10-25 Portfolio Studio restyled to the combined ref (home, themes, 3-step wizard, editor).
  Wizard flow tested end to end with Playwright; no overflow at 1440/390. `npm run build` can hit the
  default Node heap limit on this machine; `NODE_OPTIONS=--max-old-space-size=6144` fixes it.
- ⚠️ All tools still use **demo logic + localStorage** (same as the prototype).
  Nothing is written to Supabase yet besides auth/profile.
- ❌ No AI provider, no background jobs, no billing, no Sentry, no tests yet.
- ❌ Migration not yet applied to a real Supabase project (user to create one).

## 8. Decisions log
- 2026-10-22 Supabase-only backend (no Prisma/Express/BullMQ). Next route
  handlers/server actions for trusted logic.
- 2026-10-22 Routes follow the UI design guide (`/gigs/new`, `/tools/*`, `/growth-plan`);
  `/optimize` used instead of `/gigs/[id]/audit` until gigs are persisted.
- 2026-10-22 Breakpoint for sidebar = `lg` (1024px); below it a drawer (ref design, 2026-10-25).
- 2026-10-25 User chose the Lovable ref project as the UI source of truth; stack unchanged.
- 2026-10-22 Users can't write AI outputs/billing/usage (RLS select-only); server writes.
- 2026-10-22 Kept demo mode so the UI runs without Supabase credentials.
- 2026-10-25 Super admin = env email list + `profiles.role`; single JSON settings row (not
  per-feature tables) so new admin-controlled areas need no migration. Manual plan grants
  are `subscriptions` rows with `provider = 'admin'`.

## 9. Next steps (in order)
1. Create Supabase project → fill `.env.local` (incl. `SUPABASE_SECRET_KEY`,
   `SUPER_ADMIN_EMAILS`) → apply both migrations → generate types → test /admin/users.
2. Persist the core journeys: drafts → `gigs`+`gig_versions`; audits → `gig_audits`
   (server-side); roadmap → `growth_roadmaps`/`roadmap_tasks`; experiments →
   `gig_metrics`/`experiments`; portfolios → `portfolio_projects`; thumbnails →
   `gig-images` bucket. Then delete matching keys from `lib/local-store.ts`.
3. AI layer: `src/app/api/ai/*` route handlers → provider (Claude/OpenAI) with
   structured output validated by Zod; `ai_jobs` + `usage_events` metering;
   prompt-injection defence for pasted gig text.
4. Background jobs (Inngest/Trigger.dev), quotas, billing webhooks (idempotent).
5. Tests: RLS tests, Zod schema tests, Playwright for the three journeys; Sentry.
