import type { Metadata } from "next"
import { PageHeader } from "@/components/app/page-header"
import { ThemeCard } from "@/components/portfolio/theme-card"
import { themes } from "@/lib/portfolio/themes"

export const metadata: Metadata = { title: "Portfolio themes" }

export default function ThemesPage() {
  return (
    <>
      <PageHeader
        section="Portfolio websites"
        title="Choose a theme that feels like you."
        description="Every theme is mobile-friendly, editable, and built to put your work first."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((t) => <ThemeCard key={t.id} theme={t} />)}
      </div>
    </>
  )
}
