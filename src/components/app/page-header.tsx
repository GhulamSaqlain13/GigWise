import type { ReactNode } from "react"

// The nav section is shown in the topbar breadcrumb, so the header is just
// title, description and optional actions.
export function PageHeader({ title, description, children }: {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 max-w-2xl">
        <h1 className="font-display text-[28px] leading-tight font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  )
}
