import type { Metadata } from "next"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { AuthForm } from "../auth-form"

export const metadata: Metadata = { title: "Sign in" }

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Welcome back</CardTitle>
        <CardDescription>Sign in to continue building better gigs.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <AuthForm mode="login" demoMode={!isSupabaseConfigured} />
        </Suspense>
      </CardContent>
    </Card>
  )
}
