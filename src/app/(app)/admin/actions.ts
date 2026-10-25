"use server"

import { refresh, updateTag } from "next/cache"
import { z } from "zod"
import { isEnvSuperAdmin, logAdminAction, requireSuperAdmin, type AdminContext } from "@/lib/admin"
import { allNavItems } from "@/lib/nav"
import {
  ALWAYS_ON,
  BUILT_IN_SECTIONS,
  settingsSchemas,
  type LandingSettings,
  type SiteSettings,
  type SiteSettingsKey,
  type ToolSettings,
} from "@/lib/site/schema"
import { SITE_SETTINGS_TAG, writeSettingsKey } from "@/lib/site/store"
import { createAdminClient } from "@/lib/supabase/admin"

// Every action re-checks the super admin itself: Server Actions are public
// endpoints, so hiding the admin UI is not protection.

export type ActionResult = { ok: true } | { ok: false; error: string }

function firstIssue(error: z.ZodError) {
  const issue = error.issues[0]
  const where = issue.path.length ? `${issue.path.join(" › ")}: ` : ""
  return `${where}${issue.message}`
}

function failure(e: unknown): ActionResult {
  if (e instanceof z.ZodError) return { ok: false, error: firstIssue(e) }
  return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." }
}

/** Keep the section list consistent: known ids only, no duplicates, nothing lost. */
function normalizeLanding(value: LandingSettings): LandingSettings {
  const customIds = new Set(value.custom.map((c) => c.id))
  if (customIds.size !== value.custom.length) throw new Error("Custom section ids must be unique.")
  const known = (sid: string) => sid in BUILT_IN_SECTIONS || customIds.has(sid)
  const seen = new Set<string>()
  const sections = value.sections.filter((s) => {
    if (!known(s.id) || seen.has(s.id)) return false
    seen.add(s.id)
    return true
  })
  for (const sid of [...Object.keys(BUILT_IN_SECTIONS), ...customIds]) {
    if (!seen.has(sid)) sections.push({ id: sid, visible: customIds.has(sid) })
  }
  return { ...value, sections }
}

function normalizeTools(value: ToolSettings): ToolSettings {
  const hrefs = new Set(allNavItems.map((i) => i.href))
  const seen = new Set<string>()
  return value
    .filter((t) => {
      if (!hrefs.has(t.href) || seen.has(t.href)) return false
      seen.add(t.href)
      return true
    })
    .map((t) => (ALWAYS_ON.includes(t.href) ? { ...t, enabled: true } : t))
}

async function saveKey<K extends SiteSettingsKey>(key: K, value: unknown): Promise<ActionResult> {
  try {
    const ctx = await requireSuperAdmin()
    const parsed = settingsSchemas[key].safeParse(value)
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) }
    let data = parsed.data as SiteSettings[K]
    if (key === "landing") data = normalizeLanding(data as LandingSettings) as SiteSettings[K]
    if (key === "tools") data = normalizeTools(data as ToolSettings) as SiteSettings[K]
    await writeSettingsKey(key, data, ctx.userId)
    await logAdminAction(ctx, `settings.${key}.update`, key)
    updateTag(SITE_SETTINGS_TAG)
    return { ok: true }
  } catch (e) {
    return failure(e)
  }
}

export async function saveLanding(value: unknown) {
  return saveKey("landing", value)
}
export async function saveTools(value: unknown) {
  return saveKey("tools", value)
}
export async function saveThemes(value: unknown) {
  return saveKey("themes", value)
}
export async function saveAnnouncement(value: unknown) {
  return saveKey("announcement", value)
}

const keySchema = z.enum(["landing", "tools", "themes", "announcement"])

/** Drop a stored key so its built-in defaults apply again. */
export async function resetSettings(key: unknown): Promise<ActionResult> {
  try {
    const ctx = await requireSuperAdmin()
    const area = keySchema.parse(key)
    await writeSettingsKey(area, null, ctx.userId)
    await logAdminAction(ctx, `settings.${area}.reset`, area)
    updateTag(SITE_SETTINGS_TAG)
    return { ok: true }
  } catch (e) {
    return failure(e)
  }
}

