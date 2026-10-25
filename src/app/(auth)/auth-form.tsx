"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, signUp, type AuthState } from "./actions"

export function AuthForm({ mode, demoMode }: { mode: "login" | "signup"; demoMode: boolean }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    mode === "login" ? signIn : signUp,
    undefined,
  )
  const params = useSearchParams()
  const linkError = params.get("error") === "link"

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={params.get("next") ?? "/dashboard"} />

      {demoMode && (
        <p className="rounded-[10px] bg-accent p-3 text-xs text-accent-foreground">
          Demo mode: Supabase isn&apos;t configured, so sign-in is disabled.{" "}
          <Link href="/dashboard" className="font-semibold underline">
            Open the demo workspace
          </Link>
          .
        </p>
      )}

      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="displayName">Your name</Label>
          <Input id="displayName" name="displayName" autoComplete="name" required className="h-10" />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required className="h-10" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={8}
          required
          className="h-10"
        />
      </div>

      {(state?.error || linkError) && (
        <p role="alert" className="text-sm text-destructive">
          {state?.error ?? "That link is invalid or has expired. Please sign in again."}
        </p>
      )}
      {state?.message && (
        <p role="status" className="text-sm text-success">
          {state.message}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={pending || demoMode}>
        {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create free account"}
      </Button>

      <p className="pt-2 text-center text-sm text-ink-soft">
        {mode === "login" ? (
          <>
            New to Gigwise?{" "}
            <Link href="/signup" className="font-medium text-primary hover:text-primary-hover">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
              Sign in
            </Link>
          </>
        )}
      </p>
    </form>
  )
}
