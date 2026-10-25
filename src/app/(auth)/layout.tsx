import Link from "next/link"
import { Check, Sparkles } from "lucide-react"
import { Logo } from "@/components/logo"

const promises = ["Find a service worth building", "Make your offer easier to understand", "Show clients what you can do"]

/** Illustrative example of a gig review, labelled as such. */
function SampleReview() {
  const rows = [
    ["Title clarity", "Good"],
    ["Buyer-focused description", "Improve"],
    ["Package scope", "Good"],
  ]
  return (
    <div aria-hidden className="mt-10 max-w-sm rounded-xl border border-white/10 bg-surface-dark-soft p-4">
      <div className="flex items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-lg bg-primary/25">
          <Sparkles className="size-3.5 text-brand-300" />
        </span>
        <p className="text-xs font-semibold text-white">Gig review</p>
        <span className="ml-auto text-[11px] text-white/40">Example</span>
      </div>
      <div className="mt-3 space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-2 text-xs">
            <span className="text-white/60">{label}</span>
            <span
              className={
                value === "Good"
                  ? "rounded-full bg-primary/25 px-2 py-0.5 text-[11px] font-medium text-brand-200"
                  : "rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/70"
              }
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-lg bg-white/5 px-3 py-2 text-[11px] leading-relaxed text-white/60">
        Start with the description. Buyers decide in the first two lines.
      </p>
    </div>
  )
}

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-[42%] flex-col justify-between bg-surface-dark p-10 lg:flex">
        <Logo tone="inverse" />
        <div>
          <h2 className="font-display text-2xl leading-snug font-semibold text-white">
            Grow as a freelancer, with calm and clarity.
          </h2>
          <ul className="mt-6 space-y-3">
            {promises.map((promise) => (
              <li key={promise} className="flex items-center gap-2.5 text-sm text-white/70">
                <Check className="size-4 shrink-0 text-brand-400" aria-hidden /> {promise}
              </li>
            ))}
          </ul>
          <SampleReview />
        </div>
        <p className="text-xs leading-relaxed text-white/50">
          Gigwise is an independent product for freelancers and is not affiliated with Fiverr. We never ask for your
          Fiverr password.
        </p>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="p-6 lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-16">
          <div className="w-full max-w-sm">
            {children}
            <p className="mt-8 text-center text-xs text-ink-faint">
              <Link href="/" className="hover:text-foreground">Back to the Gigwise website</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
