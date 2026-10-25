"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowRight, Pencil, Plus, Sparkles, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/app/confirm-dialog"
import { usePortfolio } from "@/components/portfolio/portfolio-provider"
import { StudioHeader, StudioSection } from "@/components/portfolio/studio-header"
import { ThemeCard } from "@/components/portfolio/theme-card"
import { Button, buttonVariants } from "@/components/ui/button"
import { useThemes } from "@/components/portfolio/themes-context"
import type { Portfolio } from "@/lib/portfolio/types"
import { cn } from "@/lib/utils"

const numberWords = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"]

export default function PortfolioHomePage() {
  const router = useRouter()
  const { saved, load, remove } = usePortfolio()
  const { themes, getTheme } = useThemes()
  const [pendingDelete, setPendingDelete] = useState<Portfolio | null>(null)
  const count = numberWords[themes.length] ?? String(themes.length)

  return (
    <>
      <StudioHeader
        eyebrow="Your creative space"
        title="Portfolio websites, made effortless."
        description="Build a professional home for your work. Choose a theme, customize every detail, and prepare your portfolio for publishing."
      />

      <IntroCard />

      <StudioSection
        id="your-portfolios"
        title="Your portfolios"
        description="Manage your saved portfolio projects."
        action={<Link href="/portfolio/new" className={buttonVariants({ variant: "outline", size: "sm" })}><Plus data-icon="inline-start" /> New portfolio</Link>}
      >
        {saved.length === 0 ? (
          <div className="flex flex-col items-center rounded-[20px] border border-dashed border-border-strong bg-card px-6 py-10 text-center">
            <h3 className="text-base font-bold">No portfolios yet</h3>
            <p className="mt-1.5 max-w-sm text-sm text-ink-soft">Create your first portfolio with one of the curated themes.</p>
            <Link href="/portfolio/new" className={cn(buttonVariants({ variant: "pine" }), "mt-5")}>Create portfolio</Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((p) => {
              const theme = getTheme(p.theme)
              return (
                <li key={p.id} className="relative overflow-hidden rounded-[20px] border bg-card p-5">
                  <span aria-hidden className="absolute -top-8 -right-8 size-24 rounded-full opacity-25" style={{ background: p.accent }} />
                  <span className={cn("relative inline-block rounded-full px-2.5 py-1 text-[11px] font-bold", p.published ? "bg-lime/50 text-pine" : "bg-brand-50 text-brand-700")}>
                    {p.published ? "Preview ready" : "Draft"}
                  </span>
                  <h3 className="relative mt-3 truncate text-base font-extrabold">{p.name}</h3>
                  <p className="relative mt-1 truncate text-xs text-ink-soft">{p.role} · {theme.name}</p>
                  <div className="relative mt-4 flex gap-2">
                    <Button size="sm" variant="pine" onClick={() => { load(p); router.push("/portfolio/editor") }}>
                      <Pencil data-icon="inline-start" /> Edit website
                    </Button>
                    <Button size="sm" variant="outline" aria-label={`Delete ${p.name}`} onClick={() => setPendingDelete(p)}>
                      <Trash2 data-icon="inline-start" /> Delete
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </StudioSection>

      <StudioSection
        id="starting-point"
        title="Find your perfect starting point"
        description={`${count} curated ${themes.length === 1 ? "theme" : "themes"} designed for different freelance careers.`}
        action={
          <Link href="/portfolio/themes" className="inline-flex items-center gap-1 text-[13px] font-bold text-evergreen hover:text-pine">
            View all themes <ArrowRight className="size-4" aria-hidden />
          </Link>
        }
      >
        <div className="grid gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {themes.slice(0, 3).map((t) => <ThemeCard key={t.id} theme={t} />)}
        </div>
      </StudioSection>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this portfolio?"
        description={`“${pendingDelete?.name ?? ""}” will be removed from this browser. This can't be undone.`}
        confirmLabel="Delete portfolio"
        onConfirm={() => {
          if (!pendingDelete) return
          remove(pendingDelete.id)
          toast.success("Portfolio deleted")
        }}
      />
    </>
  )
}

function IntroCard() {
  return (
    <div className="grid overflow-hidden rounded-3xl border bg-card md:grid-cols-[1.1fr_0.9fr]">
      <div className="p-6 md:p-8">
        <span className="inline-block rounded-full bg-lime/50 px-2.5 py-1.5 text-[10px] font-extrabold tracking-[0.08em] text-pine">NEW IN GIGWISE</span>
        <h2 className="mt-3 text-2xl leading-tight font-extrabold tracking-[-0.02em]">
          Your work deserves a <span className="font-serif font-normal text-brand-600 italic">beautiful website.</span>
        </h2>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-ink-soft">
          No coding. No complex setup. Start from a curated theme and personalize it with your own content in minutes.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Link href="/portfolio/new" className={buttonVariants({ variant: "pine" })}>
            <Sparkles data-icon="inline-start" /> Create portfolio <ArrowRight data-icon="inline-end" />
          </Link>
          <Link href="/portfolio/themes" className={buttonVariants({ variant: "outline" })}>Explore themes</Link>
        </div>
      </div>
      {/* Mini website sketch, from the Portfolio Studio ref. */}
      <div aria-hidden className="hidden place-items-center bg-linear-135 from-brand-50 to-brand-100 p-6 md:grid">
        <div className="w-[88%] -rotate-3 rounded-xl bg-white p-4 shadow-[0_18px_40px_-20px_oklch(0.318_0.054_170/0.45)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-[7px] w-16 rounded-full bg-pine" />
            <div className="flex gap-1.5">{[0, 1, 2].map((i) => <div key={i} className="h-1.5 w-6 rounded-full bg-ink-200" />)}</div>
          </div>
          <div className="mb-2.5 h-3 w-[62%] rounded-full bg-foreground/85" />
          <div className="mb-[7px] h-2 w-4/5 rounded-full bg-ink-200" />
          <div className="h-2 w-3/5 rounded-full bg-ink-200" />
          <div className="mt-3 h-5 w-20 rounded-md bg-brand-600" />
          <div className="mt-4 flex gap-2">
            <div className="h-12 flex-1 rounded-md bg-brand-100" />
            <div className="h-12 flex-1 rounded-md bg-lime/60" />
            <div className="h-12 flex-1 rounded-md bg-brand-50" />
          </div>
        </div>
      </div>
    </div>
  )
}
