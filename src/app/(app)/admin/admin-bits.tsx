"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useTransition, type ReactNode } from "react"
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/app/confirm-dialog"
import { Button } from "@/components/ui/button"
import type { SiteSettingsKey } from "@/lib/site/schema"
import { cn } from "@/lib/utils"
import { resetSettings, type ActionResult } from "./actions"

const tabs = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/landing", label: "Landing page" },
  { href: "/admin/tools", label: "Tools & navigation" },
  { href: "/admin/themes", label: "Portfolio themes" },
  { href: "/admin/announcement", label: "Announcement" },
  { href: "/admin/users", label: "Users" },
]

export function AdminTabs() {
  const pathname = usePathname()
  return (
    <nav aria-label="Admin sections" className="-mx-4 mb-8 overflow-x-auto border-b px-4 md:mx-0 md:px-0">
      <div className="flex min-w-max gap-1">
        {tabs.map((tab) => {
          const active = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "-mb-px border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors",
                active ? "border-primary text-foreground" : "border-transparent text-ink-soft hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

/** Local editable copy of a settings value plus save/reset handling. */
export function useSettingsEditor<T>(initial: T, save: (value: T) => Promise<ActionResult>, area: SiteSettingsKey) {
  const [value, setValue] = useState(initial)
  const [baseline, setBaseline] = useState(initial)
  const [pending, startTransition] = useTransition()
  const router = useRouter()
  const dirty = JSON.stringify(value) !== JSON.stringify(baseline)

  function onSave() {
    startTransition(async () => {
      const result = await save(value)
      if (result.ok) {
        setBaseline(value)
        toast.success("Saved. Changes are live.")
      } else toast.error(result.error)
    })
  }

  function onReset() {
    startTransition(async () => {
      const result = await resetSettings(area)
      if (result.ok) {
        toast.success("Restored defaults.")
        // Pages key the editor on the server value, so this remounts it with the defaults.
        router.refresh()
      } else toast.error(result.error)
    })
  }

  return { value, setValue, dirty, pending, onSave, onReset, discard: () => setValue(baseline) }
}

export function SaveBar({ dirty, pending, onSave, onReset, discard }: {
  dirty: boolean
  pending: boolean
  onSave: () => void
  onReset: () => void
  discard: () => void
}) {
  const [confirm, setConfirm] = useState(false)
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 flex flex-wrap items-center gap-3 border-t bg-card/95 px-4 py-3 backdrop-blur md:mx-0 md:rounded-xl md:border">
      <p className="mr-auto text-[13px] text-ink-soft">{dirty ? "You have unsaved changes." : "All changes saved."}</p>
      <Button variant="ghost" size="sm" onClick={() => setConfirm(true)} disabled={pending}>Reset to defaults</Button>
      <Button variant="outline" size="sm" onClick={discard} disabled={!dirty || pending}>Discard</Button>
      <Button size="sm" onClick={onSave} disabled={!dirty || pending}>{pending ? "Saving…" : "Save changes"}</Button>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Reset to defaults?"
        description="Everything in this area goes back to the built-in defaults for all visitors. This can't be undone."
        confirmLabel="Reset"
        onConfirm={onReset}
      />
    </div>
  )
}

export function Switch({ checked, onChange, label, disabled }: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none disabled:opacity-50",
        checked ? "bg-primary" : "bg-border-strong",
      )}
    >
      <span className={cn("size-4 rounded-full bg-white shadow-card transition-transform", checked ? "translate-x-4.5" : "translate-x-0.5")} />
    </button>
  )
}

const iconBtn =
  "grid size-8 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"

export function RowControls({ onUp, onDown, onRemove, first, last, label }: {
  onUp: () => void
  onDown: () => void
  onRemove?: () => void
  first: boolean
  last: boolean
  label: string
}) {
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className={iconBtn} onClick={onUp} disabled={first} aria-label={`Move ${label} up`}>
        <ArrowUp className="size-4" />
      </button>
      <button type="button" className={iconBtn} onClick={onDown} disabled={last} aria-label={`Move ${label} down`}>
        <ArrowDown className="size-4" />
      </button>
      {onRemove && (
        <button type="button" className={cn(iconBtn, "hover:text-destructive")} onClick={onRemove} aria-label={`Remove ${label}`}>
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  )
}

export function move<T>(list: T[], index: number, delta: number) {
  const next = [...list]
  const target = index + delta
  if (target < 0 || target >= next.length) return list
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

export function Panel({ title, description, action, children }: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border bg-card shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-0.5 text-[13px] text-ink-soft">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

/** Short random id for new list items (ids must match ^[a-z0-9-]+$). */
export function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}
