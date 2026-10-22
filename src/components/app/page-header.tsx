import type { ReactNode } from "react"

export function PageHeader({ section, title, description, children }: {
  /** Nav section the page belongs to, e.g. "Growth tools". */
  section: string
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="max-w-2xl">
        <p className="mb-1 text-[13px] font-medium text-muted-foreground">{section}</p>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] md:text-[1.75rem]">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}
