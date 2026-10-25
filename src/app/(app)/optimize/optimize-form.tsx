"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { ScanText } from "lucide-react"
import { toast } from "sonner"
import { BulletList, Caveat, EmptyResult, Field, ResultPanel, ToolLayout, controlClass } from "@/components/app/form-bits"
import { AuditPreview } from "@/components/illustrations/previews"
import { Button } from "@/components/ui/button"
import { useLocalStore } from "@/lib/local-store"
import { auditGigContent } from "@/lib/tools/demo-logic"
import { optimizeSchema } from "@/lib/tools/schemas"
import { cn } from "@/lib/utils"

type Values = z.output<typeof optimizeSchema>

export function OptimizeForm() {
  const [, setAudits] = useLocalStore("audits")
  const [result, setResult] = useState<{ issues: string[]; score: number } | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof optimizeSchema>, unknown, Values>({
    resolver: zodResolver(optimizeSchema),
    defaultValues: { username: "", gigUrl: "", title: "", description: "" },
  })

  function onSubmit(v: Values) {
    const audit = auditGigContent(v.title, v.description)
    setResult(audit)
    try {
      setAudits((prev) => [
        { ...audit, title: v.title, description: v.description, url: v.gigUrl, username: v.username, createdAt: new Date().toISOString() },
        ...prev,
      ])
      toast.success("Review saved")
    } catch {
      toast.error("Couldn't save the review. Browser storage is full or blocked.")
    }
  }

  return (
    <ToolLayout
      input={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="username" label="Fiverr username" hint="Optional">
              <input id="username" placeholder="your_username" className={controlClass} {...register("username")} />
            </Field>
            <Field id="gigUrl" label="Gig URL" hint="Optional. Saved as a reference only." error={errors.gigUrl?.message}>
              <input id="gigUrl" type="url" placeholder="https://www.fiverr.com/..." className={controlClass}
                aria-invalid={!!errors.gigUrl} {...register("gigUrl")} />
            </Field>
          </div>
          <Field id="title" label="Current gig title" error={errors.title?.message}>
            <input id="title" placeholder="I will build any website" className={controlClass}
              aria-invalid={!!errors.title} {...register("title")} />
          </Field>
          <Field id="description" label="Current gig description" error={errors.description?.message}>
            <textarea id="description" rows={7} placeholder="Paste your gig description" className={controlClass}
              aria-invalid={!!errors.description} {...register("description")} />
          </Field>
          <Button type="submit">Review gig</Button>
        </form>
      }
      output={
        result ? (
          <ResultPanel title="Content review" source="template">
            <div className="flex items-center gap-4">
              <p className="text-3xl font-semibold tracking-tight text-brand-800 tabular-nums">
                {result.score}<span className="text-base font-normal text-muted-foreground">/100</span>
              </p>
              <div className="flex-1">
                <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                  <div className={cn("h-full rounded-full", result.score >= 70 ? "bg-brand-500" : "bg-warning")} style={{ width: `${result.score}%` }} />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">Internal content check. Not a Fiverr SEO or ranking score.</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-[13px] font-medium">What to improve</p>
              <BulletList items={result.issues} />
            </div>
            <Caveat>Next: rewrite the title around one buyer problem, then check your thumbnail and packages.</Caveat>
          </ResultPanel>
        ) : (
          <EmptyResult icon={ScanText} title="Your review will appear here" preview={<AuditPreview />}>
            Paste your gig title and description. Gigwise never logs in to Fiverr or fetches your gig.
          </EmptyResult>
        )
      }
    />
  )
}
