# Gigwise — Complete UI/UX and Functional Specification

**Version:** 1.0 · **Deliverables:** Interactive standalone HTML prototype, this Markdown reference, and PDF reference.  
**Product:** Independent AI-powered Fiverr seller growth platform (not affiliated with Fiverr).  
**Reference:** Fiverr_AI_UI_UX_Design_Guide.md, Fiverr_AI_Tech_Stack_Reference.md, Fiverr_AI_Seller_Growth_Platform_Plan.md.

## 1. Product vision
A task-first SaaS for three groups: (1) sellers improving an existing Fiverr gig, (2) sellers creating their first/new gig, and (3) users who know only their skills and need specific service ideas. Continue supporting sellers with performance diagnosis, thumbnail previews, competitor differentiation, communication help, experiment tracking, portfolio proof, profitability, and a growth roadmap. Do not claim guaranteed ranking or orders.

## 2. Visual identity and design tokens
- **Personality:** calm, premium, welcoming, minimal, trustworthy, and modern; no neon or heavy gradients.
- **Background:** `#F7F9F8`; **surface:** `#FFFFFF`; **main text:** `#172B35`; **secondary text:** `#6C7C83`; **border:** `#E5EBE8`.
- **Primary emerald:** `#217963`; **hover:** `#155C4B`; **soft green:** `#E7F4ED`; **subtle panel:** `#F0F5F2`.
- **Supporting accent:** muted blue `#EDF3FC` and lavender `#F2EEFB`, used only for entry-card differentiation.
- **Typeface:** Inter, weights 400/500/600/700/800, fallback system sans; H1 30px desktop / 26px mobile; body 14–16px; labels 12–14px.
- **Icons:** Lucide outline icons, consistent 18–20px strokes; no emoji-based primary navigation.
- **Geometry:** 8px spacing system, 10–12px buttons, 13–17px cards, 1px borders, subtle soft shadows, 44px minimum touch targets.
- **Accessibility:** visible focus indicators, semantic labels, keyboard controls, meaningful contrast, responsive layout, reduced-motion support.

## 3. Information architecture
**Public pages (production):** Landing, How It Works, Features, Pricing, Help, Login, Signup, Terms, Privacy.  
**Application:** Overview, Discover Services, Create Gig, Optimize Gig, Growth Roadmap, Gig Problem Doctor, Thumbnail Tester, Competitor Gaps, Buyer Reply Coach, Experiments, Portfolio Builder, Profit Calculator.  
**Future:** My Gigs, Reports, Billing, Settings, Team Management, Notifications, Image Generator, Marketplace Data Imports.

## 4. User experience principles
1. Show three clear starting choices immediately: Improve My Gig, Create a New Gig, Find Services From My Skills.
2. Ask only relevant questions, explain each step in plain language, and allow users to edit AI drafts.
3. Display a meaningful result before asking for optional profile information.
4. Never confuse an internal quality score with official Fiverr SEO, marketplace demand, or order probability.
5. Show data origin, freshness, confidence, and missing evidence for every research claim.
6. Provide helpful empty states, validation, saved drafts, loading feedback, error recovery, and undo where appropriate.
7. Optimize mobile flows with compact navigation, readable cards, and minimal input burden.

## 5. Screen-by-screen requirements

### 5.1 Overview dashboard
**UI:** Left sidebar on desktop, top search, profile avatar, welcome header, three primary entry cards, four compact stats, next actions, getting-started steps, growth tools grid. Mobile uses bottom navigation.  
**Actions:** Route to any module, search for a tool, view local counts and roadmap completion.  
**Production:** Replace local demo counters with Supabase queries scoped to authenticated user.

### 5.2 Discover services from skills
**Inputs:** Skills, experience, target goal, optionally interests, industry, budget and project style.  
**Outputs:** 5–10 narrowly defined service ideas, buyer pain point, ideal buyer, suggested deliverables, pricing hypotheses, competitor evidence, demand evidence, confidence and score breakdown.  
**Logic:** Skill-match ranking + evidence-based opportunity score (demand 30%, competitive accessibility 25%, skills 20%, pricing potential 15%, differentiation 10%) with clearly documented uncertainty.  
**Demo:** Template-based service suggestions from comma-separated skills; no marketplace research.

### 5.3 Create new gig
**Inputs:** Service, buyer problem, scope, starting price, delivery days; production adds target audience, revisions, experience and assets.  
**Outputs:** Editable gig title, description, tags, category recommendation, Basic/Standard/Premium packages, FAQs, buyer requirements, thumbnail briefs, video script and final copy-ready export.  
**Validation:** Verify against Fiverr's current title, description, tag, image and category requirements; do not hardcode unverified policy limits.  
**Demo:** Template-based editable title/description and package price examples, saved in browser localStorage.

