import type { ReactNode } from "react"
import { Calculator, Info, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Shared building blocks for the tool pages: input form on the left,
// result on the right (stacked on small screens).

export function ToolLayout({ input, output }: { input: ReactNode; output: ReactNode }) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Your input" className="rounded-xl border bg-card p-5 shadow-card md:p-6">
        {input}
      </section>
      <section aria-label="Result" aria-live="polite" className="min-w-0 lg:sticky lg:top-24">
        {output}
      </section>
    </div>
  )
}

export function Field({ id, label, hint, error, children, className }: {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[13px] font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}

// Native controls styled to the spec (44px targets); avoids Base UI Select
// overhead for simple option lists.
export const controlClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-400 hover:border-ink-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive min-h-11"

/** How a result was produced. Shown on every result so nothing passes as AI or market data. */
export type ResultSource = "template" | "calculated"

const sources: Record<ResultSource, { label: string; title: string; icon: LucideIcon }> = {
  template: {
    label: "Template-based",
    title: "Generated from fixed rules and templates. AI analysis is not connected yet.",
    icon: Info,
  },
  calculated: {
    label: "Calculated from your numbers",
    title: "Deterministic maths on the values you entered.",
    icon: Calculator,
  },
}

export function ResultPanel({ title, source, children, actions, className }: {
  title: ReactNode
  source: ResultSource
  children: ReactNode
  actions?: ReactNode
  className?: string
}) {
  const { label, title: sourceTitle, icon: Icon } = sources[source]
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card shadow-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-3.5">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span title={sourceTitle} className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          <Icon className="size-3.5" aria-hidden /> {label}
        </span>
      </div>
      <div className="space-y-3 p-5 text-sm leading-relaxed">{children}</div>
      {actions && <div className="flex flex-wrap gap-2 border-t bg-ink-25 px-5 py-3">{actions}</div>}
    </div>
  )
}

export function EmptyResult({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card/60 px-6 py-12 text-center">
      <span className="mb-3 grid size-10 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <p className="font-medium">{title}</p>
      <p className="mt-1 max-w-xs text-[13px] text-muted-foreground">{children}</p>
    </div>
  )
}

export function Metric({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-lg bg-ink-25 p-4 ring-1 ring-border">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-brand-800 tabular-nums">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Caveat({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>
}
