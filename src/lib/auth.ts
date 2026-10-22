import "server-only"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export type CurrentUser = {
  id: string
  email: string | null
  displayName: string
  initials: string
}

// Data Access Layer: the single place that reads the session.
// Returns null in demo mode or when signed out. Reads cookies, so callers
// must render inside <Suspense> (cacheComponents).
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured) return null

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims?.sub) return null

  const email = typeof claims.email === "string" ? claims.email : null
  const meta = (claims.user_metadata ?? {}) as Record<string, unknown>
  const displayName =
    (typeof meta.display_name === "string" && meta.display_name) ||
    email?.split("@")[0] ||
    "Creator"

  return {
    id: claims.sub,
    email,
    displayName,
    initials: displayName.slice(0, 2).toUpperCase(),
  }
}
