"use client"

import Link from "next/link"
import { ArrowRight, CircleCheck, FileText, FlaskConical, ListChecks, ScanText, type LucideIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { useLocalStore } from "@/lib/local-store"
import { DEFAULT_ROADMAP, ROADMAP_HINTS, ROADMAP_LINKS } from "@/lib/tools/demo-logic"
import { cn } from "@/lib/utils"

// TODO(supabase): read these from gigs / gig_audits / roadmap_tasks /
// experiments for the signed-in user instead of browser storage.

/** The one focal element: the next unfinished roadmap step. */
export function NextStepPanel() {
  const [done] = useLocalStore("tasks")
  const nextIndex = DEFAULT_ROADMAP.findIndex((_, i) => !done.includes(i))
  const finished = nextIndex === -1

  return (
    <section
      aria-labelledby="next-step"
      className="relative flex flex-col justify-between gap-8 overflow-hidden rounded-xl bg-linear-135 from-brand-700 via-brand-800 to-brand-900 p-6 text-white shadow-raised md:p-7"
    >
      <div>
        <p className="text-[13px] font-medium text-brand-200">
          {finished ? "Roadmap complete" : `Step ${nextIndex + 1} of ${DEFAULT_ROADMAP.length}`}
        </p>
        <h2 id="next-step" className="mt-2 max-w-[28ch] text-xl leading-snug font-semibold tracking-[-0.015em] md:text-2xl">
          {finished ? "You've worked through every step" : DEFAULT_ROADMAP[nextIndex]}
        </h2>
        <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-brand-100/85">
          {finished ? "Review your results and plan the next experiment." : ROADMAP_HINTS[nextIndex]}
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-5">
        <ol className="flex flex-1 gap-1.5" aria-label={`${done.length} of ${DEFAULT_ROADMAP.length} roadmap steps complete`}>
          {DEFAULT_ROADMAP.map((step, i) => (
            <li
              key={step}
              title={step}
              className={cn(
                "h-1.5 min-w-6 flex-1 rounded-full",
                done.includes(i) ? "bg-brand-300" : i === nextIndex ? "bg-white/50" : "bg-white/15",
              )}
            />
          ))}
        </ol>
        <div className="flex gap-2">
          <Link href="/growth-plan" className={cn(buttonVariants({ variant: "ghost" }), "text-white hover:bg-white/10 hover:text-white")}>
            View roadmap
          </Link>
          {!finished && (
            <Link href={ROADMAP_LINKS[nextIndex]} className={cn(buttonVariants(), "bg-paper text-brand-800 hover:bg-brand-50")}>
              Start <ArrowRight data-icon="inline-end" />
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export function AtAGlance() {
  const [drafts] = useLocalStore("drafts")
  const [audits] = useLocalStore("audits")
  const [experiments] = useLocalStore("experiments")
  const [tasks] = useLocalStore("tasks")

  const rows: { label: string; value: string | number; icon: LucideIcon; href: string }[] = [
    { label: "Gig drafts", value: drafts.length, icon: FileText, href: "/gigs/new" },
    { label: "Gig audits", value: audits.length, icon: ScanText, href: "/optimize" },
    { label: "Experiments logged", value: experiments.length, icon: FlaskConical, href: "/tools/experiments" },
    { label: "Roadmap", value: `${tasks.length}/${DEFAULT_ROADMAP.length}`, icon: ListChecks, href: "/growth-plan" },
  ]

  return (
    <section aria-labelledby="glance" className="rounded-xl border bg-card p-5 shadow-card">
      <h2 id="glance" className="text-base font-semibold">At a glance</h2>
      <p className="text-xs text-muted-foreground">Saved in this browser</p>
      <ul className="mt-3 divide-y">
        {rows.map(({ label, value, icon: Icon, href }) => (
          <li key={label}>
            <Link href={href} className="flex h-11 items-center gap-3 text-sm hover:text-primary">
              <Icon className="size-4 text-muted-foreground" aria-hidden />
              <span className="flex-1">{label}</span>
              <span className="font-semibold tabular-nums">{value}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

type Activity = { at: string; title: string; detail: string; icon: LucideIcon; href: string }

const dateFormat = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" })

export function RecentActivity() {
  const [drafts] = useLocalStore("drafts")
  const [audits] = useLocalStore("audits")
  const [experiments] = useLocalStore("experiments")

  const items: Activity[] = [
    ...drafts.map((d) => ({ at: d.createdAt, title: d.title, detail: "Gig draft created", icon: FileText, href: "/gigs/new" })),
    ...audits.map((a) => ({ at: a.createdAt, title: a.title, detail: `Audit scored ${a.score}/100`, icon: ScanText, href: "/optimize" })),
    ...experiments.map((e) => ({ at: e.createdAt, title: e.change, detail: `${e.impressions} impressions, ${e.clicks} clicks, ${e.orders} orders`, icon: FlaskConical, href: "/tools/experiments" })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed bg-card p-6">
        <CircleCheck className="size-5 text-muted-foreground" aria-hidden />
        <div>
          <p className="font-medium">Nothing here yet</p>
          <p className="text-[13px] text-muted-foreground">Drafts, audits and experiments you save will appear here.</p>
        </div>
        <Link href="/gigs/new" className={buttonVariants({ variant: "outline", size: "sm" })}>Create your first gig draft</Link>
      </div>
    )
  }

  return (
    <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-card">
      {items.map(({ at, title, detail, icon: Icon, href }) => (
        <li key={`${at}-${title}`}>
          <Link href={href} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-soft">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{title}</span>
              <span className="block truncate text-xs text-muted-foreground">{detail}</span>
            </span>
            <time dateTime={at} className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {dateFormat.format(new Date(at))}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  )
}
