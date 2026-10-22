"use client"

import Link from "next/link"
import { useEffect } from "react"
import { RotateCw, TriangleAlert } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"

// Error boundary for every workspace page. The shell (sidebar, top bar) stays usable.
export default function WorkspaceError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // TODO: report to Sentry once it's configured.
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <span className="mb-4 grid size-11 place-items-center rounded-lg bg-destructive/10 text-destructive">
        <TriangleAlert className="size-5" aria-hidden />
      </span>
      <h1 className="text-xl font-semibold">This page couldn&apos;t load</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong while showing this page. Your saved drafts are not affected. Try again, or go back to the overview.
      </p>
      <div className="mt-6 flex gap-2">
        <Button onClick={() => retry()}><RotateCw data-icon="inline-start" /> Try again</Button>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>Go to overview</Link>
      </div>
    </div>
  )
}
