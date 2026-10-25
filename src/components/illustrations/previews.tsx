import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Small, decorative sketches of what a tool produces. One visual language:
// white mini cards, hairline borders, neutral skeleton bars and a single
// emerald accent. They show the *shape* of a result with labels only, never
// numbers, so they can't be mistaken for real data. Always aria-hidden.

function Bar({ w, className }: { w: string; className?: string }) {
  return <span className={cn("block h-1.5 rounded-full bg-ink-100", className)} style={{ width: w }} />
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border bg-card p-2.5 shadow-card", className)}>{children}</div>
}

function Label({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("text-[10px] leading-none font-medium text-ink-faint", className)}>{children}</span>
}

function Pill({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] leading-none font-medium whitespace-nowrap",
        accent ? "bg-accent text-accent-foreground" : "bg-secondary text-ink-soft",
      )}
    >
      {children}
    </span>
  )
}

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none mx-auto w-full max-w-[260px] text-left select-none", className)}>
      {children}
    </div>
  )
}

/** Mini browser window, shared by portfolio, 404 and landing vignettes. */
export function MiniWindow({ path, children, className }: { path?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border bg-card shadow-card", className)}>
      <div className="flex h-5 items-center gap-1 border-b bg-secondary/60 px-2">
        <span className="size-1.5 rounded-full bg-border-strong" />
        <span className="size-1.5 rounded-full bg-border-strong" />
        <span className="size-1.5 rounded-full bg-border-strong" />
        {path && <span className="ml-1.5 truncate text-[9px] text-ink-faint">{path}</span>}
      </div>
      <div className="p-2.5">{children}</div>
    </div>
  )
}

export function IdeasPreview() {
  return (
    <Frame className="space-y-2">
      {[true, false].map((first) => (
        <Card key={String(first)} className={first ? "" : "translate-x-3 opacity-70"}>
          <div className="flex items-center justify-between gap-2">
            <Bar w="60%" className="h-2 bg-ink-300" />
            <Pill accent={first}>Skill match</Pill>
          </div>
          <Label className="mt-2 block">Buyer problem</Label>
          <div className="mt-1.5 space-y-1">
            <Bar w="92%" />
            <Bar w="70%" />
          </div>
        </Card>
      ))}
    </Frame>
  )
}

export function GigPreview() {
  return (
    <Frame>
      <Card className="p-0">
        <div className="flex h-14 items-end rounded-t-lg bg-accent p-2">
          <Bar w="55%" className="h-2 bg-primary/40" />
        </div>
        <div className="space-y-1 p-2.5">
          <Bar w="88%" className="h-2 bg-ink-300" />
          <Bar w="64%" />
        </div>
        <div className="grid grid-cols-3 divide-x border-t">
          {["Basic", "Standard", "Premium"].map((tier, i) => (
            <div key={tier} className={cn("space-y-1 p-2", i === 1 && "bg-accent/40")}>
              <Label className={i === 1 ? "text-accent-foreground" : ""}>{tier}</Label>
              <Bar w="80%" />
              <Bar w="55%" />
            </div>
          ))}
        </div>
      </Card>
    </Frame>
  )
}

export function AuditPreview() {
  return (
    <Frame>
      <Card className="divide-y p-0">
        {[
          ["Title", "High", true],
          ["Description", "High", true],
          ["Packages", "Medium", false],
          ["Tags", "Quick fix", false],
        ].map(([area, tag, high]) => (
          <div key={String(area)} className="flex items-center gap-2 px-2.5 py-2">
            <span className={cn("size-1.5 shrink-0 rounded-full", high ? "bg-primary" : "bg-border-strong")} />
            <span className="w-16 shrink-0 text-[10px] font-medium text-foreground">{area}</span>
            <span className="min-w-0 flex-1"><Bar w="80%" /></span>
            <Pill accent={Boolean(high)}>{tag}</Pill>
          </div>
        ))}
      </Card>
    </Frame>
  )
}

export function FunnelPreview() {
  const stages = [
    { label: "Impressions", w: "100%", weak: false },
    { label: "Clicks", w: "62%", weak: true },
    { label: "Orders", w: "34%", weak: false },
  ]
  return (
    <Frame>
      <Card className="space-y-2.5">
        {stages.map((s) => (
          <div key={s.label}>
            <div className="mb-1 flex items-center justify-between">
              <Label className={s.weak ? "text-foreground" : ""}>{s.label}</Label>
              {s.weak && <Pill accent>Weak point</Pill>}
            </div>
            <span
              className={cn("block h-3 rounded-md", s.weak ? "bg-primary/70" : "bg-ink-100")}
              style={{ width: s.w }}
            />
          </div>
        ))}
      </Card>
    </Frame>
  )
}

