import { createBrowserClient } from "@supabase/ssr"
import { supabasePublishableKey, supabaseUrl } from "./env"

// Browser client for Client Components. Uses the user's session cookie, so
// every query is subject to RLS.
export function createClient() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey)
}
