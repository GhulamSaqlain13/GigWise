import "server-only"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { cacheTag } from "next/cache"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createAdminClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured, supabasePublishableKey, supabaseUrl } from "@/lib/supabase/env"
import { resolveSettings, type SiteSettings, type SiteSettingsKey } from "./schema"

export const SITE_SETTINGS_TAG = "site-settings"

/**
 * Without Supabase, settings live in a git-ignored JSON file so the admin panel
 * can be tried locally. This is dev-only: in production without Supabase the
 * admin panel is disabled and defaults are used.
 */
export const isDemoAdmin = !isSupabaseConfigured && process.env.NODE_ENV !== "production"
const demoFile = path.join(process.cwd(), ".data", "site-settings.json")

/** Public, cached read used by the landing page and workspace shell. */
export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache"
  cacheTag(SITE_SETTINGS_TAG)
  return resolveSettings(await readRaw())
}

async function readRaw(): Promise<Record<string, unknown>> {
  if (isSupabaseConfigured) {
    // Cookie-less client: settings are public (RLS "public read"), and cached
    // functions can't read request cookies.
    const supabase = createSupabaseClient(supabaseUrl, supabasePublishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data, error } = await supabase.from("site_settings").select("data").eq("id", 1).maybeSingle()
    if (error) {
      console.error("site_settings read failed; using defaults", error.message)
      return {}
    }
    return (data?.data as Record<string, unknown>) ?? {}
  }
  if (isDemoAdmin) {
    try {
      return JSON.parse(await readFile(demoFile, "utf8"))
    } catch {
      return {}
    }
  }
  return {}
}

/**
 * Replace one top-level key. Callers must have verified the super admin and
 * validated `value` with settingsSchemas[key] first.
 */
export async function writeSettingsKey<K extends SiteSettingsKey>(
  key: K,
  value: SiteSettings[K] | null,
  actorId: string | null,
) {
  if (isSupabaseConfigured) {
    const admin = createAdminClient()
    const { data, error } = await admin.from("site_settings").select("data").eq("id", 1).maybeSingle()
    if (error) throw new Error(error.message)
    const next = { ...((data?.data as Record<string, unknown>) ?? {}) }
    if (value === null) delete next[key]
    else next[key] = value
    const { error: writeError } = await admin
      .from("site_settings")
      .upsert({ id: 1, data: next, updated_by: actorId })
    if (writeError) throw new Error(writeError.message)
    return
  }
  if (!isDemoAdmin) throw new Error("Settings can't be saved without Supabase in production.")
  const next = await readRaw()
  if (value === null) delete next[key]
  else next[key] = value
  await mkdir(path.dirname(demoFile), { recursive: true })
  await writeFile(demoFile, JSON.stringify(next, null, 2))
}
