import type { Metadata } from "next"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { AuthForm } from "../auth-form"

export const metadata: Metadata = { title: "Create account" }

export default function SignupPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Create your free account</CardTitle>
        <CardDescription>Find a service, build a gig, and know what to improve next.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <AuthForm mode="signup" demoMode={!isSupabaseConfigured} />
        </Suspense>
      </CardContent>
    </Card>
  )
}
