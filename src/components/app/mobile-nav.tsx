"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Compass, Ellipsis, FilePlus, House, Route, X } from "lucide-react"
import { isActive } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { NavLinks } from "./sidebar"

const primary = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/gigs/new", label: "Create", icon: FilePlus },
  { href: "/growth-plan", label: "Plan", icon: Route },
]

// Compact bottom navigation under 768px (spec §11) with a "More" drawer.
export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="All tools">
          <button className="absolute inset-0 bg-black/30" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-card p-5 pb-24">
            <div className="mb-4 flex items-center justify-between">
              <strong>All tools</strong>
              <button onClick={() => setOpen(false)} className="grid size-11 place-items-center" aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t bg-card px-1 py-2 lg:hidden"
      >
        {primary.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 text-xs text-muted-foreground",
              isActive(pathname, href) && "text-primary",
            )}
          >
            <Icon className="size-5" aria-hidden />
            {label}
          </Link>
        ))}
        <button
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 text-xs text-muted-foreground"
        >
          <Ellipsis className="size-5" aria-hidden />
          More
        </button>
      </nav>
    </>
  )
}
