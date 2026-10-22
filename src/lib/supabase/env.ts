// Public Supabase settings. Both are safe to expose to the browser;
// RLS (supabase/migrations) is what protects the data.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ""

// Without credentials the app runs in "demo mode": no auth gate, tools use
// browser localStorage. This keeps the UI runnable before a project exists.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey)
