"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Calculator } from "lucide-react"
import { Caveat, EmptyResult, Field, Metric, ResultPanel, ToolLayout, controlClass } from "@/components/app/form-bits"
import { ProfitPreview } from "@/components/illustrations/previews"
import { PageHeader } from "@/components/app/page-header"
import { Button } from "@/components/ui/button"
import { profit } from "@/lib/tools/demo-logic"
import { profitSchema } from "@/lib/tools/schemas"

type Values = z.output<typeof profitSchema>

const fields = [
  { key: "price", label: "Project price (USD)", step: "1", hint: undefined },
  { key: "hours", label: "Estimated hours", step: "0.5", hint: undefined },
  { key: "fee", label: "Platform fee (%)", step: "1", hint: "Your assumption. Check Fiverr's current fees." },
  { key: "costs", label: "Other costs (USD)", step: "1", hint: "Tools, assets or subcontracting" },
] as const

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default function ProfitabilityPage() {
  const [result, setResult] = useState<ReturnType<typeof profit> | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof profitSchema>, unknown, Values>({
    resolver: zodResolver(profitSchema),
    defaultValues: { price: "100", hours: "8", fee: "20", costs: "5" },
  })

  return (
    <>
      <PageHeader
        title="Profit calculator"
        description="See what you actually earn per hour before accepting an order."
      />
      <ToolLayout
        input={
          <form onSubmit={handleSubmit((v) => setResult(profit(v.price, v.hours, v.fee, v.costs)))} className="space-y-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(({ key, label, step, hint }) => (
                <Field key={key} id={key} label={label} hint={hint} error={errors[key]?.message}>
                  <input id={key} type="number" min={0} step={step} inputMode="decimal" className={controlClass} aria-invalid={!!errors[key]} {...register(key)} />
                </Field>
              ))}
            </div>
            <Button type="submit">Calculate</Button>
          </form>
        }
        output={
          result ? (
            <ResultPanel title="Estimated earnings" source="calculated">
              <div className="grid gap-3 sm:grid-cols-2">
                <Metric label="Net earnings" value={usd.format(result.net)} />
                <Metric label="Effective hourly rate" value={`${usd.format(result.hourly)}/hr`} />
              </div>
              {result.net < 0 && <p className="font-medium text-destructive">At these numbers the order loses money.</p>}
              <Caveat>Excludes taxes, currency conversion and extra revisions.</Caveat>
            </ResultPanel>
          ) : (
            <EmptyResult icon={Calculator} title="Your estimate will appear here" preview={<ProfitPreview />}>
              Enter the price, your time and costs. The fee is an assumption you can change.
            </EmptyResult>
          )
        }
      />
    </>
  )
}
