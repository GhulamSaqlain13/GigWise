"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { ScanSearch } from "lucide-react"
import { BulletList, Caveat, EmptyResult, Field, ResultPanel, ToolLayout, controlClass } from "@/components/app/form-bits"
import { CompetitorsPreview } from "@/components/illustrations/previews"
import { PageHeader } from "@/components/app/page-header"
import { Button } from "@/components/ui/button"
import { positioningIdeas } from "@/lib/tools/demo-logic"
import { competitorSchema } from "@/lib/tools/schemas"

type Values = z.output<typeof competitorSchema>

export default function CompetitorsPage() {
  const [result, setResult] = useState<{ count: number; ideas: string[] } | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof competitorSchema>, unknown, Values>({
    resolver: zodResolver(competitorSchema),
    defaultValues: { service: "", offers: "" },
  })

  const onSubmit = (v: Values) =>
    setResult({ count: v.offers.split("\n").filter((l) => l.trim()).length, ideas: positioningIdeas(v.service) })

  return (
    <>
      <PageHeader
        title="Competitor gaps"
        description="Compare your offer with competitor gigs you've found and look for a clearer angle."
      />
      <ToolLayout
        input={
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Field id="service" label="Your service" error={errors.service?.message}>
              <input id="service" placeholder="Next.js deployment fixes" className={controlClass}
                aria-invalid={!!errors.service} {...register("service")} />
            </Field>
            <Field id="offers" label="Competitor gig titles" hint="One per line. Copy them from search results yourself." error={errors.offers?.message}>
              <textarea id="offers" rows={6} placeholder={"I will build a full website\nI will fix website errors"}
                className={controlClass} aria-invalid={!!errors.offers} {...register("offers")} />
            </Field>
            <Button type="submit">Find gaps</Button>
          </form>
        }
        output={
          result ? (
            <ResultPanel title={`Positioning ideas from ${result.count} ${result.count === 1 ? "offer" : "offers"}`} source="template">
              <BulletList items={result.ideas} />
              <Caveat>Based only on the titles you entered. No live marketplace or demand data is used.</Caveat>
            </ResultPanel>
          ) : (
            <EmptyResult icon={ScanSearch} title="Positioning ideas will appear here" preview={<CompetitorsPreview />}>
              Add your service and a few competing gig titles.
            </EmptyResult>
          )
        }
      />
    </>
  )
}
