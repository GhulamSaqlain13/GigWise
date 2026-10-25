"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createContext, use, useMemo, type ReactNode } from "react"
import { PowerOff } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { disabledHrefs, navSections, resolveNav, type NavSection } from "@/lib/nav"
import type { ToolSettings } from "@/lib/site/schema"

type NavContextValue = { sections: NavSection[]; disabled: string[] }

const NavContext = createContext<NavContextValue>({ sections: navSections, disabled: [] })

/** Receives the admin's tool settings (plain data) and resolves the nav on the client. */
export function NavProvider({ tools, children }: { tools: ToolSettings; children: ReactNode }) {
  const value = useMemo(() => ({ sections: resolveNav(tools), disabled: disabledHrefs(tools) }), [tools])
  return <NavContext value={value}>{children}</NavContext>
}

export function useNav() {
  return use(NavContext)
}

/** Replaces a page the super admin switched off with a short notice. */
export function RouteGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { disabled } = useNav()
  const off = disabled.some((href) => pathname === href || pathname.startsWith(href + "/"))
  if (!off) return children
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong bg-card px-6 py-16 text-center">
      <span className="flex size-11 items-center justify-center rounded-xl border bg-secondary text-ink-faint">
        <PowerOff className="size-5" aria-hidden />
      </span>
      <h1 className="mt-4 font-display text-lg font-semibold text-foreground">This tool is turned off</h1>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
        An administrator has disabled this part of the workspace for now.
      </p>
      <Link href="/dashboard" className={`${buttonVariants({ size: "sm" })} mt-5`}>Back to overview</Link>
    </div>
  )
}
