import { Logo } from "@/components/logo"

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <Logo size="lg" />
      <div className="w-full max-w-[420px]">{children}</div>
      <p className="max-w-sm text-center text-xs text-muted-foreground">
        Independent product, not affiliated with Fiverr. We never ask for your Fiverr password.
      </p>
    </div>
  )
}
