import { Suspense } from "react"
import { MobileNav } from "@/components/app/mobile-nav"
import { Sidebar } from "@/components/app/sidebar"
import { Topbar } from "@/components/app/topbar"
import { Avatar, UserMenu } from "@/components/app/user-menu"

// Signed-in workspace shell. Auth gating happens in src/proxy.ts; the shell
// itself is static and only the user menu streams in (cacheComponents).
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar
          userSlot={
            <Suspense fallback={<Avatar initials="" />}>
              <UserMenu />
            </Suspense>
          }
        />
        <main className="mx-auto max-w-[1200px] px-4 pt-7 pb-28 md:px-6 lg:px-8 lg:pt-9 lg:pb-16">
          {children}
          <p className="mt-12 border-t pt-5 text-xs text-muted-foreground">
            Gigwise is independent and not affiliated with Fiverr. It can&apos;t guarantee rankings or orders.
            Demo tools keep data in your browser, so avoid entering sensitive information.
          </p>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
