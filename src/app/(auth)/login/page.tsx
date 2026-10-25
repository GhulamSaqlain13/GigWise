import type { Metadata } from "next"
import { Suspense } from "react"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { AuthForm } from "../auth-form"

export const metadata: Metadata = { title: "Sign in" }

export default function LoginPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-sm text-ink-soft">Sign in to continue building better gigs.</p>
      <div className="mt-8">
        <Suspense>
          <AuthForm mode="login" demoMode={!isSupabaseConfigured} />
        </Suspense>
      </div>
    </>
  )
}
