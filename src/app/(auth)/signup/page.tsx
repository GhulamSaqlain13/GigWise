import type { Metadata } from "next"
import { Suspense } from "react"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { AuthForm } from "../auth-form"

export const metadata: Metadata = { title: "Create account" }

export default function SignupPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Create your free account</h1>
      <p className="mt-1.5 text-sm text-ink-soft">Find a service, build a gig, and know what to improve next.</p>
      <div className="mt-8">
        <Suspense>
          <AuthForm mode="signup" demoMode={!isSupabaseConfigured} />
        </Suspense>
      </div>
    </>
  )
}
