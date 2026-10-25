"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight, Check, Compass, FileCheck2, FlaskConical, Globe, Info, PenLine, Sparkles, type LucideIcon } from "lucide-react"
import { useLocalStore } from "@/lib/local-store"
import { useThemes } from "@/components/portfolio/themes-context"
import { DEFAULT_ROADMAP, ROADMAP_LINKS } from "@/lib/tools/demo-logic"
import { cn } from "@/lib/utils"

// TODO(supabase): read these from gigs / gig_audits / roadmap_tasks /
// experiments / portfolio_projects for the signed-in user instead of browser storage.

const card = "rounded-[20px] border bg-card"
const darkBtn = "flex h-11 items-center justify-center gap-2 rounded-xl bg-pine px-5 text-sm font-bold text-white transition-colors hover:bg-pine-soft"
const lightBtn = "flex h-11 items-center rounded-xl border border-brand-200 bg-card px-[18px] text-sm font-semibold text-foreground transition-colors hover:bg-ink-25"

/** Colour families shared by next steps and stats (icon tile, chip, wave). */
const tones = {
  blue: { tile: "bg-blue-50 text-blue-700", chip: "bg-blue-50 text-blue-700", wave: "fill-blue-50" },
  green: { tile: "bg-brand-50 text-brand-600", chip: "bg-brand-50 text-brand-700", wave: "fill-brand-50" },
  amber: { tile: "bg-amber-50 text-amber-800", chip: "bg-amber-50 text-amber-800", wave: "fill-amber-50" },
  violet: { tile: "bg-violet-50 text-violet-700", chip: "bg-violet-50 text-violet-700", wave: "fill-violet-50" },
}

function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold tracking-[-0.01em] text-foreground">{children}</h2>
      {action}
    </div>
  )
}

function StatusBadge({ status }: { status: "draft" | "published" | "saved" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        status === "published" ? "bg-lime/40 text-pine" : "bg-brand-50 text-brand-700",
      )}
    >
      {status}
    </span>
  )
}

type Row = { key: string; at: string; title: string; detail: string; icon: LucideIcon; href: string; status?: "draft" | "published" | "saved" }

