"use client"

import { createContext, use, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { useLocalStore } from "@/lib/local-store"
import { defaultPortfolio } from "@/lib/portfolio/themes"
import type { Portfolio } from "@/lib/portfolio/types"

type PortfolioContextValue = {
  draft: Portfolio
  saved: Portfolio[]
  /** Theme chosen on the themes page, pre-selected in the wizard. */
  wizardTheme: string
  setWizardTheme: (id: string) => void
  update: (patch: Partial<Portfolio>) => void
  load: (portfolio: Portfolio) => void
  save: (portfolio?: Portfolio) => boolean
  remove: (id: string) => void
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

// Lives in app/(app)/portfolio/layout.tsx so the working draft survives
// navigation between Studio pages (the prototype kept it in one JS variable).
// TODO(supabase): persist to portfolio_projects instead of localStorage.
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useLocalStore("portfolios")
  const [draft, setDraft] = useState<Portfolio>(defaultPortfolio)
  const [wizardTheme, setWizardTheme] = useState(defaultPortfolio.theme)

  function save(portfolio: Portfolio = draft) {
    const toSave = portfolio.id ? portfolio : { ...portfolio, id: `p${Date.now()}` }
    setDraft(toSave)
    try {
      setSaved((prev) => {
        const i = prev.findIndex((p) => p.id === toSave.id)
        return i >= 0 ? prev.map((p, j) => (j === i ? toSave : p)) : [toSave, ...prev]
      })
      return true
    } catch {
      toast.error("Browser storage is full. Export your data to keep a copy.")
      return false
    }
  }

  const value: PortfolioContextValue = {
    draft,
    saved,
    wizardTheme,
    setWizardTheme,
    update: (patch) => setDraft((d) => ({ ...d, ...patch })),
    load: (p) => setDraft(structuredClone(p)),
    save,
    remove: (id) => setSaved((prev) => prev.filter((p) => p.id !== id)),
  }

  return <PortfolioContext value={value}>{children}</PortfolioContext>
}

export function usePortfolio() {
  const ctx = use(PortfolioContext)
  if (!ctx) throw new Error("usePortfolio must be used inside <PortfolioProvider>")
  return ctx
}
