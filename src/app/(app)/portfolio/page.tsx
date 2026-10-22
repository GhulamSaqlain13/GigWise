"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ChevronRight, PanelsTopLeft, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/app/confirm-dialog"
import { EmptyResult } from "@/components/app/form-bits"
import { PageHeader } from "@/components/app/page-header"
import { usePortfolio } from "@/components/portfolio/portfolio-provider"
import { ThemeCard } from "@/components/portfolio/theme-card"
import { Button, buttonVariants } from "@/components/ui/button"
import { getTheme, themes } from "@/lib/portfolio/themes"
import type { Portfolio } from "@/lib/portfolio/types"
import { cn } from "@/lib/utils"

export default function PortfolioHomePage() {
  const router = useRouter()
  const { saved, load, remove } = usePortfolio()
  const [pendingDelete, setPendingDelete] = useState<Portfolio | null>(null)

  return (
    <>
      <PageHeader
        section="Portfolio websites"
        title="Portfolio websites"
        description="Build a simple website for your work from a theme, then edit the content and design."
      >
        <div className="flex gap-2">
          <Link href="/portfolio/themes" className={cn(buttonVariants({ variant: "outline" }), "bg-card")}>Browse themes</Link>
          <Link href="/portfolio/new" className={buttonVariants()}><Plus data-icon="inline-start" /> New portfolio</Link>
        </div>
      </PageHeader>

      <section aria-labelledby="your-portfolios">
        <h2 id="your-portfolios" className="mb-3 text-base font-semibold">Your portfolios</h2>
        {saved.length === 0 ? (
          <EmptyResult icon={PanelsTopLeft} title="No portfolios yet">
            Start from a theme and add your name, skills and projects. You can change everything later.
          </EmptyResult>
        ) : (
          <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-card">
            {saved.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:flex-nowrap">
                <span className="size-8 shrink-0 rounded-md ring-1 ring-border" style={{ background: getTheme(p.theme).paper }} aria-hidden>
                  <span className="m-2 block h-1.5 w-4 rounded-full" style={{ background: p.accent }} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="truncate text-[13px] text-muted-foreground">{p.role}, {getTheme(p.theme).name} theme</p>
                </div>
                <span className={cn("rounded-md px-2 py-0.5 text-xs font-medium", p.published ? "bg-brand-50 text-brand-700" : "bg-muted text-muted-foreground")}>
                  {p.published ? "Preview ready" : "Draft"}
                </span>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => { load(p); router.push("/portfolio/editor") }}>
                    <Pencil data-icon="inline-start" /> Edit
                  </Button>
                  <Button size="icon-sm" variant="ghost" aria-label={`Delete ${p.name}`} onClick={() => setPendingDelete(p)}>
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="themes" className="mt-10">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 id="themes" className="text-base font-semibold">Start from a theme</h2>
            <p className="text-[13px] text-muted-foreground">Each theme works on mobile and can be fully customized.</p>
          </div>
          <Link href="/portfolio/themes" className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:text-primary-hover">
            All themes <ChevronRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.slice(0, 3).map((t) => <ThemeCard key={t.id} theme={t} />)}
        </div>
      </section>

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
