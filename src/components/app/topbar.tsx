"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { Bell, Search } from "lucide-react"
import { toast } from "sonner"
import { Logo } from "@/components/logo"
import { allNavItems } from "@/lib/nav"

function ToolSearch() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")

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
    const match = allNavItems.find((item) => `${item.label} ${item.keywords ?? ""}`.toLowerCase().includes(q))
    if (match) {
      router.push(match.href)
      setQuery("")
      inputRef.current?.blur()
    } else {
      toast("No tool matches that search. Try “gig”, “buyer” or “portfolio”.")
    }
  }

  return (
    <div className="flex h-9 w-full max-w-[360px] items-center gap-2 rounded-lg border bg-background px-2.5 text-muted-foreground focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40">
      <Search className="size-4 shrink-0" aria-hidden />
      <input
        ref={inputRef}
        aria-label="Search tools"
        placeholder="Search tools"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && go()}
        className="w-full min-w-0 bg-transparent text-sm text-foreground outline-0 placeholder:text-muted-foreground"
      />
      <kbd className="hidden rounded border bg-card px-1.5 font-sans text-xs text-muted-foreground sm:block">/</kbd>
    </div>
  )
}

export function Topbar({ userSlot }: { userSlot: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/90 px-4 backdrop-blur md:px-6 lg:px-8">
      <Logo href="/dashboard" className="shrink-0 lg:hidden" />
      <div className="flex flex-1 justify-end sm:justify-start">
        <ToolSearch />
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="hidden size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground sm:grid"
          aria-label="Notifications"
          onClick={() => toast("No notifications yet.")}
        >
          <Bell className="size-[18px]" />
        </button>
        {userSlot}
      </div>
    </header>
  )
}
