import Link from "next/link"
import { MiniWindow } from "@/components/illustrations/previews"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <Logo />
      <div aria-hidden className="w-full max-w-[260px]">
        <MiniWindow path="gigwise.app/…">
          <div className="flex flex-col items-center gap-2 py-4">
            <span className="font-display text-3xl font-bold tracking-tight text-border-strong">404</span>
            <span className="block h-1.5 w-24 rounded-full bg-ink-100" />
            <span className="block h-1.5 w-16 rounded-full bg-ink-100" />
          </div>
        </MiniWindow>
      </div>
      <div className="max-w-sm">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-ink-soft">The link may be broken, or the page may have moved.</p>
      </div>
      <div className="flex gap-2">
        <Link href="/dashboard" className={buttonVariants()}>Go to overview</Link>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>Back to website</Link>
      </div>
    </div>
  )
}