### 5.4 Optimize existing gig
**Inputs:** Fiverr username, gig URL (reference only), pasted gig title/description, optional tags, packages, images, metrics and screenshots.  
**Outputs:** Explainable content quality audit, issue list, rewrite suggestions, before/after comparison, prioritization and next steps.  
**Production:** User-supplied or explicitly authorized data only. Do not rely on unauthorized scraping.  
**Demo:** Simple transparent heuristic checks and a local score, not official SEO.

### 5.5 Gig Problem Doctor
**Inputs:** Impressions, clicks, orders, optional timeframe and previous-period metrics.  
**Calculations:** CTR = clicks / impressions × 100; click-to-order rate = orders / clicks × 100 when clicks > 0.  
**Outputs:** Likely stage to investigate, sample-size warnings and a prioritized test. No causal claims without evidence.  
**Demo:** Live calculated metrics with rule-based guidance.

### 5.6 Thumbnail tester
**Inputs:** Headline, uploaded thumbnail and optional alternative versions.  
**Outputs:** Responsive card preview, headline readability checklist, safe-margin guidance, contrast feedback, and mobile crop preview.  
**Production:** Optional vision analysis, accessible image preview, multiple variants and comparison.  
**Demo:** Browser-local image preview and headline-length heuristic.

### 5.7 Competitor gap finder
**Inputs:** Seller service and manually supplied competitor listings, screenshots or permitted research exports.  
**Outputs:** Competitor positioning matrix, differentiators, underserved buyer problems, unique service angle, evidence links and limitations.  
**Demo:** Positioning suggestions based on entered examples; no live research.

### 5.8 Buyer reply coach
**Inputs:** Buyer message and optional tone, service, timeframe and scope.  
**Outputs:** Editable professional reply, clarification questions, quote outline, scope boundaries, red-flag warning, and translation options.  
**Safety:** Never auto-send without consent; avoid handling passwords or sensitive customer details.  
**Demo:** Reusable scope-clarification template and copy action.

### 5.9 Experiment tracker
**Inputs:** Gig version, change description, date, impressions, clicks, orders and time window.  
**Outputs:** Historical snapshots, trend charts, change log, comparison and uncertainty notes.  
**Production:** Avoid attributing outcome changes to a single edit without sufficient evidence.  
**Demo:** Local snapshot table and persistent storage.

### 5.10 Portfolio builder
**Inputs:** Service, skills, example project type and target audience.  
**Outputs:** Honest demonstration project brief, milestones, acceptance criteria, screenshots checklist and case-study template.  
**Safety:** Clearly label self-initiated demo work; never fabricate client testimonials.  
**Demo:** Project outline template.

### 5.11 Profit calculator
**Inputs:** Price, estimated hours, assumed platform fee percentage, other costs; production adds taxes, revisions, exchange rate and time contingency.  
**Calculations:** Net = price × (1 − fee%) − costs; effective hourly earnings = net / hours.  
**Outputs:** Earnings estimate, effective hourly rate and risk warning.  
**Demo:** Live local calculator; fee input is editable assumption.

### 5.12 Growth roadmap
**Inputs:** User goal, stage, audit findings, opportunity research and performance data.  
**Outputs:** Prioritized action plan with checkboxes, milestones, reminders and progress.  
**Demo:** Five tasks saved locally and shown as completion percentage.

## 6. Recommended future feature enhancements
- SEO-aware gig copy editor with human approval and version comparison.
- Thumbnail image generation with consistent safe margins and mobile-first text sizes.
- Search preview simulator for multiple card widths, explicitly labeled approximate.
- Opportunity research source panel with date, evidence type and confidence.
- Seller education snippets for impressions, CTR, conversion and pricing.
- Localization and multilingual buyer communication.
- Paid-plan quotas, AI usage credits, export history, invoices and usage visibility.
- Notification preferences and weekly review digest.
- Workspace and team support for agencies in later phases.

## 7. Production technology stack
- **App:** Next.js 16 App Router + TypeScript.
- **UI:** Tailwind CSS, shadcn/ui, Lucide React, Inter, optional Framer Motion.
- **Backend:** Supabase PostgreSQL, Auth, Row Level Security, Storage and optional Edge Functions.
- **Server orchestration:** Next.js route handlers with Zod validation and server-side authorization.
- **AI:** OpenAI or Claude through server-side API; structured outputs validated against schemas.
- **Background tasks:** Trigger.dev or Inngest for longer-running analysis, retries and exports.
- **Analytics:** Recharts, Supabase query layer; Sentry for error monitoring.
- **Payments:** Regionally available subscription provider with verified webhook signatures and entitlement checks.
- **Deployment:** Vercel + Supabase; dedicated workers when required.

