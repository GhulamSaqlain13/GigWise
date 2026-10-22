import Link from "next/link"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <Logo />
      <div className="max-w-sm">
        <p className="text-[13px] font-medium text-muted-foreground">404</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The link may be broken, or the page may have moved.</p>
      </div>
      <div className="flex gap-2">
        <Link href="/dashboard" className={buttonVariants()}>Go to overview</Link>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>Back to website</Link>
      </div>
    </div>
  )
}
