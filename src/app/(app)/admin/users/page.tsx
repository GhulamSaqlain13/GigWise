import type { Metadata } from "next"
import Link from "next/link"
import { getAdminContext, isEnvSuperAdmin } from "@/lib/admin"
import { createAdminClient } from "@/lib/supabase/admin"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UsersTable, type AdminUserRow } from "./users-table"

export const metadata: Metadata = { title: "Admin: users" }

const PER_PAGE = 50

export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/users">) {
  const ctx = await getAdminContext()
  if (ctx?.mode !== "supabase") {
    return (
      <Notice>
        User management needs Supabase. Add your project keys and <code className="font-mono text-xs">SUPABASE_SECRET_KEY</code> to
        <code className="font-mono text-xs"> .env.local</code>, apply the migrations, and list your email in
        <code className="font-mono text-xs"> SUPER_ADMIN_EMAILS</code>.
      </Notice>
    )
  }

  const pageParam = (await searchParams).page
  const page = Math.max(1, Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1)

  let rows: AdminUserRow[] = []
  let total: number | null = null
  try {
    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: PER_PAGE })
    if (error) throw new Error(error.message)
    total = "total" in data && typeof data.total === "number" ? data.total : null
    const ids = data.users.map((u) => u.id)
    const [profiles, subs] = await Promise.all([
      admin.from("profiles").select("id, display_name, role, suspended_at").in("id", ids),
      admin.from("subscriptions").select("user_id, plan, status, provider").in("user_id", ids).in("status", ["trialing", "active", "past_due"]),
    ])
    if (profiles.error) throw new Error(profiles.error.message)
    if (subs.error) throw new Error(subs.error.message)
    const profileById = new Map(profiles.data.map((p) => [p.id as string, p]))
    rows = data.users.map((u) => {
      const profile = profileById.get(u.id)
      const userSubs = subs.data.filter((s) => s.user_id === u.id)
      // Paid subscriptions win over admin grants when showing the plan.
      const sub = userSubs.find((s) => s.provider !== "admin") ?? userSubs[0]
      const envAdmin = isEnvSuperAdmin(u.email)
      return {
        id: u.id,
        email: u.email ?? "(no email)",
        name: (profile?.display_name as string | null) ?? null,
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at ?? null,
        role: envAdmin || profile?.role === "super_admin" ? "super_admin" : "user",
        envAdmin,
        suspended: Boolean(profile?.suspended_at),
        plan: (sub?.plan as AdminUserRow["plan"]) ?? "free",
        paidPlan: Boolean(sub && sub.provider !== "admin"),
        isSelf: u.id === ctx.userId,
      }
    })
  } catch (e) {
    return (
      <Notice tone="error">
        Couldn&apos;t load users: {e instanceof Error ? e.message : "unknown error"}. Check
        <code className="font-mono text-xs"> SUPABASE_SECRET_KEY</code> and that both migrations are applied.
      </Notice>
    )
  }

  const lastPage = total !== null ? Math.max(1, Math.ceil(total / PER_PAGE)) : rows.length < PER_PAGE ? page : page + 1

  return (
    <div className="space-y-4">
      <UsersTable rows={rows} />
      <div className="flex items-center justify-between text-[13px] text-ink-soft">
        <span className="tabular-nums">{total !== null ? `${total} users` : `${rows.length} users on this page`}</span>
        <div className="flex gap-2">
          <Link
            href={`/admin/users?page=${page - 1}`}
            aria-disabled={page <= 1}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), page <= 1 && "pointer-events-none opacity-50")}
          >
            Previous
          </Link>
          <span className="self-center tabular-nums">Page {page} of {lastPage}</span>
          <Link
            href={`/admin/users?page=${page + 1}`}
            aria-disabled={page >= lastPage}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), page >= lastPage && "pointer-events-none opacity-50")}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  )
}

function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "error" }) {
  return (
    <p className={cn("rounded-xl border bg-card px-4 py-6 text-center text-[13px] leading-relaxed", tone === "error" ? "text-destructive" : "text-ink-soft")}>
      {children}
    </p>
  )
}
