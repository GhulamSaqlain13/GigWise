import Link from "next/link"
import { LogIn, LogOut } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { signOut } from "@/app/(auth)/actions"

const iconBtn = "grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"

// Server Component: reads the session, so it must render inside <Suspense>.
export async function UserMenu() {
  const user = await getCurrentUser()

  if (!user) {
    return (
      <span className="ml-1 flex items-center gap-2">
        <span
          className="hidden rounded-md border border-dashed px-2 py-1 text-xs font-medium text-muted-foreground md:inline"
          title="Supabase isn't configured or you're signed out. Data stays in this browser."
        >
          Demo mode
        </span>
        <Link href="/login" className={iconBtn} aria-label="Sign in" title="Sign in">
          <LogIn className="size-[18px]" />
        </Link>
      </span>
    )
  }

  return (
    <span className="ml-1 flex items-center gap-2.5">
      <span className="hidden text-right leading-tight lg:block">
        <span className="block max-w-[180px] truncate text-[13px] font-medium">{user.displayName}</span>
        {user.email && <span className="block max-w-[180px] truncate text-xs text-muted-foreground">{user.email}</span>}
      </span>
      <Avatar initials={user.initials} />
      <form action={signOut}>
        <button type="submit" className={iconBtn} aria-label="Sign out" title="Sign out">
          <LogOut className="size-[18px]" />
        </button>
      </form>
    </span>
  )
}

export function Avatar({ initials }: { initials: string }) {
  return (
    <span className="grid size-8 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground" aria-hidden>
      {initials}
    </span>
  )
}
