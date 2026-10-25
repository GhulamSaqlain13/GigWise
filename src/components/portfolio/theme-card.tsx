"use client"

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { PortfolioTheme } from "@/lib/portfolio/themes"
import { usePortfolio } from "./portfolio-provider"
import { ThemePreview } from "./theme-preview"

export function ThemeCard({ theme }: { theme: PortfolioTheme }) {
  const router = useRouter()
  const { setWizardTheme } = usePortfolio()

  return (
    <article className="overflow-hidden rounded-[20px] border bg-card transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_-12px_oklch(0.318_0.054_170/0.25)]">
      <ThemePreview theme={theme} />
      <div className="p-4">
        <strong className="text-sm font-extrabold text-foreground">{theme.name}</strong>
        <p className="mt-1 mb-3.5 text-xs text-ink-soft">{theme.type}</p>
        <Button
          variant="secondary"
          className="w-full bg-brand-50 font-semibold text-brand-700 hover:bg-brand-100"
          onClick={() => {
            setWizardTheme(theme.id)
            router.push("/portfolio/new")
            toast("Theme selected. Add your details to continue.")
          }}
        >
          Use this theme <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </article>
  )
}
