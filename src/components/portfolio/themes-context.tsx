"use client"

import { createContext, use, useMemo, type ReactNode } from "react"
import { themes as builtInThemes, type PortfolioTheme } from "@/lib/portfolio/themes"
import { toPortfolioTheme, type ThemeSetting } from "@/lib/site/schema"

type ThemesContextValue = {
  /** Themes users can pick (hidden ones removed). */
  themes: PortfolioTheme[]
  /** Resolve a saved portfolio's theme, including hidden ones it already uses. */
  getTheme: (id: string) => PortfolioTheme
}

function build(all: PortfolioTheme[], visible: PortfolioTheme[]): ThemesContextValue {
  return { themes: visible, getTheme: (id) => all.find((t) => t.id === id) ?? visible[0] ?? all[0] }
}

const ThemesContext = createContext<ThemesContextValue>(build(builtInThemes, builtInThemes))

/** Portfolio themes as configured by the super admin (plain data from the server). */
export function ThemesProvider({ themes, children }: { themes: ThemeSetting[]; children: ReactNode }) {
  const value = useMemo(() => {
    return build(themes.map(toPortfolioTheme), themes.filter((t) => !t.hidden).map(toPortfolioTheme))
  }, [themes])
  return <ThemesContext value={value}>{children}</ThemesContext>
}

export function useThemes() {
  return use(ThemesContext)
}
