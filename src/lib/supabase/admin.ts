import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { supabaseUrl } from "./env"

// Service-role client: BYPASSES RLS. Server-only, never import from client code.
// Use it only for writes users may not make themselves (gig_audits,
// service_opportunities, research_evidence, ai_jobs, usage_events,
// subscriptions, billing_events) and always after checking ownership yourself.
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY
  if (!supabaseUrl || !secretKey) {
    throw new Error("SUPABASE_SECRET_KEY / NEXT_PUBLIC_SUPABASE_URL are not set")
  }
  return createSupabaseClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
