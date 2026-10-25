import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Building blocks for the landing page ("Gigwise Landing Page" ref design):
// pill buttons, eyebrows with a dot, big tight headings with a serif accent.

export const pill = {
  base: "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-transparent px-[22px] text-[15px] font-semibold whitespace-nowrap transition-transform duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-[17px] [&_svg]:shrink-0",
  lg: "min-h-[54px] px-7 text-base",
  dark: "bg-forest-ink text-white",
  brand: "bg-evergreen text-white hover:bg-pine",
  ghost: "border-ink-300 bg-white text-forest-ink",
  lime: "bg-lime text-forest-ink",
  outlineLight: "border-white/30 text-white",
}

export function pillClass(variant: "dark" | "brand" | "ghost" | "lime" | "outlineLight", size?: "lg", className?: string) {
  return cn(pill.base, size === "lg" && pill.lg, pill[variant], className)
}

export const h2 = "text-[clamp(2.25rem,4.4vw,3.25rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance"
export const lead = "text-lg leading-relaxed text-ink-soft"

export function Eyebrow({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "lime" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase",
        tone === "lime" ? "text-lime" : "text-brand-700",
      )}
    >
      <i className={cn("inline-block size-1.5 rounded-full", tone === "lime" ? "bg-lime" : "bg-brand-700")} aria-hidden />
      {children}
    </span>
  )
}

/** Italic serif accent inside a heading. */
export function Accent({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "lime" }) {
  return (
    <span className={cn("font-serif font-normal tracking-normal italic", tone === "lime" ? "text-lime" : "text-brand-700")}>
      {children}
    </span>
  )
}

/** Renders admin text where `*words*` become the serif accent. */
export function withAccent(text: string, render: (word: string, key: number) => ReactNode = (w, k) => <Accent key={k}>{w}</Accent>) {
  return text.split(/\*([^*]+)\*/g).map((part, i) => (i % 2 ? render(part, i) : part))
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", className)}>
      {children}
    </span>
  )
}

/** White card with the ref's soft drop shadow. */
export const landingCard =
  "rounded-[20px] border border-ink-200 bg-white shadow-[0_1px_0_oklch(0.22_0.025_173/0.03),0_18px_40px_-24px_oklch(0.22_0.025_173/0.18)]"

export function Blob({ className }: { className: string }) {
  return <div aria-hidden className={cn("pointer-events-none absolute rounded-full", className)} />
}
