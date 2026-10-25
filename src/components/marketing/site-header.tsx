"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { pillClass } from "@/components/marketing/landing-ui"
import { cn } from "@/lib/utils"

const links = [
  ["#features", "Features"],
  ["#portfolio", "Portfolio Builder"],
  ["#pricing", "Pricing"],
  ["#faq", "FAQ"],
]

/** Floating pill navigation (ref landing design). */
export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-3 z-50 w-full px-4 pt-2 md:px-8">
      <div className="mx-auto max-w-[1136px] rounded-[28px] border border-ink-200 bg-white/75 shadow-[0_10px_30px_-18px_oklch(0.22_0.025_173/0.25)] backdrop-blur-[14px]">
        <div className="flex items-center justify-between gap-4 py-2.5 pr-2.5 pl-[18px]">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-[30px] text-[15px] font-medium md:flex">
            {links.map(([href, label]) => (
              <a key={href} href={href} className="text-ink-700 transition-colors hover:text-evergreen">
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/login" className={cn(pillClass("ghost"), "min-h-11 border-transparent bg-transparent")}>
              Sign in
            </Link>
            <Link href="/signup" className={cn(pillClass("dark"), "min-h-11")}>
              Get started
            </Link>
          </div>
          <button
            className="inline-flex size-10 items-center justify-center rounded-full border border-ink-200 bg-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        {open && (
          <nav id="mobile-nav" aria-label="Mobile" className="flex flex-col gap-1 border-t border-ink-200 px-3 pt-2 pb-3 md:hidden">
            {[...links, ["/login", "Sign in"]].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-[15px] font-medium text-forest-ink hover:bg-sage"
              >
                {label}
              </a>
            ))}
            <Link href="/signup" onClick={() => setOpen(false)} className={cn(pillClass("dark"), "mt-1")}>
              Get started
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
