# Fiverr AI Seller Growth Platform
## UI/UX Design System & Product Experience Blueprint

**Version:** 1.0 | **Design direction:** Calm, premium, friendly, task-first SaaS | **Stack:** Next.js 16, Tailwind CSS, shadcn/ui, Supabase

> **Product principle:** A first-time seller should understand what to do within 10 seconds. Every screen must answer: Where am I? What should I do next? What will I get?

## 1. Product experience goals

- Keep the three original journeys visible: **Improve my gig**, **Create a new gig**, and **Discover what to sell**.
- Make advanced tools available progressively: Problem Doctor, Competitor Gap Finder, Thumbnail Tester, Buyer Reply Coach, Experiment Tracker, Portfolio Builder, Profitability Calculator, and Personalized Growth Roadmap.
- Replace jargon with plain language. Explain CTR as “people who clicked after seeing your gig.”
- No invented success probabilities. Clearly distinguish an internal quality score from Fiverr ranking and actual order likelihood.
- Never require Fiverr account passwords. Let users paste gig details, upload screenshots, and enter metrics; do not assume unauthorized scraping is available.

## 2. Visual identity

### Design personality
Minimal, modern, trustworthy, spacious, slightly warm, and professional. Avoid neon gradients, glassmorphism everywhere, excessive illustrations, and dense analytics screens.

### Color tokens
| Token | Light | Dark | Usage |
|---|---|---|---|
| Background | `#F8FAFC` | `#0B1220` | Page background |
| Surface | `#FFFFFF` | `#121C2C` | Cards and panels |
| Primary | `#176B5B` | `#4CC5A1` | Main actions |
| Primary hover | `#115346` | `#6CD6B5` | Hover |
| Text | `#142235` | `#F1F5F9` | Headings/body |
| Muted text | `#617084` | `#A6B4C5` | Descriptions |
| Border | `#E3EAF0` | `#2A384B` | Dividers |
| Success | `#16865D` | `#52C997` | Verified positive states |
| Warning | `#B76A1E` | `#F3B15C` | Needs attention |
| Danger | `#C74747` | `#FF8585` | Errors |

Use green sparingly as an action and progress accent, not as a full-page background. Maintain WCAG AA contrast; test actual token combinations.

### Typography and geometry
- Font: **Inter** or **Geist Sans**; use one family consistently.
- H1 30–36px desktop / 26–28px mobile; H2 22–26px; body 14–16px; labels 13–14px.
- 8px spacing grid: 4, 8, 12, 16, 24, 32, 48, 64.
- Card radius 12–16px; button radius 10–12px; 1px subtle borders; minimal shadows.
- Content max width 1200–1280px; text-heavy wizard max width 720–800px.
- Button touch targets at least 44x44px; clear keyboard focus ring.

## 3. Navigation architecture

**Public:** Home, How it works, Features, Pricing, Help, Sign in, Get started.

**App sidebar (desktop):** Overview, Discover Services, My Gigs, Growth Plan, Tools (expandable), Reports, Billing, Settings.

**Tools submenu:** Gig Doctor, Thumbnail Tester, Competitor Gaps, Buyer Reply Coach, Experiments, Portfolio Builder, Profit Calculator.

**Mobile:** top bar + compact bottom navigation (Home, Discover, Gigs, Plan) and a More menu. Avoid a huge persistent sidebar on small screens.

**Global:** command/search bar for gigs and tools; account menu; contextual help; consistent primary CTA.

## 4. Landing page — screen specification

**Hero:** left: “Find the right Fiverr service. Build a better gig. Grow with confidence.” One supporting sentence, primary CTA **Get started free**, secondary CTA **See how it works**. Right: clean product dashboard mockup (not generic AI robot art).

**Below hero:** three entry cards: “I already have a gig,” “I want to create a gig,” “I only know my skills.” Each card has one-sentence value and a CTA.

**Next:** 3-step explanation: Tell us your goal → Get a personalized plan → Improve and track. Show actual sample recommendations with evidence labels.

**Feature section:** one row for core three journeys, one for growth tools; use compact screenshots, not endless marketing cards.

**Trust:** transparent limitations: “We cannot guarantee Fiverr rankings or orders.” Include privacy note and sample reports.

**Pricing and FAQ:** compare plans simply; clarify credits, supported imports, and refunds.

**Footer:** Terms, Privacy, Contact, Help. Do not imply official Fiverr affiliation.

## 5. First-run onboarding (target under 2 minutes)

**Screen 1: What brings you here?** Three large radio cards: Improve existing gig / Create new gig / Discover services from my skills. Save choice.

