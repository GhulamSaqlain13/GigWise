import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Compass, LayoutDashboard, Map as MapIcon, PenLine, Sparkles, TrendingUp } from "lucide-react"
import { disabledHrefs } from "@/lib/nav"
import { getSiteSettings } from "@/lib/site/store"
import { cn } from "@/lib/utils"
import { OverviewColumns } from "./overview-widgets"

export const metadata: Metadata = { title: "Overview" }

// Overview follows the "Gigwise Dashboard Redesign" ref: dark pine hero,
// colour-coded quick actions, activity + roadmap columns, portfolio promo.

const quickActions = [
  { icon: Sparkles, title: "Optimize a Gig", hint: "Review before changing", href: "/optimize", tile: "bg-amber-300 text-amber-950", glow: "bg-amber-50" },
  { icon: PenLine, title: "Create a Gig", hint: "Turn expertise into an offer", href: "/gigs/new", tile: "bg-brand-600 text-white", glow: "bg-brand-50" },
  { icon: Compass, title: "Discover Services", hint: "Find what to sell", href: "/discover", tile: "bg-blue-600 text-white", glow: "bg-blue-50" },
  { icon: LayoutDashboard, title: "Create Portfolio", hint: "Show your best work", href: "/portfolio/new", tile: "bg-violet-600 text-white", glow: "bg-violet-50" },
]

export default async function DashboardPage() {
  const off = disabledHrefs((await getSiteSettings()).tools)
  const on = (href: string) => !off.includes(href)
  return (
    <div className="space-y-7">
      <Hero discover={on("/discover")} roadmap={on("/growth-plan")} />

      <section aria-label="Quick actions" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {quickActions.filter((a) => on(a.href)).map(({ icon: Icon, title, hint, href, tile, glow }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col gap-3.5 overflow-hidden rounded-[20px] border bg-card p-4 transition sm:p-5-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_14px_32px_-14px_oklch(0.318_0.054_170/0.28)]"
          >
            <span aria-hidden className={cn("absolute -top-[34px] -right-[34px] size-[110px] rounded-full", glow)} />
            <span className={cn("relative grid size-12 place-items-center rounded-[14px]", tile)}>
              <Icon className="size-[22px]" aria-hidden />
            </span>
            <span className="relative flex flex-col gap-1">
              <span className="text-base font-bold text-foreground">{title}</span>
              <span className="text-[13.5px] text-ink-soft">{hint}</span>
            </span>
            <span className="relative flex items-center gap-1.5 text-[13px] font-bold text-evergreen">
              Open tool <ArrowUpRight className="size-3.5" aria-hidden />
            </span>
          </Link>
        ))}
      </section>

      <OverviewColumns />

      {on("/portfolio/themes") && <PortfolioPromo editor={on("/portfolio/editor")} />}
    </div>
  )
}

function Hero({ discover, roadmap }: { discover: boolean; roadmap: boolean }) {
  return (
    <section className="relative flex flex-wrap overflow-hidden rounded-3xl bg-pine text-white">
      <div aria-hidden className="absolute -bottom-10 -left-5 h-[200px] w-[260px] bg-[radial-gradient(var(--color-lime)_1.6px,transparent_1.7px)] bg-size-[16px_16px] opacity-20" />
      <div aria-hidden className="absolute -top-[190px] -right-[140px] size-[520px] rounded-full border border-lime/20" />
      <div aria-hidden className="absolute -top-[120px] -right-[70px] size-[380px] rounded-full border border-lime/25" />
      <div aria-hidden className="absolute -top-[50px] right-0 size-[240px] rounded-full bg-pine-soft" />

      <div className="relative flex min-w-0 flex-[1_1_380px] flex-col gap-[18px] p-7 md:p-10">
        <span className="flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1.5 text-[12.5px] font-semibold text-brand-50">
          <span className="size-2 rounded-full bg-lime" aria-hidden />
          Your freelance HQ
        </span>
        <h1 className="text-[clamp(2rem,3.6vw,2.75rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance">
          Welcome back. Let’s grow your{" "}
          <span className="font-serif font-normal tracking-[-0.01em] text-lime italic">freelance business.</span>
        </h1>
        <p className="max-w-[460px] text-base leading-relaxed text-forest-fg">
          Here’s where your business stands today. Find a service worth selling, shape it into a gig, and give it a home
          in your portfolio.
        </p>
        <div className="mt-1.5 flex flex-wrap gap-3">
          {discover && (
            <Link href="/discover" className="flex h-12 items-center gap-2 rounded-[14px] bg-lime px-[22px] text-[15px] font-bold text-pine transition-transform hover:-translate-y-px">
              Start with service discovery <ArrowRight className="size-4" aria-hidden />
            </Link>
          )}
          {roadmap && (
            <Link href="/growth-plan" className="flex h-12 items-center gap-2 rounded-[14px] border border-white/30 px-5 text-[15px] font-semibold text-white transition-colors hover:bg-white/15">
              <MapIcon className="size-4" aria-hidden /> Open your growth roadmap
            </Link>
          )}
        </div>
      </div>

      <HeroArt />
    </section>
  )
}

