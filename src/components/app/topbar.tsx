"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { ChevronRight, Menu, Search } from "lucide-react"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { breadcrumbFor } from "@/lib/nav"
import { useNav } from "./nav-context"
import { SidebarPanel } from "./sidebar"

function ToolSearch() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const { sections } = useNav()

  // "/" focuses search from anywhere outside a text field.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      if (e.key !== "/" || target.closest("input, textarea, select, [contenteditable]")) return
      e.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function go() {
    const q = query.trim().toLowerCase()
    if (!q) return
    const match = sections.flatMap((s) => s.items).find((item) => `${item.label} ${item.keywords ?? ""}`.toLowerCase().includes(q))
    if (match) {
      router.push(match.href)
      setQuery("")
      inputRef.current?.blur()
    } else {
      toast("No tool matches that search. Try “gig”, “buyer” or “portfolio”.")
    }
  }

  return (
    <div className="flex h-11 w-40 items-center gap-2 rounded-xl border bg-card pr-2 pl-3.5 text-ink-soft transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20 sm:w-[300px]">
      <Search className="size-4 shrink-0" aria-hidden />
      <input
        ref={inputRef}
        aria-label="Search tools"
        placeholder="Search tools"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && go()}
        className="w-full min-w-0 bg-transparent text-sm text-foreground outline-0 placeholder:text-ink-soft"
      />
      <kbd className="hidden rounded-md bg-ink-50 px-2 py-[3px] font-sans text-xs text-ink-600 sm:block">/</kbd>
    </div>
  )
}

function Breadcrumb() {
  const { sections } = useNav()
  const pathname = usePathname()
  const crumb = breadcrumbFor(pathname, sections)
  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-2 text-[13.5px] text-ink-soft sm:flex">
      <Link href="/dashboard" className="hover:text-foreground">Workspace</Link>
      {pathname.startsWith("/admin") && (
        <>
          <ChevronRight className="size-3.5" aria-hidden />
          <span aria-current="page" className="font-semibold text-foreground">Admin</span>
        </>
      )}
      {crumb && crumb.item.href !== "/dashboard" && (
        <>
          {/* The root crumb already says "Workspace"; don't repeat it. */}
          {crumb.section !== "Workspace" && (
            <>
              <ChevronRight className="size-3.5" aria-hidden />
              <span>{crumb.section}</span>
            </>
          )}
          <ChevronRight className="size-3.5" aria-hidden />
          <span aria-current="page" className="truncate font-semibold text-foreground">{crumb.item.label}</span>
        </>
      )}
      {crumb?.item.href === "/dashboard" && (
        <>
          <ChevronRight className="size-3.5" aria-hidden />
          <span aria-current="page" className="font-semibold text-foreground">Overview</span>
        </>
      )}
    </nav>
  )
}

export function Topbar({ userSlot }: { userSlot: ReactNode }) {
  const [open, setOpen] = useState(false)

  // Close the drawer when the viewport grows past lg.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur md:px-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-xl border bg-card text-ink-700 hover:bg-ink-50 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-[18px]" />
      </button>

      <Breadcrumb />

      <div className="ml-auto flex items-center gap-2.5">
        <ToolSearch />
        <Link
          href="/#faq"
          className="hidden h-11 items-center rounded-xl border bg-card px-4 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50 sm:flex"
        >
          Help
        </Link>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" showCloseButton={false} className="w-[248px] gap-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarPanel className="w-full" footer={userSlot} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  )
}