export function OverviewColumns() {
  const [drafts] = useLocalStore("drafts")
  const [audits] = useLocalStore("audits")
  const [experiments] = useLocalStore("experiments")
  const [tasks] = useLocalStore("tasks")
  const [portfolios] = useLocalStore("portfolios")
  const { getTheme } = useThemes()

  const rows: Row[] = [
    ...drafts.map((d) => ({ key: `d-${d.createdAt}`, at: d.createdAt, title: d.title || "Untitled gig draft", detail: "Gig draft", icon: PenLine, href: "/gigs/new", status: "draft" as const })),
    ...audits.map((a) => ({ key: `a-${a.createdAt}`, at: a.createdAt, title: a.title || "Gig review", detail: `Saved audit, scored ${a.score}/100`, icon: FileCheck2, href: "/optimize", status: "saved" as const })),
    ...experiments.map((e) => ({ key: `e-${e.createdAt}`, at: e.createdAt, title: e.change, detail: `Experiment with ${e.impressions} impressions`, icon: FlaskConical, href: "/tools/experiments" })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5)

  const portfolio = portfolios[0]

  const nextSteps = [
    { label: "Discover a service worth offering", tag: "Discovery", icon: Compass, tone: tones.blue, href: "/discover", done: drafts.length + audits.length > 0 },
    { label: "Draft your first gig", tag: "Gigs", icon: PenLine, tone: tones.green, href: "/gigs/new", done: drafts.length > 0 },
    { label: "Review an existing gig", tag: "Audit", icon: Sparkles, tone: tones.amber, href: "/optimize", done: audits.length > 0 },
    { label: "Build your portfolio website", tag: "Portfolio", icon: Globe, tone: tones.violet, href: "/portfolio/new", done: portfolios.length > 0 },
  ]
  const stepsDone = nextSteps.filter((s) => s.done).length

  const stats = [
    { label: "Gig drafts", value: drafts.length, icon: PenLine, tone: tones.green, href: "/gigs/new" },
    { label: "Saved audits", value: audits.length, icon: FileCheck2, tone: tones.amber, href: "/optimize" },
    { label: "Experiments", value: experiments.length, icon: FlaskConical, tone: tones.blue, href: "/tools/experiments" },
    { label: "Portfolios", value: portfolios.length, icon: Globe, tone: tones.violet, href: "/portfolio" },
  ]

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
      <div className="min-w-0 space-y-6">
        <section className="space-y-3">
          <SectionTitle action={<span className="text-[12.5px] text-ink-soft">Recent work</span>}>Continue where you left off</SectionTitle>
          {rows.length === 0 && !portfolio ? (
            <div className={cn(card, "relative flex flex-col items-center gap-3 overflow-hidden px-7 py-9 text-center")}>
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(var(--color-ink-100)_1px,transparent_1px),linear-gradient(90deg,var(--color-ink-100)_1px,transparent_1px)] bg-size-[28px_28px] opacity-60" />
              <EmptyArt />
              <h3 className="relative mt-1 text-[19px] font-bold">Nothing in progress yet</h3>
              <p className="relative max-w-[380px] text-sm leading-relaxed text-ink-soft">
                Draft a gig, run a review, or start a portfolio. Your recent work will appear here so you can pick it back up.
              </p>
              <div className="relative mt-1.5 flex flex-wrap justify-center gap-2.5">
                <Link href="/discover" className={darkBtn}>Start with service discovery</Link>
                <Link href="/gigs/new" className={lightBtn}>Draft a gig</Link>
              </div>
            </div>
          ) : (
            <div className={cn(card, "space-y-1 p-2")}>
              {rows.map(({ key, title, detail, icon: Icon, href, status }) => (
                <ActivityRow key={key} href={href} icon={Icon} title={title} detail={detail} badge={status && <StatusBadge status={status} />} />
              ))}
              {portfolio && (
                <ActivityRow
                  href="/portfolio/editor"
                  icon={Globe}
                  title={portfolio.name}
                  detail={`${getTheme(portfolio.theme).name} theme`}
                  badge={<StatusBadge status={portfolio.published ? "published" : "draft"} />}
                />
              )}
            </div>
          )}
        </section>

        <section className={cn(card, "space-y-4 p-[22px]")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold tracking-[-0.01em]">Recommended next steps</h2>
              <span className="text-[13px] text-ink-soft">{stepsDone} of {nextSteps.length} complete</span>
            </div>
            <div className="h-2 w-[180px] overflow-hidden rounded-full bg-ink-100" role="progressbar" aria-valuemin={0} aria-valuemax={nextSteps.length} aria-valuenow={stepsDone} aria-label="Next steps complete">
              <div className="h-full rounded-full bg-evergreen transition-all" style={{ width: `${Math.max(4, (stepsDone / nextSteps.length) * 100)}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {nextSteps.map(({ label, tag, icon: Icon, tone, href, done }) => (
              <Link key={label} href={href} className="flex items-center gap-3.5 rounded-[14px] p-3 transition-colors hover:bg-ink-25">
                <span
                  className={cn("grid size-5 shrink-0 place-items-center rounded-md border-2", done ? "border-evergreen bg-evergreen" : "border-ink-300")}
                  aria-hidden
                >
                  {done && <Check className="size-3 text-white" strokeWidth={3} />}
                </span>
                <span className={cn("grid size-[38px] shrink-0 place-items-center rounded-xl", tone.tile)}>
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span className={cn("min-w-0 flex-1 text-[14.5px] font-semibold", done && "text-ink-soft line-through")}>
                  {label}
                  {done && <span className="sr-only"> (done)</span>}
                </span>
                <span className={cn("hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:inline", tone.chip)}>{tag}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="min-w-0 space-y-6">
        <Roadmap done={tasks} />

        <section className="space-y-3">
          <SectionTitle>Workspace</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ label, value, icon: Icon, tone, href }) => (
              <Link key={label} href={href} className="relative flex flex-col gap-2.5 overflow-hidden rounded-[18px] border bg-card p-4 transition-colors hover:border-evergreen/40">
                <svg aria-hidden viewBox="0 0 90 40" className="absolute right-0 bottom-0 h-10 w-[90px]">
                  <path d="M0 40 L0 30 Q 20 34 35 24 T 70 14 T 90 8 L 90 40 Z" className={tone.wave} />
                </svg>
                <span className={cn("grid size-[34px] place-items-center rounded-[10px]", tone.tile)}>
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="relative text-[28px] leading-none font-extrabold tracking-[-0.02em] tabular-nums">{value}</span>
                <span className="relative text-[13px] text-ink-soft">{label}</span>
              </Link>
            ))}
          </div>
          <p className="flex items-center gap-1.5 text-[12.5px] text-ink-soft">
            <Info className="size-3.5 shrink-0" aria-hidden /> Saved in this browser until account sync is connected.
          </p>
        </section>
      </div>
    </div>
  )
}

function ActivityRow({ href, icon: Icon, title, detail, badge }: { href: string; icon: LucideIcon; title: string; detail: string; badge?: ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3.5 rounded-[14px] p-3 transition-colors hover:bg-ink-25">
      <span className="grid size-[38px] shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="size-[18px]" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14.5px] font-semibold text-foreground">{title}</span>
        <span className="block truncate text-[12.5px] text-ink-soft">{detail}</span>
      </span>
      {badge}
      <ArrowRight className="size-4 shrink-0 text-ink-soft" aria-hidden />
    </Link>
  )
}

function Roadmap({ done }: { done: number[] }) {
  const total = DEFAULT_ROADMAP.length
  const next = DEFAULT_ROADMAP.findIndex((_, i) => !done.includes(i))
  const circumference = 2 * Math.PI * 26
  const filled = done.length / total
  return (
    <section className={cn(card, "space-y-[18px] p-[22px]")}>
      <SectionTitle action={<Link href="/growth-plan" className="text-[13px] font-bold text-evergreen hover:text-pine">Open</Link>}>
        Growth roadmap
      </SectionTitle>
      <div className="flex items-center gap-4 rounded-2xl bg-brand-50/70 p-3.5">
        <svg viewBox="0 0 64 64" className="size-16 shrink-0" role="img" aria-label={`${done.length} of ${total} roadmap steps done`}>
          <circle cx="32" cy="32" r="26" fill="none" className="stroke-brand-100" strokeWidth="7" />
          <circle
            cx="32" cy="32" r="26" fill="none" className="stroke-evergreen transition-all" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={circumference * (1 - Math.max(filled, 0.02))} transform="rotate(-90 32 32)"
          />
          <text x="32" y="37" textAnchor="middle" className="fill-foreground font-display text-[15px] font-extrabold">{done.length}/{total}</text>
        </svg>
        <div className="flex flex-col gap-1">
          <span className="text-[14.5px] font-bold">
            {done.length === 0 ? "No steps done yet" : next === -1 ? "Roadmap complete" : `${done.length} of ${total} steps done`}
          </span>
          <span className="text-[13px] leading-normal text-ink-soft">
            {next === -1 ? "Plan your next experiment from the roadmap." : "Start the roadmap to structure your next moves."}
          </span>
        </div>
      </div>
      <ol className="flex flex-col">
        {DEFAULT_ROADMAP.map((step, i) => {
          const isDone = done.includes(i)
          const isNext = i === next
          const last = i === total - 1
          return (
            <li key={step} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-extrabold",
                    isDone ? "bg-evergreen text-white" : isNext ? "bg-pine text-lime" : "border-2 border-ink-300 font-bold text-ink-soft",
                  )}
                >
                  {isDone ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
                </span>
                {!last && <span aria-hidden className="min-h-[18px] w-0.5 flex-1 bg-brand-100" />}
              </div>
              <Link href={ROADMAP_LINKS[i]} className={cn("flex flex-col gap-0.5 pt-[3px] hover:text-evergreen", !last && "pb-4")}>
                <span className={cn("text-sm", isNext ? "font-bold" : "font-semibold", isDone ? "text-ink-soft line-through" : !isNext && "text-ink-700")}>
                  {step}
                  {isDone && <span className="sr-only"> (done)</span>}
                </span>
                {isNext && <span className="text-[12.5px] text-ink-soft">Up next</span>}
              </Link>
            </li>
          )
        })}
      </ol>
      {next !== -1 && (
        <Link href={ROADMAP_LINKS[next]} className={darkBtn}>
          Start step {next + 1} <ArrowRight className="size-[15px]" aria-hidden />
        </Link>
      )}
    </section>
  )
}

/** Empty-state sketch for "Continue where you left off". */
function EmptyArt() {
  return (
    <svg aria-hidden viewBox="0 0 220 140" className="relative h-[140px] w-[220px]">
      <ellipse cx="110" cy="128" rx="80" ry="8" className="fill-ink-100" />
      <rect x="38" y="30" width="96" height="88" rx="12" className="fill-ink-25 stroke-brand-100" strokeWidth="1.5" transform="rotate(-8 86 74)" />
      <rect x="70" y="20" width="100" height="100" rx="14" className="fill-white stroke-brand-200" strokeWidth="1.5" />
      <rect x="82" y="34" width="76" height="34" rx="8" className="fill-brand-100" />
      <circle cx="96" cy="51" r="8" className="fill-brand-600" />
      <rect x="110" y="46" width="38" height="10" rx="5" className="fill-lime" />
      <rect x="82" y="78" width="60" height="7" rx="3.5" className="fill-brand-100" />
      <rect x="82" y="92" width="44" height="7" rx="3.5" className="fill-ink-100" />
      <circle cx="170" cy="104" r="20" className="fill-pine" />
      <path d="M170 96v16M162 104h16" className="stroke-lime" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 16l2.4 6.2L52 24l-5.6 1.8L44 32l-2.4-6.2L36 24l5.6-1.8z" className="fill-amber-300" />
      <circle cx="192" cy="40" r="4" className="fill-lime" />
      <circle cx="28" cy="96" r="3" className="fill-brand-600" />
    </svg>
  )
}
