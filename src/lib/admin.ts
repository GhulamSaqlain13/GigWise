import "server-only"
import { cache } from "react"
import { getCurrentUser } from "@/lib/auth"
import { isDemoAdmin } from "@/lib/site/store"
import { createAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { createClient } from "@/lib/supabase/server"

export type AdminContext =
  /** Local dev without Supabase: no accounts, the panel is open to whoever runs the app. */
  | { mode: "demo"; userId: null; email: null }
  | { mode: "supabase"; userId: string; email: string | null; source: "env" | "role" }

/** Accounts listed in SUPER_ADMIN_EMAILS (comma-separated) are always super admins. */
export function isEnvSuperAdmin(email: string | null | undefined) {
  if (!email) return false
  const list = (process.env.SUPER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return list.includes(email.toLowerCase())
}

/**
 * Who is the current super admin, if anyone. Reads the session, so callers must
 * render inside <Suspense>. Server Actions must call requireSuperAdmin() again:
 * this check (not the proxy or a hidden link) is what protects admin data.
 */
export const getAdminContext = cache(async (): Promise<AdminContext | null> => {
  if (!isSupabaseConfigured) return isDemoAdmin ? { mode: "demo", userId: null, email: null } : null

  const user = await getCurrentUser()
  if (!user) return null
  if (isEnvSuperAdmin(user.email)) return { mode: "supabase", userId: user.id, email: user.email, source: "env" }

  const supabase = await createClient()
  const { data } = await supabase.from("profiles").select("role, suspended_at").eq("id", user.id).maybeSingle()
  if (data?.role === "super_admin" && !data.suspended_at) {
    return { mode: "supabase", userId: user.id, email: user.email, source: "role" }
  }
  return null
})

export async function requireSuperAdmin(): Promise<AdminContext> {
  const ctx = await getAdminContext()
  if (!ctx) throw new Error("Only a super admin can do that.")
  return ctx
}

/** Record an admin action. Best effort: a logging failure never blocks the change. */
export async function logAdminAction(ctx: AdminContext, action: string, target: string, details: Record<string, unknown> = {}) {
  if (ctx.mode !== "supabase") return
  try {
    const { error } = await createAdminClient()
      .from("admin_audit_log")
      .insert({ actor_id: ctx.userId, action, target, details: { ...details, actor_email: ctx.email } })
    if (error) console.error("admin_audit_log insert failed", error.message)
  } catch (e) {
    console.error("admin_audit_log insert failed", e)
  }
}
