import type { ReactNode } from "react"

/** Portfolio Studio page header: eyebrow, title and description, optional actions. */
export function StudioHeader({ eyebrow, title, description, children }: {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 max-w-2xl">
        <p className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.1em] text-brand-600 uppercase">
          <span className="size-1.5 rounded-full bg-lime" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.25rem)] leading-[1.1] font-extrabold tracking-[-0.025em] text-balance text-foreground">
          {title}
        </h1>
        {description && <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {children && <div className="flex max-w-full min-w-0 flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

/** Section heading inside a Studio page ("Your portfolios", "Find your perfect starting point"). */
export function StudioSection({ title, description, action, children, id }: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
  id: string
}) {
  return (
    <section aria-labelledby={id} className="mt-9">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id={id} className="text-[19px] font-extrabold tracking-[-0.01em]">{title}</h2>
          {description && <p className="mt-1 text-[13px] text-ink-soft">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
