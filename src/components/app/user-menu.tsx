import Link from "next/link"
import { ArrowRight, CloudCheck, LogIn, LogOut, ShieldCheck } from "lucide-react"
import { getAdminContext } from "@/lib/admin"
import { getCurrentUser } from "@/lib/auth"
import { signOut } from "@/app/(auth)/actions"

const iconBtn = "grid size-11 shrink-0 place-items-center rounded-[10px] text-ink-soft hover:bg-ink-50 hover:text-foreground"

// Server Component: reads the session, so it must render inside <Suspense>.
// Rendered at the bottom of the sidebar (desktop rail and mobile drawer).
export async function UserMenu() {
  const [user, admin] = await Promise.all([getCurrentUser(), getAdminContext()])
  const adminLink = admin && (
    <Link
      href="/admin"
      className="flex items-center gap-2.5 rounded-[10px] p-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50 hover:text-foreground"
    >
      <ShieldCheck className="size-[18px] text-ink-soft" aria-hidden /> Admin panel
    </Link>
  )

  if (!user) {
    return (
      <>
        <SyncCard />
        <div className="mt-4 space-y-1 border-t pt-3.5">
          {adminLink}
          <div className="flex items-center gap-2.5 px-2.5 py-1">
            <Avatar initials="D" />
            <span className="min-w-0 flex-1" title="Supabase isn't configured or you're signed out. Data stays in this browser.">
              <span className="block truncate text-[13px] font-bold text-foreground">Demo mode</span>
              <span className="block text-xs text-ink-soft">Saved in this browser</span>
            </span>
            <Link href="/login" className={iconBtn} aria-label="Sign in" title="Sign in">
              <LogIn className="size-[18px]" />
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="space-y-1 border-t pt-3.5">
      {adminLink}
      <div className="flex items-center gap-2.5 px-2.5 py-1">
        <Avatar initials={user.initials} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-bold text-foreground">{user.displayName}</span>
          {user.email && <span className="block truncate text-xs text-ink-soft">{user.email}</span>}
        </span>
        <form action={signOut}>
          <button type="submit" className={iconBtn} aria-label="Sign out" title="Sign out">
            <LogOut className="size-[18px]" />
          </button>
        </form>
      </div>
    </div>
  )
}

/** Demo-mode prompt: data only lives in this browser until there's an account. */
function SyncCard() {
  return (
    <div className="relative flex flex-col gap-2.5 overflow-hidden rounded-2xl bg-brand-50 p-[18px]">
      <div aria-hidden className="absolute -top-[42px] -right-[42px] size-[120px] rounded-full border-[18px] border-brand-100" />
      <div aria-hidden className="absolute top-16 right-[26px] size-2.5 rounded-full bg-lime" />
      <span className="relative grid size-10 place-items-center rounded-xl bg-white shadow-[0_6px_14px_-8px_oklch(0.318_0.054_170/0.4)]">
        <CloudCheck className="size-5 text-brand-600" aria-hidden />
      </span>
      <p className="relative text-sm font-bold text-foreground">Sync your workspace</p>
      <p className="relative text-xs leading-normal text-ink-600">
        Your drafts are saved in this browser for now. Create an account to keep them on every device.
      </p>
      <Link href="/signup" className="relative mt-0.5 inline-flex items-center gap-1.5 self-start text-[13px] font-bold text-pine hover:text-evergreen">
        Create account <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  )
}

export function Avatar({ initials }: { initials: string }) {
  return (
    <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-lime text-sm font-extrabold text-pine" aria-hidden>
      {initials}
    </span>
  )
}