**Screen 2: Ask only relevant questions.** Existing seller: gig URL + paste/upload content + optional metrics. New gig: service and buyer problem. Skills-only: skill chips, experience, interests, preferred project type. Allow skip for optional inputs.

**Screen 3: Show a useful first result.** Never send the user to an empty dashboard. Give one recommended next action and an estimated analysis time if asynchronous.

**Screen 4: Optional account completion.** Do not demand unnecessary profile fields before value is shown.

Use a step indicator such as “Step 2 of 3”, save drafts automatically, support Back, and explain data permissions.

## 6. Dashboard — recommended layout

```text
+--------------------------------------------------------------------------+
| Logo    Search gigs and tools...                     Help  Alerts  Avatar |
+-------------------+------------------------------------------------------+
| Overview          | Good morning! What would you like to improve?       |
| Discover Services | [Improve my gig] [Create a gig] [Find services]      |
| My Gigs           |                                                      |
| Growth Plan       | YOUR NEXT BEST ACTION                                |
| Tools             | [Review thumbnail readability]  [Start]             |
| Reports           |                                                      |
| Billing           | MY GIGS                                              |
| Settings          | [Gig name | Quality 72 | Last reviewed | Open]       |
|                   |                                                      |
|                   | RECENT ACTIVITY            GROWTH ROADMAP            |
|                   | [Audit completed...]       [2 of 5 tasks done]      |
+-------------------+------------------------------------------------------+
```

Do not show empty revenue charts for users without data. Show meaningful empty states and a single CTA instead.

## 7. Core journey A — Existing Gig Optimizer

1. Paste gig URL, then supply content by paste, screenshot, or authorized import.
2. Show a review screen of extracted title, tags, description, packages, FAQs, and images; let user correct errors.
3. Run analysis with clear progress states: Uploading → Reviewing → Generating suggestions.
4. Results page: **Summary first** (three priority fixes), then sections: Title, Keywords, Description, Packages, FAQs, Images.
5. Each recommendation displays **Current**, **Suggested**, **Why**, **Copy**, and **Save version**.
6. Show score as “Internal gig quality assessment,” not official SEO ranking. Include evidence confidence and date.
7. CTA: **Apply to draft** (never imply automatic changes on Fiverr), then **Export gig checklist**.

## 8. Core journey B — AI Gig Creator

Wizard: Service → Ideal buyer → Deliverables → Packages → FAQs/requirements → Images → Preview & export.

Use a two-pane desktop editor: editable form on left, live gig preview on right. Mobile switches to an Edit/Preview toggle. Provide plain-language tips beside fields; do not overwrite user changes when regenerating one section.

Show word/character limits and tags count where applicable. Always let users edit AI content before exporting.

## 9. Core journey C — Skills-to-Service Discovery

Start with skill chips and experience. Show 5–8 opportunity cards, not 50. Each card includes service name, buyer problem, skills fit, competition accessibility, evidence confidence, potential deliverables, and “Why recommended.”

Allow filters for skill, project complexity, preferred budget, recurring vs one-time, and confidence. Use **Opportunity Fit Score**, never “80% chance of orders.”

Selecting a service opens a detail view with evidence, gaps, differentiation suggestions, sample packages, and **Create a gig from this idea**.

## 10. Other feature screen patterns

| Feature | Primary screen | Core UX requirement |
|---|---|---|
| Gig Problem Doctor | 3 metrics + diagnosis + action plan | Explain low sample-size uncertainty |
| Thumbnail Tester | Upload + desktop/mobile preview + readability checklist | Use actual crop simulation dimensions where known |
| Competitor Gap Finder | Comparison table + differentiation suggestions | Label evidence sources and timestamps |
| Buyer Reply Coach | Paste buyer message + editable response | No auto-send; flag unsafe requests |
| Experiment Tracker | Timeline of gig versions + metric charts | Separate correlation from causation |
| Portfolio Builder | Sample project brief + task checklist | Clearly label demo projects as demos |
| Profit Calculator | Price, time, fees, revisions → net estimate | Show assumptions and editable fees |
| Growth Roadmap | Prioritized tasks with completion tracking | Show 1–3 next actions, not overwhelming lists |

## 11. Reusable component library

Use shadcn/ui primitives for Button, Card, Tabs, Dialog, Drawer, Form, Input, Textarea, Select, Badge, Tooltip, Table, Skeleton, Toast, Progress, Accordion, Command, and Dropdown Menu.

