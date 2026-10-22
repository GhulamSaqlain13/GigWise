"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/logo"
import { isActive, navSections } from "@/lib/nav"
import { cn } from "@/lib/utils"

const itemClass =
  "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium text-sidebar-foreground transition-colors hover:bg-muted hover:text-foreground"

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-5">
      {navSections.map((section) => (
        <div key={section.title}>
          <p className="mb-1 px-2.5 text-xs font-medium text-muted-foreground/80">{section.title}</p>
          <nav aria-label={section.title} className="flex flex-col gap-px">
            {section.items.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(itemClass, active && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground")}
                >
                  <Icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} aria-hidden />
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      ))}
      <Link href="/" onClick={onNavigate} className={cn(itemClass, "text-muted-foreground")}>
        <ArrowLeft className="size-4 shrink-0" aria-hidden />
        Back to website
      </Link>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r bg-sidebar lg:flex">
      <div className="flex h-16 shrink-0 items-center border-b px-5">
        <Logo href="/dashboard" />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <NavLinks />
      </div>
    </aside>
  )
}
