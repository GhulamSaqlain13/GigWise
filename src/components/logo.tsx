import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({
  href = "/",
  size = "md",
  tone = "default",
  className,
}: {
  href?: string
  size?: "md" | "lg"
  /** "inverse" for dark surfaces (auth brand panel). */
  tone?: "default" | "inverse"
  className?: string
}) {
  const px = size === "lg" ? 30 : 26
  return (
    <Link href={href} aria-label="Gigwise home" className={cn("group inline-flex items-center gap-2", className)}>
      <svg width={px} height={px} viewBox="0 0 26 26" fill="none" aria-hidden>
        <rect width="26" height="26" rx="7" className="fill-primary transition-colors group-hover:fill-emerald-deep" />
        <path
          d="M17.4 9.2c-.9-1.1-2.3-1.7-3.9-1.7-2.9 0-5 2.2-5 5.5s2.1 5.5 5.1 5.5c2.5 0 4.3-1.4 4.7-3.6h-4.4v-1.6h6.3c0 .2.1.5.1.7 0 3.5-2.7 6.1-6.7 6.1S6 16.6 6 13s2.6-7.1 7.5-7.1c2.3 0 4.2.8 5.5 2.1l-1.6 1.2Z"
          fill="white"
        />
      </svg>
      <span
        className={cn(
          "font-display font-bold tracking-tight",
          size === "lg" ? "text-xl" : "text-[17px]",
          tone === "inverse" ? "text-white" : "text-foreground",
        )}
      >
        Gigwise
      </span>
    </Link>
  )
}