## 8. Supabase data model
Tables: `profiles`, `seller_profiles`, `user_skills`, `gigs`, `gig_versions`, `gig_audits`, `gig_images`, `gig_metrics`, `service_opportunities`, `research_evidence`, `competitor_analyses`, `gig_packages`, `buyer_messages`, `portfolio_projects`, `growth_roadmaps`, `roadmap_tasks`, `experiments`, `ai_jobs`, `subscriptions`, `usage_events`.  
Every user-owned row requires `user_id` or ownership through a protected parent relation. Enable and test RLS for all exposed tables. Store user uploads in private buckets and access them with scoped signed URLs. Keep service-role and AI secrets server-side.

## 9. AI and evidence architecture
**Flow:** UI input → session authorization → Zod validation → usage entitlement → background AI task → model structured output → schema validation → quality checks → save Supabase results → user-reviewable draft.  
**Research:** Distinguish user-reported seller analytics, permitted marketplace research, external signals, and model inference. Store source URL or upload reference, observation date, confidence and caveats. Never fabricate demand, competition counts, order probabilities or rankings.  
**Resilience:** Timeouts, retries, idempotency keys, job statuses, cancellation, rate limiting and cost tracking.

## 10. Prototype behavior and limits
`Gigwise_Interactive_UI_Prototype.html` is a standalone HTML/CSS/JavaScript application. Open it in a browser. It includes functioning screen navigation, mobile layout, form validation, skill-based suggestion templates, draft generation, rule-based audit, CTR calculations, thumbnail preview, competitor positioning suggestions, buyer reply template, experiment storage, portfolio plan, profit calculator and roadmap checklist.  
**It does not connect to Supabase, Fiverr, AI providers, payment systems or external analytics.** It does not authenticate users, perform true SEO analysis, run real competitor research or predict orders. Demo drafts and metrics are stored in browser localStorage. Font and icon assets load from public CDNs when internet access is available; system fallbacks apply otherwise.

## 11. Accessibility and responsive acceptance criteria
- Desktop 1440px: persistent 242px sidebar, max-width content, three entry cards, compact metrics.
- Tablet 768px: sidebar replaced with bottom navigation; two-column metrics and stacked details.
- Mobile 375px: single-column cards, 44px controls, no horizontal scrolling, bottom navigation.
- Keyboard: all actions reachable and focus visible; controls labeled.
- Feedback: invalid inputs explain correction, buttons show action result, empty lists give next action.
- Performance: avoid unnecessary animations, lazy-load advanced modules and optimize images.
- Test: Lighthouse accessibility, axe, keyboard-only, VoiceOver/NVDA, low-motion setting and contrast.

## 12. Implementation phases
**Phase 1:** Next.js + Supabase foundation, auth/RLS, three original journeys, simple dashboard, gig drafts, evidence-aware outputs.  
**Phase 2:** Gig Doctor, thumbnail tester, roadmap, experiment tracker, basic reports, subscriptions.  
**Phase 3:** Competitor gap research, buyer coach, portfolio builder, profit tools, advanced insights and localization.  
**Phase 4:** Authorized data integrations, agency accounts, richer analytics and personalization.

## 13. QA and security checklist
- No secret API keys in client code.
- RLS denies access to other users' data.
- Upload size, file type and content validation.
- Server-side AI rate limiting and usage quotas.
- Explicit consent and retention policy for buyer messages and analytics.
- Sanitize user-provided content; defend against prompt injection in uploaded material.
- Verified billing webhooks and subscription entitlements.
- Clear AI uncertainty, source provenance and privacy messaging.
- No unauthorized Fiverr scraping, fake reviews or misleading ranking claims.

## 14. Suggested screen copy
- Hero: **Good morning, creator. One calm place to build better gigs and grow your freelance business.**
- Primary actions: **Improve my gig**, **Create a new gig**, **Find services to sell**.
- Discovery: **Start with what you're good at. We'll suggest specific service angles.**
- Audit: **See what to improve, why it matters, and what to try next.**
- Roadmap: **A clear next step beats a hundred suggestions.**
- Trust: **We help you make better decisions. We cannot guarantee Fiverr rankings or orders.**

## 15. Handoff to developer or AI coding agent
Recreate the HTML prototype as production Next.js components with a shared design token system, real Supabase session management, Zod schemas, server-side AI tasks and proper audit/history tables. Keep the task-first hierarchy, consistent visual identity, simple language, editable outputs, evidence labels and progressive disclosure. Implement tests before enabling payments or external integrations.
