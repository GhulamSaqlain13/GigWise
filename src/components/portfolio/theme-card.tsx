"use client"

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import type { PortfolioTheme } from "@/lib/portfolio/themes"
import { usePortfolio } from "./portfolio-provider"

export function ThemeCard({ theme }: { theme: PortfolioTheme }) {
  const router = useRouter()
  const { setWizardTheme } = usePortfolio()

  return (
    <article className="overflow-hidden rounded-xl border bg-card shadow-card transition-colors hover:border-brand-300">
      <div className="h-[185px] p-4" style={{ background: theme.bg }} aria-hidden>
        <div className="h-full rounded-[7px] p-3 shadow-[0_10px_25px_#0002]" style={{ background: theme.paper, color: theme.ink }}>
          <div className="flex justify-between text-[8px] font-extrabold opacity-80">
            <span>PORTFOLIO.</span>
            <span>About  Work  Contact</span>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <div className="flex-1">
              <b className="block text-base leading-tight tracking-tight">Building ideas<br />into reality.</b>
              <p className="text-[8px] opacity-65">{theme.role}</p>
              <span className="inline-block h-2 w-14 rounded-[3px]" style={{ background: theme.accent }} />
            </div>
            <div className="h-[66px] w-[55px] shrink-0 rounded-md" style={{ background: `linear-gradient(140deg,${theme.accent},${theme.bg})` }} />
          </div>
        </div>
      </div>
      <div className="p-4">
        <strong className="text-sm font-extrabold">{theme.name}</strong>
        <p className="mt-1 mb-3.5 text-xs text-muted-foreground">{theme.type}</p>
        <Button
          variant="secondary"
          className="w-full"
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