Build custom components: `JourneyChoiceCard`, `GigPreviewCard`, `AuditIssueCard`, `EvidenceConfidence`, `OpportunityCard`, `ScoreBreakdown`, `BeforeAfterEditor`, `RoadmapTask`, `MetricsInput`, `EmptyState`, `ResponsiveGigThumbnail`, `UsageCreditsMeter`.

Every action needs loading, success, error, and retry states. Destructive actions require confirmation; non-destructive undo is preferable.

## 12. Responsive behavior

- **>=1280px:** full sidebar, 3-column opportunity grid, two-pane editor.
- **768–1279px:** collapsible sidebar, 2-column grid, responsive editor.
- **<768px:** one-column cards, mobile navigation, sticky bottom primary action where appropriate, full-width inputs, no horizontal-scrolling critical forms.
- Charts should resize and tables become stacked cards or selectively scrollable with clear labels.
- Test at 320, 375, 390, 768, 1024, and 1440px widths.

## 13. Accessibility, trust, and writing style

- Target WCAG 2.2 AA: keyboard navigation, visible focus, meaningful labels, accessible dialogs, text alternatives, reduced-motion support.
- No color-only statuses. Show text for success/warning and tooltips for unfamiliar terms.
- Error copy: “We couldn't read that screenshot. Upload a clearer image or paste the text.” Avoid “Invalid input.”
- Clearly identify AI-generated content and offer edit, regenerate, copy, and delete controls.
- Show source, confidence, and freshness on marketplace claims; do not promise orders or search rankings.
- Provide a data deletion path and protect private screenshots/messages.

## 14. UI states to design before implementation

For each main page, prepare: first-use empty state, populated state, loading skeleton, validation error, backend error, no-results state, and mobile state. For AI tasks, include queued/running/completed/failed and safe retry. Persist wizard progress.

## 15. Suggested routes

```text
/                          Landing
/pricing                   Pricing
/login                     Authentication
/onboarding                Goal-based onboarding
/dashboard                 Personalized overview
/discover                  Service finder
/discover/[id]             Opportunity details
/gigs                      My gigs
/gigs/new                  AI gig creator
/gigs/[id]                 Gig workspace
/gigs/[id]/audit           Existing gig optimizer
/gigs/[id]/experiments     Experiment tracking
/tools/gig-doctor          Gig Problem Doctor
/tools/thumbnails          Thumbnail Tester
/tools/competitors         Competitor Gap Finder
/tools/buyer-coach         Buyer Reply Coach
/tools/portfolio           Portfolio Builder
/tools/profitability       Profit Calculator
/growth-plan               Personalized roadmap
/reports                   Saved reports
/billing                   Plans and usage
/settings                  Profile and privacy
```

## 16. Design implementation approach

1. Create Figma page map and design tokens; build mobile and desktop layouts for landing, onboarding, dashboard, all three original journeys, and growth plan.
2. Build a small shadcn/ui theme and component library in Next.js. Use Tailwind variables for colors and spacing.
3. Prototype core flows with realistic sample content before connecting AI APIs.
4. Conduct five usability sessions: ask participants to find a service, create a gig, and interpret an audit without coaching.
5. Measure first-value completion, task completion rate, drop-off per wizard step, and clarity of recommendations.
6. Only then implement advanced tools and dashboards.

## 17. UX acceptance criteria

- A new user can choose one of the three journeys without reading documentation.
- No onboarding journey requires more than three mandatory screens before a first useful result.
- A user can distinguish a quality score from order probability and from official Fiverr metrics.
- Every AI suggestion explains its reason and can be edited or copied.
- Users can recover from interrupted analysis without losing uploaded content.
- All key flows work on a 375px-wide mobile screen and with keyboard-only input.
- Navigation labels are task-oriented, consistent, and never duplicated unnecessarily.

## 18. Design brief for an AI coding assistant

> Build a modern, accessible, mobile-first SaaS UI for a Fiverr seller growth platform. Use Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons, and Supabase. Visual direction: refined, calm, professional, light-first with optional dark mode, warm emerald primary accent, soft gray background, white cards, subtle borders, spacious layouts, Inter/Geist typography. Prioritize three journeys: Improve existing gig, Create new gig, Discover services from skills. Provide a personalized dashboard, step-by-step onboarding, explainable recommendations, edit-and-preview gig builder, evidence confidence indicators, and actionable growth roadmap. Include all loading, error, empty, and mobile states. Avoid dense analytics, flashy gradients, invented success probabilities, and automatic Fiverr account modification. Follow the specifications in this document.

---
**Design north star:** Make complex Fiverr growth decisions feel as simple as completing a guided checklist.
