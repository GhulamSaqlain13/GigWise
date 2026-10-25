import { CircleCheck, Circle, Compass, Globe, LayoutTemplate, Sparkles, TrendingUp, Wand2 } from "lucide-react"
import { Chip, landingCard } from "@/components/marketing/landing-ui"
import { cn } from "@/lib/utils"

// Decorative product mockup for the hero: browser window with the workspace
// overview plus floating example cards. Labels only, no metrics.

const shortcuts = [
  { icon: TrendingUp, title: "Optimize a Gig", note: "Review before changing", tone: "bg-brand-100 text-brand-700" },
  { icon: Wand2, title: "Create a Gig", note: "Turn expertise into an offer", tone: "bg-lime-soft text-lime-ink" },
  { icon: Compass, title: "Discover Services", note: "Find what to sell", tone: "bg-blue-50 text-blue-800" },
  { icon: LayoutTemplate, title: "Create Portfolio", note: "Show your best work", tone: "bg-orange-50 text-orange-900" },
]

const reviewRows = [
  ["Title clarity", "Good"],
  ["Buyer-focused description", "Improve"],
  ["Tag relevance", "Good"],
] as const

export function HeroStage() {
  return (
    <div aria-hidden className="relative mx-auto max-w-[1040px]">
      {/* orbit rings */}
      <svg viewBox="0 0 1200 600" className="pointer-events-none absolute -top-[90px] -left-[10%] hidden h-auto w-[120%] text-brand-700 md:block">
        <ellipse cx="600" cy="300" rx="580" ry="250" fill="none" stroke="currentColor" strokeOpacity=".14" strokeDasharray="4 8" />
        <ellipse cx="600" cy="300" rx="470" ry="190" fill="none" stroke="currentColor" strokeOpacity=".1" />
        <circle cx="38" cy="250" r="6" fill="currentColor" fillOpacity=".5" />
        <circle cx="1150" cy="190" r="5" fill="currentColor" fillOpacity=".4" />
      </svg>

      {/* floating: service idea */}
      <div className={cn(landingCard, "absolute top-[70px] -left-[70px] z-[4] hidden w-60 animate-float items-center gap-3 rounded-2xl px-4 py-3.5 xl:flex")}>
        <span className="inline-flex size-[38px] items-center justify-center rounded-xl bg-lime text-forest-ink">
          <Compass className="size-5" />
        </span>
        <span className="flex flex-col gap-0.5">
          <strong className="text-sm font-semibold">Service idea found</strong>
          <span className="text-xs text-ink-soft">Next.js performance audits</span>
        </span>
      </div>

      {/* floating: portfolio */}
      <div className={cn(landingCard, "absolute -top-10 -right-[60px] z-[4] hidden w-[230px] animate-float-slow rounded-2xl p-3 xl:block")}>
        <div className="flex items-center gap-1.5 pb-2.5 text-xs text-ink-700">
          <Globe className="size-[15px]" />
          yourname.com
        </div>
        <div className="relative h-[86px] overflow-hidden rounded-[10px] bg-linear-135 from-brand-700 via-brand-500 via-60% to-lime">
          <div className="absolute top-3.5 left-3 h-2 w-[90px] rounded bg-white/90" />
          <div className="absolute top-7 left-3 h-1.5 w-[60px] rounded bg-white/55" />
          <div className="absolute -right-3.5 -bottom-5 size-[70px] rounded-full border-[10px] border-white/25" />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <div className="h-[34px] rounded-lg bg-brand-50" />
          <div className="h-[34px] rounded-lg bg-lime-soft" />
          <div className="h-[34px] rounded-lg bg-brand-50" />
        </div>
      </div>

      {/* browser window */}
      <div className="relative z-[3] overflow-hidden rounded-[22px] border border-ink-300 bg-white shadow-[0_50px_100px_-40px_oklch(0.22_0.025_173/0.35),0_0_0_10px_oklch(1_0_0/0.55)]">
        <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-25 px-[18px] py-3.5">
          <span className="size-[11px] rounded-full bg-red-200" />
          <span className="size-[11px] rounded-full bg-amber-200" />
          <span className="size-[11px] rounded-full bg-brand-200" />
          <span className="ml-3.5 rounded-full bg-ink-100 px-3.5 py-[5px] text-xs text-ink-soft">app.gigwise · workspace</span>
        </div>
        <div className="flex min-h-[420px]">
          <div className="hidden w-[220px] shrink-0 flex-col gap-1 border-r border-ink-100 px-3.5 py-5 text-[13px] text-ink-700 md:flex">
            <div className="flex items-center gap-2 px-2 pb-3.5 font-bold text-forest-ink">
              <span className="size-[22px] rounded-[7px] bg-brand-700" />
              Gigwise
            </div>
            <div className="rounded-[10px] bg-brand-100 px-2.5 py-[9px] font-semibold text-brand-700">Overview</div>
            {["Discover Services", "Create a Gig", "Optimize Gig", "Growth Roadmap"].map((item) => (
              <div key={item} className="px-2.5 py-[9px]">{item}</div>
            ))}
            <div className="px-2.5 pt-4 pb-1.5 text-[11px] font-semibold tracking-widest text-ink-soft">PORTFOLIO</div>
            <div className="px-2.5 py-[9px]">Portfolio Websites</div>
          </div>
          <div className="min-w-0 flex-1 bg-ink-25/60 p-5 md:p-[26px]">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-[22px] font-semibold tracking-[-0.02em]">Welcome back</div>
                <div className="mt-1 text-[13px] text-ink-soft">Here’s where your freelance business stands today.</div>
              </div>
              <Chip className="bg-lime-soft text-lime-ink">Step 1 of 4</Chip>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {shortcuts.map(({ icon: Icon, title, note, tone }) => (
                <div key={title} className="flex gap-3 rounded-[14px] border border-ink-200 bg-white p-4">
                  <span className={cn("inline-flex size-[34px] shrink-0 items-center justify-center rounded-[10px]", tone)}>
                    <Icon className="size-[17px]" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="mt-0.5 text-xs text-ink-soft">{note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3.5 max-w-[460px] rounded-[14px] border border-ink-200 bg-white p-[18px]">
              <div className="text-sm font-semibold">Recommended next steps</div>
              <div className="mt-3 flex items-center gap-2 text-[13px] text-ink-700">
                <CircleCheck className="size-[17px] text-brand-700" />
                Discover a service worth offering
              </div>
              <div className="mt-2 flex items-center gap-2 text-[13px] text-ink-soft">
                <Circle className="size-[17px]" />
                Draft your first gig
              </div>
              <div className="mt-3.5 h-1.5 overflow-hidden rounded-md bg-ink-100">
                <div className="h-full w-[38%] rounded-md bg-brand-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* floating: gig review */}
      <div className={cn(landingCard, "absolute -right-20 -bottom-[50px] z-[5] hidden w-[290px] animate-float rounded-[18px] p-[18px] xl:block")}>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="inline-flex size-7 items-center justify-center rounded-[9px] bg-lime">
            <Sparkles className="size-[15px]" />
          </span>
          Gig review
        </div>
        <div className="mt-3.5 flex flex-col gap-[9px] text-[13px] text-ink-700">
          {reviewRows.map(([label, status]) => (
            <div key={label} className="flex justify-between">
              {label}
              <Chip className={cn("px-[9px] py-0.5 text-[11px]", status === "Good" ? "bg-brand-100 text-brand-800" : "bg-orange-100 text-orange-900")}>
                {status}
              </Chip>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-[10px] bg-sage px-3 py-2.5 text-xs leading-normal text-ink-700">
          Start with the description. Buyers decide in the first two lines.
        </div>
      </div>

      {/* sparkle */}
      <svg viewBox="0 0 24 24" className="absolute bottom-[30px] -left-[30px] z-[4] hidden size-11 animate-float-slow text-brand-700 xl:block">
        <path d="M12 1l2.4 8.6L23 12l-8.6 2.4L12 23l-2.4-8.6L1 12l8.6-2.4z" fill="currentColor" />
      </svg>
    </div>
  )
}