export function CompetitorsPreview() {
  return (
    <Frame>
      <Card className="p-0">
        <div className="grid grid-cols-2 border-b">
          <Label className="px-2.5 py-1.5">Typical offers</Label>
          <Label className="border-l px-2.5 py-1.5 text-accent-foreground">Your angle</Label>
        </div>
        {[0, 1, 2].map((row) => (
          <div key={row} className={cn("grid grid-cols-2", row === 1 && "bg-accent/40")}>
            <div className="space-y-1 px-2.5 py-2">
              <Bar w={row === 1 ? "30%" : "80%"} />
            </div>
            <div className="flex items-center gap-1.5 border-l px-2.5 py-2">
              <Bar w="70%" className={row === 1 ? "bg-primary/60" : ""} />
              {row === 1 && <Pill accent>Gap</Pill>}
            </div>
          </div>
        ))}
      </Card>
    </Frame>
  )
}

export function ReplyPreview() {
  return (
    <Frame className="space-y-2">
      <div className="mr-10 rounded-lg rounded-bl-sm border bg-card p-2 shadow-card">
        <Label>Buyer</Label>
        <div className="mt-1.5 space-y-1">
          <Bar w="90%" />
          <Bar w="60%" />
        </div>
      </div>
      <div className="ml-10 rounded-lg rounded-br-sm border border-primary/20 bg-accent p-2">
        <Label className="text-accent-foreground">Your reply draft</Label>
        <div className="mt-1.5 space-y-1">
          <Bar w="95%" className="bg-primary/25" />
          <Bar w="85%" className="bg-primary/25" />
          <Bar w="50%" className="bg-primary/25" />
        </div>
      </div>
    </Frame>
  )
}

export function ExperimentsPreview() {
  return (
    <Frame>
      <Card>
        <div className="relative flex justify-between px-1">
          <span className="absolute inset-x-3 top-[5px] h-px bg-border-strong" />
          {["Before", "Change", "After"].map((step, i) => (
            <span key={step} className="relative flex flex-col items-center gap-1.5">
              <span className={cn("size-2.5 rounded-full border-2 bg-card", i === 1 ? "border-primary" : "border-border-strong")} />
              <Label className={i === 1 ? "text-foreground" : ""}>{step}</Label>
            </span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-2.5">
          {["Before", "After"].map((side, i) => (
            <div key={side} className="space-y-1">
              <Label>{side}</Label>
              <div className="flex h-8 items-end gap-1">
                {[40, 65, 30].map((h, j) => (
                  <span key={j} className={cn("flex-1 rounded-sm", i ? "bg-primary/50" : "bg-ink-100")} style={{ height: `${i ? h + 15 : h}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Frame>
  )
}

export function ProfitPreview() {
  return (
    <Frame>
      <Card>
        <Label>Where the price goes</Label>
        <div className="mt-2 flex h-4 overflow-hidden rounded-md">
          <span className="w-[20%] bg-border-strong" />
          <span className="w-[15%] bg-ink-100" />
          <span className="flex-1 bg-primary/70" />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {[
            ["Platform fee", "bg-border-strong"],
            ["Costs", "bg-ink-100"],
            ["You keep", "bg-primary/70"],
          ].map(([label, swatch]) => (
            <span key={label} className="flex items-center gap-1">
              <span className={cn("size-2 rounded-sm", swatch)} />
              <Label>{label}</Label>
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex items-center justify-between border-t pt-2">
          <Label>Effective hourly rate</Label>
          <Bar w="25%" className="h-2 bg-ink-300" />
        </div>
      </Card>
    </Frame>
  )
}

export function PortfolioPreview() {
  return (
    <Frame>
      <MiniWindow path="yourname.gigwise.page">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 space-y-1">
            <Bar w="70%" className="h-2 bg-ink-300" />
            <Bar w="90%" />
            <Bar w="55%" />
            <span className="mt-1.5 block h-2.5 w-10 rounded-sm bg-primary/70" />
          </div>
          <span className="size-10 shrink-0 rounded-md bg-accent" />
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={cn("h-8 rounded", i === 0 ? "bg-accent" : "bg-secondary")} />
          ))}
        </div>
      </MiniWindow>
    </Frame>
  )
}

export function GoalPreview() {
  return (
    <Frame>
      <Card className="space-y-2.5">
        <div>
          <Label>Your skills</Label>
          <div className="mt-1.5 flex flex-wrap gap-1 rounded-md border px-1.5 py-1.5">
            {["React", "Next.js", "SEO"].map((skill) => (
              <span key={skill} className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-medium text-accent-foreground">{skill}</span>
            ))}
          </div>
        </div>
        <div>
          <Label>Goal</Label>
          <div className="mt-1.5 flex items-center justify-between rounded-md border px-2 py-1.5">
            <Bar w="45%" />
            <span className="size-1.5 rotate-45 border-r border-b border-ink-400" />
          </div>
        </div>
        <span className="block h-4 w-full rounded-md bg-primary/80" />
      </Card>
    </Frame>
  )
}
