"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Activity } from "lucide-react"
import { Caveat, EmptyResult, Field, Metric, ResultPanel, ToolLayout, controlClass } from "@/components/app/form-bits"
import { PageHeader } from "@/components/app/page-header"
import { Button } from "@/components/ui/button"
import { diagnoseFunnel } from "@/lib/tools/demo-logic"
import { funnelSchema } from "@/lib/tools/schemas"

type Values = z.output<typeof funnelSchema>

const fields = [
  { key: "impressions", label: "Impressions", hint: "Times your gig was shown" },
  { key: "clicks", label: "Clicks", hint: "Times it was opened" },
  { key: "orders", label: "Orders", hint: "Orders received" },
] as const

export default function GigDoctorPage() {
  const [result, setResult] = useState<ReturnType<typeof diagnoseFunnel> | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof funnelSchema>, unknown, Values>({
    resolver: zodResolver(funnelSchema),
    defaultValues: { impressions: "1200", clicks: "12", orders: "0" },
  })

  return (
    <>
      <PageHeader
        section="Growth tools"
        title="Gig Problem Doctor"
        description="Use your own numbers from Fiverr analytics to see which stage needs attention."
      />
      <ToolLayout
        input={
          <form onSubmit={handleSubmit((v) => setResult(diagnoseFunnel(v.impressions, v.clicks, v.orders)))} className="space-y-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {fields.map(({ key, label, hint }) => (
                <Field key={key} id={key} label={label} hint={hint} error={errors[key]?.message}>
                  <input id={key} type="number" min={0} inputMode="numeric" className={controlClass} aria-invalid={!!errors[key]} {...register(key)} />
                </Field>
              ))}
            </div>
            <Button type="submit">Diagnose</Button>
          </form>
        }
        output={
          result ? (
            <ResultPanel title="Diagnosis" source="calculated">
              <div className="grid gap-3 sm:grid-cols-2">
                <Metric label="Click-through rate" value={`${result.ctr.toFixed(2)}%`} hint="People who clicked after seeing your gig" />
                <Metric label="Click-to-order rate" value={`${result.conversion.toFixed(2)}%`} hint="Visitors who went on to order" />
              </div>
              <p>{result.note}</p>
              <Caveat>These rules are illustrative, not Fiverr benchmarks. Small numbers can swing a lot.</Caveat>
            </ResultPanel>
          ) : (
            <EmptyResult icon={Activity} title="Your diagnosis will appear here">
              Enter impressions, clicks and orders for the same date range.
            </EmptyResult>
          )
        }
      />
    </>
  )
}
