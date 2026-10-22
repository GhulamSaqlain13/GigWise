"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  ["#features", "Features"],
  ["#how", "How it works"],
  ["#pricing", "Pricing"],
  ["#faq", "FAQ"],
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <div className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
      <header className="relative mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 md:px-6">
        <div className="flex items-center gap-10">
          <Logo />
          <nav
            id="site-nav"
            aria-label="Main"
            className={cn(
              "absolute inset-x-0 top-16 flex-col gap-1 border-b bg-card p-3 md:static md:flex md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0",
              open ? "flex" : "hidden md:flex",
            )}
          >
            {links.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}>
            Sign in
          </Link>
          <Link href="/signup" className={buttonVariants({ size: "sm" })}>
            Start free
          </Link>
          <button
            className="grid size-10 place-items-center rounded-md text-muted-foreground hover:bg-muted md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>
    </div>
  )
}
