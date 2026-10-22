import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Compass, FilePlus2, Plus, WandSparkles } from "lucide-react"
import { PageHeader } from "@/components/app/page-header"
import { buttonVariants } from "@/components/ui/button"
import { navSections } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { AtAGlance, NextStepPanel, RecentActivity } from "./overview-widgets"

export const metadata: Metadata = { title: "Overview" }

const journeys = [
  { href: "/optimize", title: "Improve my gig", body: "Audit the title, offer and description of a gig you already have.", icon: WandSparkles },
  { href: "/gigs/new", title: "Create a new gig", body: "Turn a service idea into a clear, buyer-focused gig draft.", icon: FilePlus2 },
  { href: "/discover", title: "Find services to sell", body: "Start from your skills and get specific service angles to test.", icon: Compass },
]

const tools = [...navSections[1].items, navSections[2].items[0]]

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        section="Workspace"
        title="Overview"
        description="Pick up where you left off, or start one of the three journeys."
      >
        <div className="flex gap-2">
          <Link href="/discover" className={cn(buttonVariants({ variant: "outline" }), "bg-card")}>
            <Compass data-icon="inline-start" /> Find services
          </Link>
          <Link href="/gigs/new" className={buttonVariants()}>
            <Plus data-icon="inline-start" /> New gig
          </Link>
        </div>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <NextStepPanel />
        <AtAGlance />
      </div>

      <section aria-labelledby="journeys" className="mt-10">
        <h2 id="journeys" className="mb-3 text-base font-semibold">Start a journey</h2>
        <div className="grid overflow-hidden rounded-xl border bg-card shadow-card md:grid-cols-3 md:divide-x max-md:divide-y">
          {journeys.map(({ href, title, body, icon: Icon }) => (
            <Link key={href} href={href} className="group flex gap-3.5 p-5 transition-colors hover:bg-soft focus-visible:bg-soft focus-visible:outline-none">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg border bg-background text-primary">
                <Icon className="size-[18px]" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2 font-semibold">
                  {title}
                  <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">{body}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-x-6 gap-y-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section aria-labelledby="activity" className="min-w-0">
          <h2 id="activity" className="mb-3 text-base font-semibold">Recent activity</h2>
          <RecentActivity />
        </section>

        <section aria-labelledby="tools" className="min-w-0">
          <h2 id="tools" className="mb-3 text-base font-semibold">Growth tools</h2>
          <ul className="overflow-hidden rounded-xl border bg-card shadow-card divide-y">
            {tools.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="group flex h-12 items-center gap-3 px-4 text-sm font-medium transition-colors hover:bg-soft">
                  <Icon className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden />
                  <span className="flex-1">{label}</span>
                  <ChevronRight className="size-4 text-muted-foreground/60" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