/** Decorative composition: gig card, growth line, progress ring. Labels only, no numbers. */
function HeroArt() {
  return (
    <div aria-hidden className="relative hidden min-h-[330px] flex-[1_1_380px] overflow-hidden md:block">
      <div className="absolute top-[46px] left-10 w-[230px] -rotate-4 rounded-[18px] bg-white p-3 text-foreground shadow-[0_30px_60px_-20px_oklch(0_0_0/0.5)]">
        <div className="relative h-[104px] overflow-hidden rounded-xl bg-brand-100">
          <div className="absolute -bottom-10 -left-5 size-[90px] rounded-full bg-brand-600" />
          <div className="absolute top-[18px] right-[22px] size-14 rotate-[18deg] rounded-[14px] bg-lime" />
          <div className="absolute top-[22px] left-[88px] size-[22px] rounded-full bg-amber-300" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="size-[22px] rounded-full bg-pine" />
          <div className="h-2 w-20 rounded bg-ink-200" />
        </div>
        <div className="mt-3 h-2.5 w-[92%] rounded-[5px] bg-foreground/85" />
        <div className="mt-[7px] h-2.5 w-[64%] rounded-[5px] bg-foreground/85" />
        <div className="mt-3.5 flex items-center justify-between">
          <div className="h-2 w-16 rounded bg-ink-200" />
          <div className="h-[18px] w-[54px] rounded-md bg-brand-50" />
        </div>
      </div>

      <div className="absolute top-[34px] right-[34px] w-[196px] rotate-3 rounded-2xl bg-white px-3.5 pt-3.5 pb-2.5 text-foreground shadow-[0_24px_50px_-20px_oklch(0_0_0/0.5)]">
        <div className="flex items-center gap-2">
          <span className="grid size-[26px] place-items-center rounded-lg bg-brand-50">
            <TrendingUp className="size-3.5 text-brand-600" />
          </span>
          <span className="text-xs font-bold">Growth</span>
        </div>
        <svg viewBox="0 0 168 64" className="mt-2 block h-16 w-[168px]">
          <path d="M0 54 C 22 50, 30 40, 48 42 S 78 26, 96 30 S 128 12, 146 14 S 160 6, 168 4 L 168 64 L 0 64 Z" className="fill-brand-50" />
          <path d="M0 54 C 22 50, 30 40, 48 42 S 78 26, 96 30 S 128 12, 146 14 S 160 6, 168 4" fill="none" className="stroke-brand-600" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="146" cy="14" r="5" className="fill-lime stroke-pine" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute right-[70px] bottom-[34px] flex w-[210px] items-center gap-3 rounded-2xl border border-lime/25 bg-pine-soft p-3.5 shadow-[0_24px_50px_-20px_oklch(0_0_0/0.6)]">
        <svg viewBox="0 0 52 52" className="size-[52px]">
          <circle cx="26" cy="26" r="21" fill="none" stroke="white" strokeOpacity=".15" strokeWidth="6" />
          <circle cx="26" cy="26" r="21" fill="none" className="stroke-lime" strokeWidth="6" strokeLinecap="round" strokeDasharray="132" strokeDashoffset="44" transform="rotate(-90 26 26)" />
        </svg>
        <div className="flex flex-col gap-1.5">
          <div className="h-2 w-24 rounded bg-white/75" />
          <div className="h-2 w-16 rounded bg-white/30" />
        </div>
      </div>

      <div className="absolute bottom-[54px] left-[230px] grid size-11 -rotate-10 place-items-center rounded-[14px] bg-lime shadow-[0_14px_30px_-10px_oklch(0_0_0/0.5)]">
        <Sparkles className="size-[22px] text-pine" />
      </div>
      <div className="absolute bottom-10 left-6 size-3.5 rounded-full bg-amber-300" />
      <div className="absolute top-[170px] right-[22px] size-2 rounded-full bg-lime" />
    </div>
  )
}

