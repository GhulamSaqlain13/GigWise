import { Fragment, type ReactNode } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  Calculator,
  Check,
  ClipboardList,
  Compass,
  FlaskConical,
  Image,
  LayoutTemplate,
  MessageSquare,
  MessageSquareReply,
  Minus,
  PenLine,
  Plus,
  Search,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Wand2,
} from "lucide-react"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Logo } from "@/components/logo"
import { CurrentYear } from "@/components/marketing/current-year"
import { landingFontVars } from "@/components/marketing/fonts"
import { HeroStage } from "@/components/marketing/hero-stage"
import { Accent, Blob, Chip, Eyebrow, h2, landingCard, lead, pillClass, withAccent } from "@/components/marketing/landing-ui"
import { ServiceDirectionDemo } from "@/components/marketing/service-direction-demo"
import { SiteHeader } from "@/components/marketing/site-header"
import { disabledHrefs } from "@/lib/nav"
import type { CustomSection, LandingSettings, ThemeSetting } from "@/lib/site/schema"
import { getSiteSettings } from "@/lib/site/store"
import { cn } from "@/lib/utils"

const wrap = "relative mx-auto max-w-[1200px] px-4 md:px-8"
const sectionPad = "scroll-mt-20 py-[72px] md:py-[130px]"

function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn("relative", sectionPad, className)}>
      {children}
    </section>
  )
}

// Section order, visibility and most copy come from the super admin's
// site settings (cached; refreshed when an admin saves).
export default async function LandingPage() {
  const { landing, themes, tools, announcement } = await getSiteSettings()
  const off = disabledHrefs(tools)
  const builtIn: Record<string, () => ReactNode> = {
    hero: () => <Hero hero={landing.hero} />,
    journeys: () => <Journeys />,
    discovery: () => <DiscoveryShowcase />,
    creator: () => <CreatorShowcase />,
    optimizer: () => <OptimizerShowcase />,
    portfolio: () => <PortfolioShowcase themes={themes} />,
    tools: () => <Tools disabled={off} />,
    how: () => <HowItWorks />,
    pricing: () => <Pricing plans={landing.plans} note={landing.pricingNote} />,
    faq: () => <Faq faqs={landing.faqs} />,
    cta: () => <ClosingCta />,
  }
  const custom = new Map(landing.custom.map((c) => [c.id, c]))

  return (
    <div className={cn(landingFontVars, "min-h-screen overflow-x-clip bg-sage font-landing text-forest-ink")}>
      {announcement.showOnLanding && <AnnouncementBar announcement={announcement} />}
      <SiteHeader />
      <main>
        {landing.sections
          .filter((section) => section.visible)
          .map((section) => {
            const render = builtIn[section.id]
            if (render) return <Fragment key={section.id}>{render()}</Fragment>
            const c = custom.get(section.id)
            return c ? <CustomBlock key={c.id} section={c} /> : null
          })}
      </main>
      <Footer />
    </div>
  )
}

