import { Suspense } from "react"
import { AnnouncementBar } from "@/components/announcement-bar"
import { NavProvider, RouteGate } from "@/components/app/nav-context"
import { Sidebar } from "@/components/app/sidebar"
import { Topbar } from "@/components/app/topbar"
import { Avatar, UserMenu } from "@/components/app/user-menu"
import { landingFontVars } from "@/components/marketing/fonts"
import { ThemesProvider } from "@/components/portfolio/themes-context"
import { getSiteSettings } from "@/lib/site/store"

// Signed-in workspace shell. Auth gating happens in src/proxy.ts; the shell is
// static (site settings are cached) and only the user menu streams in.
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings()
  const user = (
    <Suspense fallback={<div className="border-t px-2.5 pt-4.5 pb-1"><Avatar initials="" /></div>}>
      <UserMenu />
    </Suspense>
  )
  return (
    <NavProvider tools={settings.tools}>
      <ThemesProvider themes={settings.themes}>
        <div className={`${landingFontVars} flex min-h-dvh bg-sage font-display text-foreground`}>
          <Sidebar footer={user} />
          <div className="flex min-w-0 flex-1 flex-col">
            {settings.announcement.showInWorkspace && <AnnouncementBar announcement={settings.announcement} />}
            <Topbar userSlot={user} />
            <main className="mx-auto w-full max-w-[1240px] px-4 pt-7 pb-10 md:px-8">
              <RouteGate>{children}</RouteGate>
              <p className="mt-12 border-t pt-5 text-[12.5px] leading-relaxed text-ink-soft">
                Gigwise is independent and not affiliated with Fiverr. It can&apos;t guarantee rankings or orders.
                Demo tools keep data in your browser, so avoid entering sensitive information.
              </p>
            </main>
          </div>
        </div>
      </ThemesProvider>
    </NavProvider>
  )
}
