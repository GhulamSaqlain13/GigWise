import Link from "next/link"
import {
  Activity,
  ArrowRight,
  Calculator,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  Compass,
  FilePlus2,
  FileText,
  Image,
  KeyRound,
  LayoutDashboard,
  MessagesSquare,
  PanelsTopLeft,
  Route,
  ScanSearch,
  ScanText,
  Send,
  ShieldCheck,
  TrendingUp,
  UserX,
  WandSparkles,
  type LucideIcon,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { CurrentYear } from "@/components/marketing/current-year"
import { ServiceDirectionDemo } from "@/components/marketing/service-direction-demo"
import { SiteHeader } from "@/components/marketing/site-header"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const container = "mx-auto w-full max-w-6xl px-4 md:px-6"

export default function LandingPage() {
  return (
    <div className="bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Journeys />
        <Tools />
        <TryIt />
        <HowItWorks />
        <Principles />
        <Pricing />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </div>
  )
}

function SectionHeading({ title, lead, center }: { title: string; lead?: string; center?: boolean }) {
  return (
    <div className={cn("mb-10 max-w-2xl", center && "mx-auto text-center")}>
      <h2 className="text-3xl font-semibold tracking-[-0.025em] text-balance">{title}</h2>
      {lead && <p className="mt-3 text-base leading-relaxed text-muted-foreground">{lead}</p>}
    </div>
  )
}

function Hero() {
  return (
    <section className="border-b bg-card">
      <div className={cn(container, "grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]")}>
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-[13px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand-500" aria-hidden /> For new and growing Fiverr sellers
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.035em] text-balance md:text-5xl md:leading-[1.08]">
            From your skills to a gig buyers understand
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            Find a service worth offering, write a clear gig, and see which part of your funnel needs work, using only information you choose to share.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={buttonVariants({ size: "lg" })}>Start free</Link>
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "bg-card")}>
              Open the demo workspace <ChevronRight data-icon="inline-end" />
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-[13px] text-muted-foreground">
            <ShieldCheck className="size-4 text-brand-600" aria-hidden /> No Fiverr password needed. No ranking guarantees.
          </p>
        </div>
        <ProductPreview />
      </div>
    </section>
  )
}