function CustomBlock({ section }: { section: CustomSection }) {
  return (
    <Section id={section.id} className="bg-white">
      <div className={cn(wrap, "max-w-3xl text-center")}>
        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
        <h2 className={cn(h2, "mt-[18px]")}>{withAccent(section.title)}</h2>
        {section.body && <p className={cn(lead, "mt-5 whitespace-pre-line text-balance")}>{section.body}</p>}
        {section.ctaLabel && section.ctaHref && (
          <Link href={section.ctaHref} className={pillClass("brand", undefined, "mt-7")}>{section.ctaLabel}</Link>
        )}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

const skills = ["Web development", "Logo design", "Copywriting", "Video editing", "Shopify stores", "SEO audits", "UI/UX design", "Voice-over", "Illustration", "Data analysis"]
const skillTone = ["", "bg-lime", "", "bg-forest-ink text-white", "", "bg-brand-100", "", "", "bg-lime", ""]

function Hero({ hero }: { hero: LandingSettings["hero"] }) {
  const notes = hero.note.split("·").map((n) => n.trim()).filter(Boolean)
  return (
    <section className="relative -mt-[76px] pt-[76px]">
      <div aria-hidden className="absolute inset-0 bg-dots mask-[radial-gradient(ellipse_70%_60%_at_50%_30%,#000_30%,transparent_75%)]" />
      <Blob className="top-20 -left-40 size-[520px] bg-lime opacity-35 blur-[110px]" />
      <Blob className="top-10 -right-36 size-[480px] bg-mint-glow opacity-30 blur-[120px]" />

      <div className={cn(wrap, "z-[2] pt-16 text-center md:pt-[88px]")}>
        {hero.eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-300 bg-white py-1.5 pr-3.5 pl-1.5 text-[13px] font-semibold">
            <span className="rounded-full bg-lime px-2.5 py-[3px] text-[11px] tracking-[0.08em] uppercase">New</span>
            {hero.eyebrow}
          </span>
        )}
        <h1 className="mx-auto mt-7 max-w-[960px] text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance">
          {withAccent(hero.title, (word, key) => (
            <span key={key} className="relative inline-block whitespace-nowrap">
              <span className="font-serif text-[1.12em] font-normal tracking-normal text-brand-700 italic">{word}</span>
              <svg aria-hidden viewBox="0 0 200 20" preserveAspectRatio="none" className="absolute -bottom-1.5 -left-[4%] h-4 w-[108%] text-lime">
                <path d="M3 14 C 50 4, 120 2, 197 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          ))}
        </h1>
        {hero.subtitle && <p className={cn(lead, "mx-auto mt-7 max-w-[620px] text-[19px] text-balance")}>{hero.subtitle}</p>}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href={hero.primaryHref || "/signup"} className={pillClass("brand", "lg")}>
            {hero.primaryLabel} <ArrowRight aria-hidden />
          </Link>
          {hero.secondaryLabel && hero.secondaryHref && (
            <Link href={hero.secondaryHref} className={pillClass("ghost", "lg")}>{hero.secondaryLabel}</Link>
          )}
        </div>
        {notes.length > 0 && (
          <p className="mt-[18px] flex flex-wrap justify-center gap-[18px] text-[13px] text-ink-soft">
            {notes.map((n) => (
              <span key={n} className="inline-flex items-center gap-1.5">
                <Check className="size-4 text-brand-700" aria-hidden /> {n}
              </span>
            ))}
          </p>
        )}
      </div>

      <div className={cn(wrap, "z-[2] mt-14 md:mt-[72px]")}>
        <HeroStage />
      </div>

      <div className="relative z-[2] mt-20 border-t border-ink-200 bg-white pt-[26px] pb-[34px] md:mt-[110px]">
        <p className="mb-[18px] text-center text-[13px] font-medium text-ink-soft">Built for freelancers who sell skills like</p>
        <div className="overflow-hidden mask-[linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="flex w-max animate-marquee gap-3.5" aria-hidden>
            {[...skills, ...skills].map((skill, i) => (
              <span
                key={i}
                className={cn(
                  "rounded-full px-[18px] py-2.5 text-[15px] font-medium",
                  skillTone[i % skills.length] || "border border-ink-200 bg-sage",
                )}
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="sr-only">{skills.join(", ")}</p>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// One workspace (journeys)
// ---------------------------------------------------------------------------

const journeys = [
  { n: "01", icon: Compass, title: "Discover a service", body: "Enter your skills and experience and get service directions you can realistically offer, with the buyer problem each one solves.", href: "/discover", tone: "light" },
  { n: "02", icon: Wand2, title: "Create a gig", body: "Turn expertise into an offer buyers understand: titles, description, packages, tags and FAQs, structured and ready to review.", href: "/gigs/new", tone: "lime" },
  { n: "03", icon: TrendingUp, title: "Optimize an existing gig", body: "Paste your current gig and get a prioritized review: what’s working, what’s unclear, and what to change first.", href: "/optimize", tone: "light" },
  { n: "04", icon: LayoutTemplate, title: "Build a portfolio website", body: "Six designed themes, a guided setup, and a visual editor. Your work deserves more than a profile link.", href: "/portfolio/themes", tone: "dark" },
] as const

const journeyTone = {
  light: { card: "border border-ink-200 bg-sage hover:border-brand-700/40", icon: "border border-ink-200 bg-white text-brand-700", n: "text-ink-soft", body: "text-ink-soft" },
  lime: { card: "bg-lime", icon: "bg-forest-ink text-lime", n: "text-lime-ink", body: "text-lime-ink" },
  dark: { card: "bg-forest-ink text-white", icon: "bg-white/10 text-lime", n: "text-forest-muted", body: "text-forest-fg" },
}

function Journeys() {
  return (
    <Section id="workspace" className="bg-white">
      <div className={cn(wrap, "grid items-start gap-16 lg:grid-cols-[1fr_1.2fr]")}>
        <div className="lg:sticky lg:top-28">
          <Eyebrow>One workspace</Eyebrow>
          <h2 className={cn(h2, "mt-[18px]")}>Every step of your <Accent>freelance</Accent> journey.</h2>
          <p className={cn(lead, "mt-5 max-w-[420px]")}>
            Gigwise brings your tools together, from finding the right service to improving your listings and showing
            your best work.
          </p>
          <a href="#tools" className={pillClass("ghost", undefined, "mt-7")}>See all tools <ArrowRight aria-hidden /></a>
          <div aria-hidden className="relative mt-11 h-[200px] max-w-[420px] overflow-hidden rounded-3xl bg-forest-ink">
            <div className="absolute inset-0 bg-dots-light" />
            <svg viewBox="0 0 420 200" className="absolute inset-0 size-full font-landing">
              <path d="M30 160 C 110 160, 120 60, 210 90 S 330 40, 390 40" fill="none" className="stroke-lime" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
              <circle cx="30" cy="160" r="9" className="fill-lime" />
              <circle cx="210" cy="90" r="9" className="fill-mint-glow" />
              <circle cx="390" cy="40" r="13" fill="white" />
              <path d="M384 40l4 4 8-8" fill="none" className="stroke-forest-ink" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="46" y="182" className="fill-forest-fg" fontSize="12">Idea</text>
              <text x="226" y="114" className="fill-forest-fg" fontSize="12">First gig</text>
              <text x="300" y="72" className="fill-forest-fg" fontSize="12">Steady growth</text>
            </svg>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          {journeys.map(({ n, icon: Icon, title, body, href, tone }) => {
            const t = journeyTone[tone]
            return (
              <Link key={n} href={href} className={cn("group flex gap-5 rounded-[22px] p-6 transition-transform duration-200 hover:-translate-y-0.5 md:gap-[22px] md:p-7", t.card)}>
                <span className={cn("inline-flex size-[52px] shrink-0 items-center justify-center rounded-2xl", t.icon)}>
                  <Icon className="size-6" aria-hidden />
                </span>
                <div className="min-w-0">
                  <div className={cn("text-[13px] font-semibold", t.n)}>{n}</div>
                  <h3 className="mt-1 mb-2 flex items-center gap-2 text-[22px] font-semibold tracking-[-0.02em]">
                    {title}
                    <ArrowUpRight className="size-5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                  </h3>
                  <p className={cn("text-base leading-relaxed", t.body)}>{body}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Service discovery
// ---------------------------------------------------------------------------

function DiscoveryShowcase() {
  return (
    <Section id="features" className="overflow-hidden bg-sage">
      <Blob className="top-[18%] right-[4%] size-[420px] bg-lime opacity-30 blur-[100px]" />
      <div className={cn(wrap, "grid items-center gap-[72px] lg:grid-cols-2")}>
        <div className="min-w-0">
          <Eyebrow>Service discovery</Eyebrow>
          <h2 className={cn(h2, "mt-[18px]")}>Not sure what to sell? <Accent>Start with what you know.</Accent></h2>
          <p className={cn(lead, "mt-5 max-w-[480px]")}>
            Enter your skills and goals. Gigwise suggests service directions built around the problem a real buyer
            would pay to solve, with the reasoning shown and never invented statistics. Try it here, no account needed.
          </p>
          <Link href="/discover" className={pillClass("brand", undefined, "mt-[30px]")}>
            Discover your opportunities <ArrowRight aria-hidden />
          </Link>
        </div>
        <div className="relative min-w-0 pt-[30px] pb-[60px]">
          <div aria-hidden className="absolute -top-2.5 -left-10 hidden size-[220px] rounded-3xl bg-dots md:block" />
          <ServiceDirectionDemo />
          <div aria-hidden className="absolute -right-[30px] bottom-0 hidden w-[280px] animate-float rounded-[18px] bg-forest-ink p-4 text-white shadow-[0_18px_40px_-24px_oklch(0.22_0.025_173/0.5)] xl:block">
            <div className="text-[11px] font-semibold tracking-[0.12em] text-lime">EXAMPLE DIRECTION</div>
            <div className="mt-2 text-[15px] font-semibold">Speed audits for Shopify stores</div>
            <div className="mt-1.5 text-xs leading-normal text-forest-fg">Buyer problem: slow product pages losing sales.</div>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Gig creator
// ---------------------------------------------------------------------------

const described = [
  ["Service", "Next.js performance audits"],
  ["Buyer", "Startup founders with slow sites"],
  ["Problem", "Slow page loads hurt conversions"],
  ["Deliverables", "Audit report and fixes"],
  ["Tools", "Next.js, Lighthouse, Vercel"],
]

function CreatorShowcase() {
  return (
    <Section className="bg-white">
      <div className={cn(wrap, "text-center")}>
        <Eyebrow>Gig creator</Eyebrow>
        <h2 className={cn(h2, "mx-auto mt-[18px] max-w-[820px]")}>Turn your expertise into an offer <Accent>buyers understand.</Accent></h2>
        <p className={cn(lead, "mx-auto mt-5 max-w-[560px]")}>
          Describe your service in a guided form and get titles, a buyer-focused description, search tags, packages and
          FAQs you can edit line by line.
        </p>
      </div>
      <div className={cn(wrap, "mt-16")}>
        <div className="relative mx-auto grid max-w-[980px] gap-7 text-left md:grid-cols-2">
          <div className="min-w-0 rounded-3xl border border-dashed border-ink-300 bg-sage p-7">
            <div className="text-xs font-semibold tracking-[0.12em] text-ink-soft">YOU DESCRIBE</div>
            <div className="mt-[18px] flex flex-col gap-2.5 text-sm">
              {described.map(([label, value]) => (
                <div key={label} className="flex gap-2.5 rounded-xl border border-ink-200 bg-white px-3.5 py-3">
                  <span className="min-w-[92px] text-ink-soft">{label}</span>
                  {value}
                </div>
              ))}
            </div>
          </div>
          <div aria-hidden className="absolute top-1/2 left-1/2 z-[3] hidden size-16 -translate-1/2 items-center justify-center rounded-full border-[6px] border-white bg-lime shadow-[0_10px_30px_-10px_oklch(0.22_0.025_173/0.3)] md:flex">
            <Sparkles className="size-6" />
          </div>
          <div className="relative min-w-0 overflow-hidden rounded-3xl bg-forest-ink p-7 text-white">
            <div aria-hidden className="absolute inset-0 bg-dots-light opacity-60" />
            <div className="relative">
              <div className="text-xs font-semibold tracking-[0.12em] text-lime">GIGWISE DRAFTS</div>
              <div className="mt-[18px] flex flex-col gap-2.5 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/[0.07] p-3.5">
                  <div className="font-semibold">Title option 1</div>
                  <div className="mt-1 leading-normal text-forest-fg">I will audit and fix your slow Next.js site for faster page loads</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.07] p-3.5">
                  <div className="font-semibold">Search tags</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["nextjs", "performance", "pagespeed", "core web vitals"].map((tag) => (
                      <Chip key={tag} className="bg-lime/15 font-medium text-lime">{tag}</Chip>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.07] p-3.5">
                  <div className="font-semibold">Packages</div>
                  <div className="mt-1 leading-normal text-forest-fg">Basic: audit report. Standard: report and top fixes. Premium: full optimization.</div>
                </div>
              </div>
              <Link href="/gigs/new" className={pillClass("lime", undefined, "mt-4 w-full")}>Create a gig</Link>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Gig optimizer
// ---------------------------------------------------------------------------

const priorities = [
  { area: "Description", note: "Opening lines describe you, not the buyer’s outcome", tag: "High priority", level: "high" },
  { area: "Title", note: "Clear service, but missing the specific buyer problem", tag: "High priority", level: "high" },
  { area: "Packages", note: "Standard tier repeats Basic deliverables, so differentiate scope", tag: "Medium", level: "medium" },
  { area: "Tags", note: "Two tags duplicate the same keyword", tag: "Quick fix", level: "quick" },
] as const

const priorityTone = {
  high: { row: "border-orange-200 bg-orange-50", dot: "bg-orange-600", chip: "bg-orange-100 text-orange-900" },
  medium: { row: "border-ink-200", dot: "bg-amber-500", chip: "bg-amber-100 text-amber-900" },
  quick: { row: "border-ink-200", dot: "bg-brand-700", chip: "bg-brand-100 text-brand-800" },
}

function OptimizerShowcase() {
  return (
    <Section className="overflow-hidden bg-sage">
      <div className={cn(wrap, "grid items-center gap-[72px] lg:grid-cols-[1.1fr_1fr]")}>
        <div className="relative order-2 min-w-0 lg:order-1">
          <svg aria-hidden viewBox="0 0 200 200" className="absolute -top-[70px] -left-20 hidden size-[260px] text-brand-700 md:block">
            <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeOpacity=".15" strokeDasharray="3 7" />
            <circle cx="100" cy="100" r="64" fill="none" stroke="currentColor" strokeOpacity=".12" />
          </svg>
          <div className={cn(landingCard, "relative rounded-3xl p-6")}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-[0.12em] text-ink-soft">REVIEW PRIORITIES</span>
              <Chip className="bg-sage text-ink-700">Example</Chip>
            </div>
            <div className="mt-[18px] flex flex-col gap-2.5">
              {priorities.map(({ area, note, tag, level }) => {
                const t = priorityTone[level]
                return (
                  <div key={area} className={cn("flex items-start gap-3.5 rounded-[14px] border p-3.5", t.row)}>
                    <span className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", t.dot)} aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2.5 text-[15px] font-semibold">
                        {area}
                        <Chip className={t.chip}>{tag}</Chip>
                      </div>
                      <div className="mt-1 text-[13px] text-ink-soft">{note}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div aria-hidden className={cn(landingCard, "absolute -right-10 -bottom-[46px] hidden w-[300px] animate-float-slow rounded-[18px] p-4 xl:block")}>
            <div className="text-[11px] font-semibold tracking-[0.12em] text-ink-soft">BEFORE → AFTER</div>
            <div className="mt-2.5 text-[13px] text-ink-soft line-through">I am a developer with 5 years…</div>
            <div className="mt-1.5 rounded-lg bg-lime-soft px-2.5 py-2 text-[13px] font-medium">Your Next.js site, loading in under a second.</div>
          </div>
        </div>
        <div className="order-1 min-w-0 lg:order-2">
          <Eyebrow>Gig optimizer</Eyebrow>
          <h2 className={cn(h2, "mt-[18px]")}>Know what to improve <Accent>before</Accent> making changes.</h2>
          <p className={cn(lead, "mt-5 max-w-[460px]")}>
            Paste your current gig (title, description, tags, packages) and get an organized review with before and
            after suggestions. Recommendations explain their criteria, with no invented ranking scores.
          </p>
          <Link href="/optimize" className={pillClass("brand", undefined, "mt-[30px]")}>
            Optimize your gig <ArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Portfolio builder
// ---------------------------------------------------------------------------

function PortfolioShowcase({ themes }: { themes: ThemeSetting[] }) {
  return (
    <Section id="portfolio" className="overflow-hidden bg-white">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[420px] bg-dots mask-[linear-gradient(#000,transparent)]" />
      <div className={cn(wrap, "text-center")}>
        <Eyebrow>Portfolio builder</Eyebrow>
        <h2 className={cn(h2, "mx-auto mt-[18px] max-w-[760px]")}>Your work deserves more than a <Accent>profile link.</Accent></h2>
        <p className={cn(lead, "mx-auto mt-5 max-w-[540px]")}>
          Create a professional portfolio website that reflects your skills, projects and personal brand, without
          writing code.
        </p>
      </div>
      <div className={cn(wrap, "mt-[60px]")}>
        <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {themes.filter((t) => !t.hidden).map((theme) => (
            <Link key={theme.id} href="/portfolio/themes" className={cn(landingCard, "group overflow-hidden rounded-[22px] transition-colors hover:border-brand-700/40")}>
              {/* Theme colours are user/admin data, so they're applied inline. */}
              <div aria-hidden className="px-[22px] pt-[22px]" style={{ background: theme.bg }}>
                <div className="rounded-t-xl p-3.5 shadow-[0_-4px_20px_-10px_oklch(0_0_0/0.15)]" style={{ background: theme.paper, color: theme.ink }}>
                  <div className="flex justify-between text-[9px] font-bold">
                    <span>PORTFOLIO.</span>
                    <span className="opacity-60">About · Work · Contact</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-[17px] leading-[1.1] font-bold tracking-[-0.02em]">Building ideas<br />into reality.</div>
                      <div className="mt-1 text-[9px] opacity-60">{theme.role}</div>
                      <div className="mt-2.5 h-1.5 w-[50px] rounded" style={{ background: theme.accent }} />
                    </div>
                    <div className="size-16 rounded-xl" style={{ background: `linear-gradient(135deg, ${theme.accent}, color-mix(in oklab, ${theme.accent} 35%, white))` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-[22px] py-[18px] text-left">
                <div>
                  <div className="font-semibold">{theme.name}</div>
                  <div className="mt-0.5 text-[13px] text-ink-soft">{theme.type}</div>
                </div>
                <span className="inline-flex size-9 items-center justify-center rounded-full border border-ink-200 transition-colors group-hover:border-evergreen group-hover:bg-evergreen group-hover:text-white">
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-11 flex flex-wrap justify-center gap-3">
          <Link href="/portfolio/new" className={pillClass("brand")}>Create your portfolio</Link>
          <Link href="/portfolio/themes" className={pillClass("ghost")}>Explore themes</Link>
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Full toolkit (dark bento)
// ---------------------------------------------------------------------------

const toolGroups = [
  {
    title: "Diagnose",
    tone: "dark",
    tools: [
      { icon: Stethoscope, name: "Gig Problem Doctor", desc: "Enter your impressions, clicks and orders to find where the funnel breaks.", href: "/tools/gig-doctor" },
      { icon: Image, name: "Thumbnail Tester", desc: "Check your headline at real search-card sizes on desktop and mobile.", href: "/tools/thumbnails" },
      { icon: Search, name: "Competitor Gap Finder", desc: "Compare offers side by side and spot differentiation you can own.", href: "/tools/competitors" },
    ],
  },
  {
    title: "Communicate",
    tone: "lime",
    tools: [
      { icon: MessageSquareReply, name: "Buyer Reply Coach", desc: "Turn a vague buyer message into a clear reply, and flag unsafe requests.", href: "/tools/buyer-coach" },
      { icon: PenLine, name: "Package Builder", desc: "Structure Basic, Standard and Premium packages with clear scope.", href: "/gigs/new" },
    ],
  },
  {
    title: "Grow",
    tone: "dark",
    tools: [
      { icon: FlaskConical, name: "Experiment Tracker", desc: "Record gig changes and see what actually moved your numbers.", href: "/tools/experiments" },
      { icon: Calculator, name: "Profitability Calculator", desc: "Fees, hours and costs: know your effective hourly rate.", href: "/tools/profitability" },
      { icon: ClipboardList, name: "Growth Roadmap", desc: "A short checklist from first gig to steady growth.", href: "/growth-plan" },
    ],
  },
  {
    title: "Create",
    tone: "light",
    tools: [
      { icon: Compass, name: "Service Discovery", desc: "Find services that fit your skills and goals.", href: "/discover" },
      { icon: Wand2, name: "Gig Creator", desc: "Build a complete gig from a guided flow.", href: "/gigs/new" },
      { icon: LayoutTemplate, name: "Portfolio Builder", desc: "A professional website without writing code.", href: "/portfolio/themes" },
    ],
  },
] as const

const toolTone = {
  dark: { box: "border border-white/10 bg-white/5", label: "text-lime", icon: "bg-lime/15 text-lime", desc: "text-forest-muted", hover: "hover:bg-white/[0.06]" },
  lime: { box: "bg-lime text-forest-ink", label: "text-lime-ink", icon: "bg-forest-ink text-lime", desc: "text-lime-ink", hover: "hover:bg-forest-ink/[0.06]" },
  light: { box: "bg-white text-forest-ink", label: "text-brand-700", icon: "bg-brand-100 text-brand-700", desc: "text-ink-soft", hover: "hover:bg-sage" },
}

function Tools({ disabled }: { disabled: string[] }) {
  return (
    <Section id="tools" className="overflow-hidden bg-forest text-white">
      <div aria-hidden className="absolute inset-0 bg-dots-light" />
      <Blob className="-top-40 -right-44 size-[560px] bg-brand-700 opacity-55 blur-[140px]" />
      <svg aria-hidden viewBox="0 0 300 300" className="absolute top-[90px] right-[6%] hidden size-[260px] md:block">
        <circle cx="150" cy="150" r="140" fill="none" className="stroke-lime" strokeOpacity=".25" strokeDasharray="2 8" />
        <circle cx="150" cy="150" r="96" fill="none" stroke="white" strokeOpacity=".12" />
        <circle cx="150" cy="10" r="6" className="fill-lime" />
        <circle cx="246" cy="150" r="4" fill="white" fillOpacity=".6" />
      </svg>
      <div className={wrap}>
        <Eyebrow tone="lime">The full toolkit</Eyebrow>
        <h2 className={cn(h2, "mt-[18px] max-w-[720px]")}>
          Thoughtful tools for the challenges freelancers <Accent tone="lime">actually face.</Accent>
        </h2>
        <div className="mt-14 grid gap-[18px] md:grid-cols-2 lg:grid-cols-4">
          {toolGroups
            .map((group) => ({ ...group, tools: group.tools.filter((t) => !disabled.includes(t.href)) }))
            .filter((group) => group.tools.length > 0)
            .map((group) => {
              const t = toolTone[group.tone]
              return (
                <div key={group.title} className={cn("relative overflow-hidden rounded-3xl p-3", t.box)}>
                  {group.tone === "lime" && (
                    <svg aria-hidden viewBox="0 0 120 120" className="absolute -right-[30px] -bottom-[30px] size-40 opacity-25">
                      <path d="M60 0l12 48 48 12-48 12-12 48-12-48L0 60l48-12z" className="fill-forest-ink" />
                    </svg>
                  )}
                  <h3 className={cn("relative px-4 pt-3.5 pb-1.5 text-xs font-semibold tracking-[0.14em] uppercase", t.label)}>{group.title}</h3>
                  {group.tools.map(({ icon: Icon, name, desc, href }) => (
                    <Link key={name} href={href} className={cn("relative flex items-start gap-3.5 rounded-2xl p-4 transition-colors", t.hover)}>
                      <span className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-xl", t.icon)}>
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{name}</span>
                        <span className={cn("mt-[3px] block text-sm leading-normal", t.desc)}>{desc}</span>
                      </span>
                    </Link>
                  ))}
                  {group.tone === "lime" && (
                    <div aria-hidden className="relative mx-4 mt-2 mb-4 flex flex-col gap-2 text-[13px]">
                      <div className="self-start rounded-[14px_14px_14px_4px] bg-forest-ink/10 px-3 py-[9px]">Can you do it cheaper and faster?</div>
                      <div className="self-end rounded-[14px_14px_4px_14px] bg-forest-ink px-3 py-[9px] text-white">Here’s what fits your budget…</div>
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// How it works
// ---------------------------------------------------------------------------

function GoalVisual() {
  return (
    <div className={cn(landingCard, "flex h-[230px] flex-col gap-2.5 rounded-[22px] p-[18px]")}>
      <div className="text-xs font-semibold text-ink-700">Your skills</div>
      <div className="flex flex-wrap gap-1.5">
        {["React", "Next.js", "SEO"].map((s) => <Chip key={s} className="bg-brand-100 text-brand-800">{s}</Chip>)}
      </div>
      <div className="mt-1.5 text-xs font-semibold text-ink-700">Goal</div>
      <div className="flex h-[34px] items-center rounded-[10px] border border-ink-200 px-2.5"><div className="h-1.5 w-3/5 rounded bg-ink-200" /></div>
      <div className="mt-auto h-[34px] rounded-[10px] bg-brand-700" />
    </div>
  )
}

function RecommendationsVisual() {
  const rows = [
    ["Title", "High", "bg-brand-100 text-brand-800", true],
    ["Description", "High", "bg-brand-100 text-brand-800", true],
    ["Packages", "Medium", "bg-blue-50 text-blue-800", false],
    ["Tags", "Quick fix", "bg-amber-100 text-amber-900", false],
  ] as const
  return (
    <div className={cn(landingCard, "flex h-[230px] flex-col justify-center gap-3 rounded-[22px] p-[18px]")}>
      {rows.map(([label, tag, tone, strong]) => (
        <div key={label} className="flex items-center gap-2 text-xs">
          <span className={cn("size-[7px] rounded-full", strong ? "bg-brand-700" : "bg-ink-300")} />
          <span className="w-[76px]">{label}</span>
          <span className="h-[5px] flex-1 rounded bg-ink-100" />
          <Chip className={cn("px-2 py-0.5 text-[10px]", tone)}>{tag}</Chip>
        </div>
      ))}
    </div>
  )
}

function OfferVisual() {
  return (
    <div className={cn(landingCard, "flex h-[230px] flex-col overflow-hidden rounded-[22px]")}>
      <div className="flex-1 bg-brand-50 p-[18px]">
        <div className="h-[9px] w-[55%] rounded-[5px] bg-brand-700" />
        <div className="mt-2.5 h-1.5 w-3/4 rounded bg-white" />
        <div className="mt-1.5 h-1.5 w-1/2 rounded bg-white" />
      </div>
      <div className="grid grid-cols-3 border-t border-ink-200 text-[11px] text-ink-700">
        {["Basic", "Standard", "Premium"].map((p) => (
          <div key={p} className={cn("p-3", p === "Standard" && "bg-lime-soft font-semibold")}>
            {p}
            <div className={cn("mt-2 h-1 rounded-[3px]", p === "Standard" ? "bg-lime" : "bg-ink-100")} />
          </div>
        ))}
      </div>
    </div>
  )
}

function ShowcaseVisual() {
  return (
    <div className="flex h-[230px] flex-col gap-2.5 rounded-[22px] bg-forest-ink p-3.5">
      <div className="flex items-center gap-[5px] text-[10px] text-forest-muted">
        {[0, 1, 2].map((i) => <span key={i} className="size-1.5 rounded-full bg-forest-soft" />)}
        <span className="ml-1.5">yourname.gigwise.page</span>
      </div>
      <div className="mt-1.5 flex justify-between gap-2.5">
        <div className="flex-1">
          <div className="h-[9px] w-4/5 rounded-[5px] bg-white" />
          <div className="mt-2 h-1.5 w-3/5 rounded bg-forest-soft" />
          <div className="mt-3 h-3.5 w-11 rounded-[7px] bg-lime" />
        </div>
        <div className="size-[62px] rounded-xl bg-linear-135 from-brand-500 to-lime" />
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => <div key={i} className="h-[52px] rounded-[10px] bg-forest-soft" />)}
      </div>
    </div>
  )
}

const steps = [
  { n: "01", title: "Define your goal", body: "What do you sell, who is it for, and what should change first? Set the direction in minutes.", visual: GoalVisual },
  { n: "02", title: "Get structured recommendations", body: "Clear, prioritized suggestions, not vague scores, with the reasoning behind each one.", visual: RecommendationsVisual },
  { n: "03", title: "Build or improve your offer", body: "Draft a new gig or apply targeted improvements yourself, then track the change as an experiment.", visual: OfferVisual },
  { n: "04", title: "Showcase your work", body: "Build a portfolio that feels like you, and watch the roadmap fill in.", visual: ShowcaseVisual },
]

function HowItWorks() {
  return (
    <Section id="how-it-works" className="overflow-hidden bg-sage">
      <div className={wrap}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 className={cn(h2, "mt-[18px] max-w-[640px]")}>From first idea to <Accent>finished offer.</Accent></h2>
          </div>
          <Link href="/signup" className={pillClass("dark")}>Start for free</Link>
        </div>
        <div className="relative mt-[60px]">
          <svg aria-hidden viewBox="0 0 1000 20" preserveAspectRatio="none" className="absolute top-[105px] left-[6%] hidden h-5 w-[88%] text-brand-700 lg:block">
            <path d="M0 10 H1000" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" strokeDasharray="6 8" fill="none" />
          </svg>
          <ol className="relative grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ n, title, body, visual: Visual }) => (
              <li key={n} className="min-w-0">
                <div aria-hidden><Visual /></div>
                <div className="mt-[22px] flex items-center gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-lime text-[13px] font-bold tabular-nums">{n}</span>
                  <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{title}</h3>
                </div>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

function Pricing({ plans, note }: { plans: LandingSettings["plans"]; note: string }) {
  return (
    <Section id="pricing" className="overflow-hidden bg-white">
      <div aria-hidden className="absolute top-[300px] left-1/2 h-[500px] w-[900px] -translate-x-1/2 bg-dots mask-[radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]" />
      <div className={cn(wrap, "text-center")}>
        <Eyebrow>Pricing</Eyebrow>
        <h2 className={cn(h2, "mt-[18px]")}>Simple plans that <Accent>grow with you.</Accent></h2>
        <p className={cn(lead, "mt-[18px]")}>Start free. Upgrade when the workspace earns its place.</p>
      </div>
      <div className={cn(wrap, "mt-[60px]")}>
        <div
          className={cn(
            "mx-auto grid max-w-[1080px] items-stretch gap-[22px]",
            plans.length === 1 ? "max-w-sm" : plans.length === 2 ? "max-w-3xl md:grid-cols-2" : plans.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3",
          )}
        >
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-[26px] p-8",
                plan.featured ? "bg-forest-ink text-white shadow-[0_40px_80px_-30px_oklch(0.22_0.025_173/0.55)]" : landingCard,
              )}
            >
              {plan.featured && (
                <>
                  <div aria-hidden className="absolute inset-0 bg-dots-light" />
                  <Blob className="-top-20 -right-20 size-[260px] bg-brand-700 opacity-80 blur-[80px]" />
                </>
              )}
              <div className="relative flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {plan.featured && <Chip className="bg-lime text-forest-ink">Most popular</Chip>}
              </div>
              <p className={cn("relative mt-1.5 text-sm", plan.featured ? "text-forest-muted" : "text-ink-soft")}>{plan.summary}</p>
              <div className="relative mt-[26px] flex items-baseline gap-2">
                <span className="text-[52px] leading-none font-semibold tracking-[-0.04em] tabular-nums">{plan.price}</span>
                <span className={cn("text-sm", plan.featured ? "text-forest-muted" : "text-ink-soft")}>{plan.note}</span>
              </div>
              <ul className="relative mt-[26px] mb-8 flex flex-1 flex-col gap-3 text-[15px]">
                {plan.features.map(({ label, included }) => (
                  <li key={label} className={cn("flex items-center gap-2.5", !included && (plan.featured ? "text-forest-muted" : "text-ink-soft"))}>
                    {included ? (
                      <Check className={cn("size-[18px] shrink-0", plan.featured ? "text-lime" : "text-brand-700")} aria-hidden />
                    ) : (
                      <Minus className="size-[18px] shrink-0" aria-hidden />
                    )}
                    {label}
                    {!included && <span className="sr-only"> (not included)</span>}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={pillClass(plan.featured ? "lime" : "ghost", undefined, "relative mt-auto w-full")}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        {note && <p className="mt-[30px] text-center text-[13px] text-ink-soft">{note}</p>}
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

function Faq({ faqs }: { faqs: LandingSettings["faqs"] }) {
  return (
    <Section id="faq" className="bg-sage">
      <div className={cn(wrap, "grid gap-16 lg:grid-cols-[1fr_1.6fr]")}>
        <div className="min-w-0">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className={cn(h2, "mt-[18px]")}>Straight <Accent>answers.</Accent></h2>
          <p className={cn(lead, "mt-[18px]")}>The questions freelancers ask most.</p>
          <div className={cn(landingCard, "mt-9 flex max-w-[340px] flex-col gap-3 rounded-[22px] p-6")}>
            <span className="inline-flex size-11 items-center justify-center rounded-[14px] bg-lime">
              <MessageSquare className="size-5" aria-hidden />
            </span>
            <div className="text-[17px] font-semibold">Still have a question?</div>
            <div className="text-sm leading-relaxed text-ink-soft">The quickest answer is to try it. Every tool works in the demo workspace, no account needed.</div>
            <Link href="/dashboard" className={pillClass("dark", undefined, "min-h-11 self-start")}>Open the demo</Link>
          </div>
        </div>
        <div className="min-w-0">
          {faqs.map(({ id, q, a }, i) => (
            <details key={id} open={i === 0} className="group border-b border-ink-300">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-[22px] text-lg font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-ink-100 transition-transform duration-200 group-open:rotate-45 group-open:bg-evergreen group-open:text-white">
                  <Plus className="size-4" aria-hidden />
                </span>
              </summary>
              <p className="mb-[22px] max-w-[600px] text-base leading-[1.65] text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Closing CTA & footer
// ---------------------------------------------------------------------------

function ClosingCta() {
  return (
    <section className="bg-sage pb-[72px] md:pb-[110px]">
      <div className={wrap}>
        <div className="relative overflow-hidden rounded-[36px] bg-forest px-6 py-20 text-center text-white md:px-8 md:py-24">
          <div aria-hidden className="absolute inset-0 bg-dots-light" />
          <Blob className="top-[40%] left-1/2 size-[500px] -translate-x-1/2 bg-brand-700 opacity-90 blur-[120px]" />
          <svg aria-hidden viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
            <circle cx="600" cy="250" r="230" fill="none" className="stroke-lime" strokeOpacity=".22" strokeDasharray="3 9" />
            <circle cx="600" cy="250" r="330" fill="none" stroke="white" strokeOpacity=".08" />
            <circle cx="600" cy="250" r="440" fill="none" stroke="white" strokeOpacity=".06" strokeDasharray="2 10" />
            <circle cx="370" cy="250" r="7" className="fill-lime" />
            <circle cx="900" cy="140" r="5" fill="white" fillOpacity=".7" />
            <path d="M150 90l5 18 18 5-18 5-5 18-5-18-18-5 18-5z" className="fill-lime" />
            <path d="M1040 360l4 14 14 4-14 4-4 14-4-14-14-4 14-4z" fill="white" fillOpacity=".8" />
          </svg>
          <div className="relative">
            <h2 className={cn(h2, "mx-auto max-w-[720px] md:text-[60px]")}>
              Build your next opportunity <Accent tone="lime">with confidence.</Accent>
            </h2>
            <p className={cn(lead, "mx-auto mt-[22px] max-w-[480px] text-forest-fg")}>
              From your first service idea to your professional portfolio, everything starts in one place.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/signup" className={pillClass("lime", "lg")}>Get started free <ArrowRight aria-hidden /></Link>
              <Link href="/dashboard" className={pillClass("outlineLight", "lg")}>Open the demo workspace</Link>
            </div>
            <p className="mt-6 text-[13px] text-forest-muted">Independent product, not affiliated with Fiverr.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const footerColumns = [
  { title: "Product", links: [["#features", "Features"], ["#portfolio", "Portfolio Builder"], ["#pricing", "Pricing"], ["#faq", "FAQ"]] },
  { title: "Workspace", links: [["/discover", "Discover Services"], ["/gigs/new", "Create a Gig"], ["/optimize", "Optimize Gig"], ["/dashboard", "Overview"]] },
  { title: "Account", links: [["/login", "Sign in"], ["/signup", "Create account"]] },
]

function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white pt-[72px] pb-9">
      <div className={wrap}>
        <div className="flex flex-wrap justify-between gap-12">
          <div className="max-w-[340px] flex-[1_1_280px]">
            <Logo />
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              Discover better opportunities, create stronger gigs, and showcase your best work in one calm workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-16">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">{column.title}</h3>
                <ul className="mt-3 flex flex-col gap-3 text-[15px]">
                  {column.links.map(([href, label]) => (
                    <li key={href}>
                      <Link href={href} className="text-forest-ink transition-colors hover:text-evergreen">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div aria-hidden className="mt-16 overflow-hidden text-center text-[clamp(4.5rem,15vw,10.5rem)] leading-none font-bold tracking-[-0.06em] whitespace-nowrap text-ink-100">
          gigwise<span className="font-serif font-normal text-lime italic">.</span>
        </div>
        <div className="mt-7 flex flex-wrap justify-between gap-3 border-t border-ink-200 pt-6 text-[13px] text-ink-soft">
          <span>
            Gigwise is an independent product for freelancers. It is not affiliated with, endorsed by, or connected to
            Fiverr. Fiverr is a trademark of its respective owner.
          </span>
          <span>© <CurrentYear /> Gigwise. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
