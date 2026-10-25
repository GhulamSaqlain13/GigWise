"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/app/page-header"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useLocalStore } from "@/lib/local-store"
import { DEFAULT_ROADMAP, ROADMAP_HINTS, ROADMAP_LINKS } from "@/lib/tools/demo-logic"
import { cn } from "@/lib/utils"

/** Progress ring drawn from the user's real completion count. */
function ProgressRing({ value }: { value: number }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 80 80" className="size-24 -rotate-90" aria-hidden>
      <circle cx="40" cy="40" r={r} fill="none" strokeWidth="7" className="stroke-secondary" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
        className="stroke-primary transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  )
}

// TODO(supabase): growth_roadmaps + roadmap_tasks.
export default function GrowthPlanPage() {
  const [done, setDone] = useLocalStore("tasks")

  function toggle(i: number, on: boolean) {
    setDone((prev) => (on ? [...prev.filter((x) => x !== i), i] : prev.filter((x) => x !== i)))
  }

  const total = DEFAULT_ROADMAP.length
  const next = DEFAULT_ROADMAP.findIndex((_, i) => !done.includes(i))

  return (
    <>
      <PageHeader
        title="Personal growth roadmap"
        description="A clear next step beats a hundred suggestions. Progress saves in this browser."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ol className="rounded-2xl border bg-card shadow-card">
          {DEFAULT_ROADMAP.map((task, i) => {
            const isDone = done.includes(i)
            const isNext = i === next
            return (
              <li key={task} className="relative flex gap-4 border-b px-5 py-4 last:border-0">
                {/* Connector line between steps */}
                {i < total - 1 && <span className="absolute top-11 bottom-0 left-[31px] w-px bg-border" aria-hidden />}
                <label className="relative z-10 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-card">
                  <Checkbox checked={isDone} onCheckedChange={(on) => toggle(i, on)} aria-label={`Mark "${task}" as done`} />
                </label>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-medium text-ink-faint tabular-nums">Step {i + 1}</span>
                    {isNext && <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">Up next</span>}
                  </div>
                  <p className={cn("mt-0.5 text-sm font-medium", isDone ? "text-ink-faint line-through" : "text-foreground")}>{task}</p>
                  {!isDone && <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-ink-soft">{ROADMAP_HINTS[i]}</p>}
                  {!isDone && (
                    <Link
                      href={ROADMAP_LINKS[i]}
                      className={cn(buttonVariants({ variant: isNext ? "default" : "outline", size: "sm" }), "mt-3 sm:hidden")}
                    >
                      Open <ArrowRight data-icon="inline-end" />
                    </Link>
                  )}
                </div>
                {!isDone && (
                  <Link
                    href={ROADMAP_LINKS[i]}
                    className={cn(buttonVariants({ variant: isNext ? "default" : "outline", size: "sm" }), "hidden shrink-0 self-start sm:inline-flex")}
                  >
                    Open <ArrowRight data-icon="inline-end" />
                  </Link>
                )}
              </li>
            )
          })}
        </ol>

        <aside className="rounded-2xl border bg-card p-5 shadow-card lg:sticky lg:top-20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <ProgressRing value={done.length / total} />
              <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-foreground tabular-nums">
                {done.length}/{total}
              </span>
            </div>
            <div>
              <p className="font-display text-base font-semibold text-foreground" aria-live="polite">
                {next === -1 ? "Roadmap complete" : `${total - done.length} steps to go`}
              </p>
              <p className="mt-0.5 text-[13px] text-ink-soft">Work top to bottom. Each step feeds the next.</p>
            </div>
          </div>
          {next !== -1 && (
            <div className="mt-5 rounded-xl bg-secondary/60 p-3.5">
              <p className="text-[11px] font-semibold tracking-wider text-ink-faint uppercase">Next step</p>
              <p className="mt-1 text-[13px] font-medium text-foreground">{DEFAULT_ROADMAP[next]}</p>
            </div>
          )}
          <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={() => setDone([])} disabled={done.length === 0}>
            Reset plan
          </Button>
        </aside>
      </div>
    </>
  )
}