/** A faithful, static rendering of the real Overview screen. */
function ProductPreview() {
  const nav: [LucideIcon, string, boolean][] = [
    [LayoutDashboard, "Overview", true],
    [Compass, "Discover services", false],
    [FilePlus2, "Create a gig", false],
    [WandSparkles, "Optimize gig", false],
    [Route, "Growth roadmap", false],
    [Activity, "Gig Problem Doctor", false],
  ]
  const activity: [LucideIcon, string, string][] = [
    [FileText, "I will fix your Next.js build errors", "Gig draft created"],
    [ScanText, "I will build any website", "Content review 61/100"],
    [ChartNoAxesCombined, "Shortened thumbnail headline", "420 impressions, 9 clicks"],
  ]
  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-raised" role="img" aria-label="Preview of the Gigwise workspace overview">
      <div className="flex h-9 items-center gap-1.5 border-b bg-card px-3.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-ink-200" />
        <span className="size-2.5 rounded-full bg-ink-200" />
        <span className="size-2.5 rounded-full bg-ink-200" />
      </div>
      <div className="flex text-left" aria-hidden>
        <div className="hidden w-44 shrink-0 border-r bg-card p-3 sm:block">
          <p className="mb-1.5 px-2 text-xs text-muted-foreground">Workspace</p>
          {nav.map(([Icon, label, active]) => (
            <div key={label} className={cn("flex h-7 items-center gap-2 rounded-md px-2 text-xs", active ? "bg-brand-50 font-medium text-brand-800" : "text-ink-600")}>
              <Icon className={cn("size-3.5", active ? "text-brand-600" : "text-ink-400")} /> {label}
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1 space-y-3 p-4">
          <p className="text-sm font-semibold">Overview</p>
          <div className="rounded-lg bg-brand-800 p-4 text-white">
            <p className="text-xs text-brand-200">Step 2 of 5</p>
            <p className="mt-1 text-sm font-semibold">Create or optimize one gig</p>
            <div className="mt-4 flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={cn("h-1 flex-1 rounded-full", i === 0 ? "bg-brand-300" : i === 1 ? "bg-white/50" : "bg-white/15")} />
              ))}
            </div>
          </div>
          <div className="divide-y rounded-lg border bg-card">
            {activity.map(([Icon, title, detail]) => (
              <div key={title} className="flex items-center gap-2.5 px-3 py-2">
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-muted"><Icon className="size-3 text-ink-500" /></span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium">{title}</span>
                  <span className="block text-xs text-muted-foreground">{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Journeys() {
  const items = [
    { icon: Compass, title: "I don't know what to sell", body: "Turn your skills into specific service angles, with the reasoning and the gaps in the evidence spelled out.", href: "/discover", cta: "Find services" },
    { icon: FilePlus2, title: "I want to create a gig", body: "Build a title, description, packages and FAQs around one clear buyer problem, then edit every word.", href: "/gigs/new", cta: "Create a gig" },
    { icon: WandSparkles, title: "My gig isn't converting", body: "Paste your current gig and get a transparent content review with specific things to change.", href: "/optimize", cta: "Review a gig" },
  ]
  return (
    <section id="features" className="scroll-mt-20 py-20">
      <div className={container}>
        <SectionHeading title="Three ways to start" lead="Pick the one that matches where you are today. Each one hands off to the next when you're ready." />
        <div className="grid overflow-hidden rounded-xl border bg-card shadow-card md:grid-cols-3 md:divide-x max-md:divide-y">
          {items.map(({ icon: Icon, title, body, href, cta }) => (
            <div key={title} className="flex flex-col p-6">
              <span className="mb-4 grid size-9 place-items-center rounded-lg border bg-background text-brand-600">
                <Icon className="size-[18px]" aria-hidden />
              </span>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              <Link href={href} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover">
                {cta} <ChevronRight className="size-4" aria-hidden />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Tools() {
  const groups: { title: string; items: [LucideIcon, string, string][] }[] = [
    {
      title: "Diagnose",
      items: [
        [Activity, "Gig Problem Doctor", "Find whether views, clicks or orders are the weak point."],
        [ChartNoAxesCombined, "Experiments", "Log one change at a time and compare the numbers after it."],
        [Route, "Growth roadmap", "A short checklist of what to do next."],
      ],
    },
    {
      title: "Present",
      items: [
        [Image, "Thumbnail tester", "Check your headline at real search-card sizes."],
        [ScanSearch, "Competitor gaps", "Spot an angle the gigs you compete with don't cover."],
        [PanelsTopLeft, "Portfolio websites", "Six editable themes for showing honest sample work."],
      ],
    },
    {
      title: "Manage",
      items: [
        [MessagesSquare, "Buyer reply coach", "Reply to vague requests and flag unsafe ones."],
        [Calculator, "Profit calculator", "Your real hourly rate after fees and costs."],
        [TrendingUp, "Package pricing", "Basic, Standard and Premium tiers that scale sensibly."],
      ],
    },
  ]
  return (
    <section className="border-y bg-card py-20">
      <div className={container}>
        <SectionHeading title="Tools for the problems sellers actually have" lead="More than keyword lists. Each tool answers one practical question about your gig." />
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="mb-4 border-b pb-3 text-sm font-semibold text-brand-700">{g.title}</h3>
              <ul className="space-y-5">
                {g.items.map(([Icon, name, body]) => (
                  <li key={name} className="flex gap-3">
                    <Icon className="mt-0.5 size-[18px] shrink-0 text-ink-500" aria-hidden />
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TryIt() {
  return (
    <section id="try" className="scroll-mt-20 py-20">
      <div className={cn(container, "grid items-center gap-12 lg:grid-cols-2")}>
        <div>
          <SectionHeading
            title="Try it with your own skills"
            lead="Type what you can do and get a service direction to investigate. No account needed, and no pretending to know your odds of getting orders."
          />
          <ul className="-mt-4 space-y-3 text-sm">
            {["Narrow ideas instead of broad categories", "A clear buyer problem for each idea", "Plain notes on what the suggestion is based on"].map((t) => (
              <li key={t} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden /> {t}</li>
            ))}
          </ul>
        </div>
        <ServiceDirectionDemo />
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    ["Tell Gigwise where you are", "Start from your skills, a service idea, or a gig you already have."],
    ["Review clear suggestions", "Every suggestion explains why, shows its limits, and stays editable."],
    ["Publish and measure", "Make the changes on Fiverr yourself, then track what happens next."],
  ]
  return (
    <section id="how" className="scroll-mt-20 border-y bg-card py-20">
      <div className={container}>
        <SectionHeading title="How it works" />
        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map(([title, body], i) => (
            <li key={title} className="border-t-2 border-brand-500 pt-5">
              <p className="text-[13px] font-medium text-brand-700 tabular-nums">Step {i + 1}</p>
              <h3 className="mt-1 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Principles() {
  const items: [LucideIcon, string, string][] = [
    [KeyRound, "Never asks for your Fiverr password", "You paste content or upload screenshots. Your URL is only a reference."],
    [Send, "Never publishes or sends for you", "Gigwise prepares drafts and replies. You decide what goes live."],
    [TrendingUp, "No ranking or order guarantees", "Scores are internal checks, not Fiverr metrics or predictions."],
    [UserX, "No invented proof", "No fake reviews, clients or earnings. Demo work is labeled as a demo."],
  ]
  return (
    <section className="py-20">
      <div className={container}>
        <SectionHeading title="What Gigwise won't do" lead="Trust matters more than clever features. These rules are built into the product." />
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {items.map(([Icon, title, body]) => (
            <li key={title} className="flex gap-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700"><Icon className="size-[18px]" aria-hidden /></span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Pricing() {
  const plans = [
    { name: "Free", price: 0, blurb: "Try the tools before committing.", items: ["1 gig review", "3 service ideas", "All calculators"], featured: false },
    { name: "Starter", price: 7, blurb: "For sellers building their first offers.", items: ["5 gig reviews a month", "5 gig drafts a month", "Service opportunity reports", "Export to PDF"], featured: true },
    { name: "Pro", price: 15, blurb: "For sellers improving several gigs.", items: ["20 gig reviews a month", "20 gig drafts a month", "Experiment tracking", "Detailed reports"], featured: false },
  ]
  return (
    <section id="pricing" className="scroll-mt-20 border-y bg-card py-20">
      <div className={container}>
        <SectionHeading title="Simple pricing" lead="Proposed plans. Paid plans aren't available yet, so everything is free while Gigwise is in early access." />
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div key={p.name} className={cn("flex flex-col rounded-xl border bg-card p-6", p.featured && "border-brand-500 ring-1 ring-brand-500")}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                {p.featured && <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">Most popular</span>}
              </div>
              <p className="mt-3 text-4xl font-semibold tracking-tight tabular-nums">
                ${p.price}<span className="text-sm font-normal text-muted-foreground"> / month</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{p.blurb}</p>
              <ul className="my-6 flex-1 space-y-2.5 text-sm">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden /> {i}</li>
                ))}
              </ul>
              <Link href="/signup" className={cn(buttonVariants({ variant: p.featured ? "default" : "outline" }), "w-full")}>Start free</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const faqs = [
    ["Does Gigwise guarantee Fiverr orders or ranking?", "No. No tool can guarantee orders or search placement. Gigwise gives practical recommendations based on the information you provide."],
    ["Can I use it without an existing Fiverr gig?", "Yes. Start from your skills, explore service ideas, and draft a gig before publishing anything."],
    ["Can it read my gig from its URL?", "No. The URL is stored as a reference only. Paste your gig content or upload screenshots instead."],
    ["Will Gigwise change my gig on Fiverr?", "Never. It prepares editable drafts and suggestions. You review them and publish the changes yourself."],
    ["Is the analysis done by AI?", "The current tools use transparent rules and templates, and every result is labeled that way. AI analysis is planned and will be labeled too."],
  ]
  return (
    <section id="faq" className="scroll-mt-20 py-20">
      <div className={cn(container, "grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]")}>
        <SectionHeading title="Questions" lead="Can't find what you're looking for? Try the demo workspace. No account needed." />
        <div className="divide-y border-y">
          {faqs.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90" aria-hidden />
              </summary>
              <p className="mt-2 pr-8 text-sm leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="pb-20">
      <div className={container}>
        <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-brand-900 px-6 py-10 text-white md:flex-row md:items-center md:px-10">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Know what to improve next</h2>
            <p className="mt-2 max-w-md text-brand-100/80">Start with your skills or an existing gig. It takes a couple of minutes.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "bg-paper text-brand-900 hover:bg-brand-50")}>Start free</Link>
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg", variant: "ghost" }), "text-white hover:bg-white/10 hover:text-white")}>
              Open demo <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t bg-card py-10">
      <div className={cn(container, "flex flex-col gap-6 md:flex-row md:items-start md:justify-between")}>
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-[13px] text-muted-foreground">
            A workspace for finding, creating and improving freelance services. Independent and not affiliated with Fiverr.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
          <Link href="/login" className="hover:text-foreground">Sign in</Link>
        </nav>
      </div>
      <p className={cn(container, "mt-8 text-xs text-muted-foreground")}>© <CurrentYear /> Gigwise</p>
    </footer>
  )
}
