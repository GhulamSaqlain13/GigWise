import type { Metadata } from "next"
import { StudioHeader } from "@/components/portfolio/studio-header"
import { ThemeCard } from "@/components/portfolio/theme-card"
import { toPortfolioTheme } from "@/lib/site/schema"
import { getSiteSettings } from "@/lib/site/store"

export const metadata: Metadata = { title: "Portfolio themes" }

export default async function ThemesPage() {
  const { themes } = await getSiteSettings()
  return (
    <>
      <StudioHeader
        eyebrow="Curated designs"
        title="Choose a theme that feels like you."
        description="Every theme is mobile-friendly, editable, and built to put your work first."
      />
      <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
        {themes.filter((t) => !t.hidden).map((t) => <ThemeCard key={t.id} theme={toPortfolioTheme(t)} />)}
      </div>
    </>
  )
}
