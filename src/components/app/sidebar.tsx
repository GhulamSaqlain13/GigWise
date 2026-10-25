"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { isActive } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { useNav } from "./nav-context"

const itemClass =
  "flex items-center gap-2.5 rounded-[10px] p-2.5 text-sm font-medium transition-colors"

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { sections } = useNav()

  return (
    <div className="space-y-[18px]">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="px-2.5 pb-1.5 text-[11px] font-bold tracking-[0.08em] text-ink-soft uppercase">
            {section.title}
          </p>
          <nav aria-label={section.title} className="space-y-px">
            {section.items.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    itemClass,
                    active ? "bg-pine font-semibold text-white" : "text-ink-700 hover:bg-ink-50 hover:text-foreground",
                  )}
                >
                  <Icon className={cn("size-[18px] shrink-0", active ? "text-lime" : "text-ink-soft")} aria-hidden />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      ))}
      <Link href="/" onClick={onNavigate} className={cn(itemClass, "text-ink-soft hover:bg-ink-50 hover:text-foreground")}>
        <ArrowLeft className="size-[18px] shrink-0" aria-hidden />
        Back to website
      </Link>
    </div>
  )
}

/** Sidebar body, shared by the desktop rail and the mobile drawer. */
export function SidebarPanel({ footer, onNavigate, className }: {
  footer?: ReactNode
  onNavigate?: () => void
  className?: string
}) {
  return (
    // The whole panel scrolls as one, so the footer card never squeezes the nav.
    <div className={cn("flex h-full w-[248px] flex-col overflow-y-auto bg-card", className)}>
      <div className="flex h-[72px] shrink-0 items-center px-6">
        <Logo href="/dashboard" size="lg" />
      </div>
      <div className="px-4 pb-6">
        <NavLinks onNavigate={onNavigate} />
      </div>
      {footer && <div className="mt-auto px-4 pb-4">{footer}</div>}
    </div>
  )
}

export function Sidebar({ footer }: { footer?: ReactNode }) {
  return (
    <aside className="sticky top-0 hidden h-dvh shrink-0 border-r lg:block">
      <SidebarPanel footer={footer} />
    </aside>
  )
}