function PortfolioPromo({ editor }: { editor: boolean }) {
  return (
    <section className="relative flex flex-wrap items-center gap-6 overflow-hidden rounded-3xl bg-brand-100/70 p-6 md:p-8">
      <div aria-hidden className="absolute -bottom-[170px] -left-[120px] size-[300px] rounded-full bg-brand-200/50" />
      <div className="relative flex min-w-0 flex-[1_1_300px] flex-col gap-3">
        <span className="self-start rounded-full bg-white px-3 py-1.5 text-xs font-bold tracking-[0.06em] text-brand-700">PORTFOLIO WEBSITES</span>
        <h2 className="text-[30px] leading-[1.15] font-extrabold tracking-[-0.025em] text-balance">
          Give your gigs a home that <span className="font-serif font-normal text-brand-600 italic">earns trust.</span>
        </h2>
        <p className="max-w-[420px] text-[14.5px] leading-relaxed text-ink-600">
          Pick a theme, drop in your best work, and edit everything visually. No code needed.
        </p>
        <div className="mt-1 flex flex-wrap gap-2.5">
          <Link href="/portfolio/themes" className="flex h-11 items-center rounded-xl bg-pine px-5 text-sm font-bold text-white hover:bg-pine-soft">Explore themes</Link>
          {editor && (
            <Link href="/portfolio/editor" className="flex h-11 items-center rounded-xl bg-white px-[18px] text-sm font-semibold text-foreground hover:bg-ink-25">Open visual editor</Link>
          )}
        </div>
      </div>
      <div aria-hidden className="relative hidden min-h-[200px] flex-[1_1_420px] items-end justify-center gap-3.5 sm:flex">
        <div className="flex h-[180px] w-[150px] translate-y-2 -rotate-5 flex-col gap-[7px] rounded-[14px] bg-white p-2.5 shadow-[0_18px_36px_-18px_oklch(0.318_0.054_170/0.45)]">
          <Dots first="bg-amber-300" />
          <div className="relative h-[70px] overflow-hidden rounded-lg bg-amber-50"><div className="absolute -right-2.5 -bottom-3.5 size-[50px] rounded-full bg-amber-300" /></div>
          <div className="h-[7px] w-4/5 rounded bg-foreground" />
          <div className="h-1.5 w-3/5 rounded bg-ink-200" />
          <div className="mt-auto grid grid-cols-3 gap-1">{[0, 1, 2].map((i) => <div key={i} className="h-[26px] rounded-[5px] bg-amber-50" />)}</div>
        </div>
        <div className="relative z-[1] flex h-[208px] w-[170px] flex-col gap-2 rounded-[14px] bg-pine p-2.5 shadow-[0_24px_44px_-18px_oklch(0.318_0.054_170/0.6)]">
          <Dots first="bg-lime" rest="bg-white/25" />
          <div className="mt-1.5 h-2 w-[70%] rounded bg-white" />
          <div className="h-2 w-1/2 rounded bg-lime" />
          <div className="h-1.5 w-[84%] rounded bg-white/30" />
          <div className="mt-0.5 h-[18px] w-14 rounded-md bg-lime" />
          <div className="mt-auto grid grid-cols-2 gap-1.5"><div className="h-[52px] rounded-lg bg-brand-600" /><div className="h-[52px] rounded-lg bg-pine-soft" /></div>
        </div>
        <div className="flex h-[180px] w-[150px] translate-y-2 rotate-5 flex-col gap-[7px] rounded-[14px] bg-white p-2.5 shadow-[0_18px_36px_-18px_oklch(0.318_0.054_170/0.45)]">
          <Dots first="bg-violet-600" />
          <div className="mt-1 flex items-center gap-2">
            <div className="size-[34px] rounded-full border-[3px] border-violet-600 bg-violet-50" />
            <div className="flex flex-1 flex-col gap-1"><div className="h-1.5 w-[90%] rounded bg-foreground" /><div className="h-[5px] w-3/5 rounded bg-ink-200" /></div>
          </div>
          <div className="mt-1 h-1.5 w-full rounded bg-violet-50" />
          <div className="h-1.5 w-4/5 rounded bg-violet-50" />
          <div className="relative mt-auto h-[50px] overflow-hidden rounded-lg bg-violet-50"><div className="absolute top-2.5 left-2.5 size-[30px] rotate-12 rounded-lg bg-violet-600" /></div>
        </div>
      </div>
    </section>
  )
}

function Dots({ first, rest = "bg-ink-200" }: { first: string; rest?: string }) {
  return (
    <div className="flex gap-1">
      <div className={cn("size-1.5 rounded-full", first)} />
      <div className={cn("size-1.5 rounded-full", rest)} />
      <div className={cn("size-1.5 rounded-full", rest)} />
    </div>
  )
}
