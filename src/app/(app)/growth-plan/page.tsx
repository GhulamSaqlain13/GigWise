"use client"

import { PageHeader } from "@/components/app/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useLocalStore } from "@/lib/local-store"
import { DEFAULT_ROADMAP } from "@/lib/tools/demo-logic"

// TODO(supabase): growth_roadmaps + roadmap_tasks.
export default function GrowthPlanPage() {
  const [done, setDone] = useLocalStore("tasks")

  function toggle(i: number, on: boolean) {
    setDone((prev) => (on ? [...prev.filter((x) => x !== i), i] : prev.filter((x) => x !== i)))
  }

  const pct = Math.round((done.length / DEFAULT_ROADMAP.length) * 100)

  return (
    <>
      <PageHeader
        section="Workspace"
        title="Personal growth roadmap"
        description="A clear next step beats a hundred suggestions. Progress saves in this browser."
      />
      <Card className="max-w-[850px] gap-0 px-5">
        <ul>
          {DEFAULT_ROADMAP.map((task, i) => (
            <li key={task} className="border-b last:border-0">
              <label className="flex min-h-11 cursor-pointer items-center gap-3 py-3.5">
                <Checkbox checked={done.includes(i)} onCheckedChange={(on) => toggle(i, on)} />
                <span className={done.includes(i) ? "text-muted-foreground line-through" : ""}>{task}</span>
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-2 h-[7px] overflow-hidden rounded-full bg-ink-100">
          <span className="block h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground" aria-live="polite">
            {done.length} of {DEFAULT_ROADMAP.length} completed
          </span>
          <Button variant="secondary" onClick={() => setDone([])}>Reset plan</Button>
        </div>
      </Card>
    </>
  )
}
