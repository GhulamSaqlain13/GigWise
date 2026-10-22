import Link from "next/link"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ href = "/", size = "md", className }: { href?: string; size?: "md" | "lg"; className?: string }) {
  return (
    <Link
      href={href}
      aria-label="Gigwise home"
      className={cn(
        "flex items-center gap-2.5 font-semibold tracking-[-0.05em]",
        size === "lg" ? "text-2xl" : "text-xl",
        className,
      )}
    >
      <span
        className={cn(
          "grid place-items-center rounded-[11px] bg-primary text-primary-foreground",
          size === "lg" ? "size-9" : "size-8",
        )}
      >
        <Sparkles className="size-[18px]" aria-hidden />
      </span>
      <span>
        gigwise<span className="text-brand-500">.</span>
      </span>
    </Link>
  )
}