// ---------------------------------------------------------------------------
// Users (Supabase only)
// ---------------------------------------------------------------------------

type SupabaseAdmin = Extract<AdminContext, { mode: "supabase" }>

async function requireSupabaseAdmin(): Promise<SupabaseAdmin> {
  const ctx = await requireSuperAdmin()
  if (ctx.mode !== "supabase") throw new Error("User management needs Supabase to be configured.")
  return ctx
}

/** Guards for changing another account: never yourself, never an env super admin. */
async function targetUser(id: unknown) {
  const ctx = await requireSupabaseAdmin()
  const uid = z.uuid().parse(id)
  if (uid === ctx.userId) throw new Error("You can't change your own account here.")
  const { data, error } = await createAdminClient().auth.admin.getUserById(uid)
  if (error || !data.user) throw new Error("User not found.")
  if (isEnvSuperAdmin(data.user.email)) {
    throw new Error("This account is a super admin through SUPER_ADMIN_EMAILS. Change the env variable instead.")
  }
  return { ctx, uid, email: data.user.email ?? null }
}

export async function setUserRole(id: unknown, role: unknown): Promise<ActionResult> {
  try {
    const { ctx, uid, email } = await targetUser(id)
    const value = z.enum(["user", "super_admin"]).parse(role)
    const { error } = await createAdminClient().from("profiles").update({ role: value }).eq("id", uid)
    if (error) throw new Error(error.message)
    await logAdminAction(ctx, "user.role", email ?? uid, { role: value })
    refresh()
    return { ok: true }
  } catch (e) {
    return failure(e)
  }
}

export async function setUserSuspended(id: unknown, suspended: unknown): Promise<ActionResult> {
  try {
    const { ctx, uid, email } = await targetUser(id)
    const value = z.boolean().parse(suspended)
    const admin = createAdminClient()
    // The auth ban is what actually blocks sign-in and token refresh.
    const { error: banError } = await admin.auth.admin.updateUserById(uid, { ban_duration: value ? "876000h" : "none" })
    if (banError) throw new Error(banError.message)
    const { error } = await admin
      .from("profiles")
      .update({ suspended_at: value ? new Date().toISOString() : null })
      .eq("id", uid)
    if (error) throw new Error(error.message)
    await logAdminAction(ctx, value ? "user.suspend" : "user.unsuspend", email ?? uid)
    refresh()
    return { ok: true }
  } catch (e) {
    return failure(e)
  }
}

/** Grant a plan manually, stored as an "admin" subscription separate from paid billing. */
export async function setUserPlan(id: unknown, plan: unknown): Promise<ActionResult> {
  try {
    const ctx = await requireSupabaseAdmin()
    const uid = z.uuid().parse(id)
    const value = z.enum(["free", "starter", "pro"]).parse(plan)
    const admin = createAdminClient()
    const externalId = `admin-${uid}`
    const { error } =
      value === "free"
        ? await admin.from("subscriptions").delete().eq("provider", "admin").eq("external_subscription_id", externalId)
        : await admin.from("subscriptions").upsert(
            { user_id: uid, provider: "admin", external_subscription_id: externalId, plan: value, status: "active" },
            { onConflict: "provider,external_subscription_id" },
          )
    if (error) throw new Error(error.message)
    await logAdminAction(ctx, "user.plan", uid, { plan: value })
    refresh()
    return { ok: true }
  } catch (e) {
    return failure(e)
  }
}

export async function deleteUser(id: unknown): Promise<ActionResult> {
  try {
    const { ctx, uid, email } = await targetUser(id)
    const { error } = await createAdminClient().auth.admin.deleteUser(uid)
    if (error) throw new Error(error.message)
    await logAdminAction(ctx, "user.delete", email ?? uid)
    refresh()
    return { ok: true }
  } catch (e) {
    return failure(e)
  }
}
