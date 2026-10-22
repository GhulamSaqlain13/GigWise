"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Copy, FilePlus2 } from "lucide-react"
import { toast } from "sonner"
import { Caveat, EmptyResult, Field, ResultPanel, ToolLayout, controlClass } from "@/components/app/form-bits"
import { Button } from "@/components/ui/button"
import { useLocalStore } from "@/lib/local-store"
import { draftGig, packagePrices } from "@/lib/tools/demo-logic"
import { createGigSchema } from "@/lib/tools/schemas"

type Values = z.output<typeof createGigSchema>

export function CreateGigForm() {
  const params = useSearchParams()
  const [, setDrafts] = useLocalStore("drafts")
  const [draft, setDraft] = useState<{ title: string; description: string; price: number } | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof createGigSchema>, unknown, Values>({
    resolver: zodResolver(createGigSchema),
    defaultValues: { service: params.get("service") ?? "", buyerProblem: "", price: "35", days: "3" },
  })

  function onSubmit(v: Values) {
    const { title, description } = draftGig(v.service, v.buyerProblem)
    setDraft({ title, description, price: v.price })
    try {
      setDrafts((prev) => [{ title, description, price: v.price, days: v.days, createdAt: new Date().toISOString() }, ...prev])
      toast.success("Draft saved")
    } catch {
      toast.error("Couldn't save the draft. Browser storage is full or blocked.")
    }
  }

  async function copy() {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(`${draft.title}\n\n${draft.description}`)
      toast.success("Draft copied")
    } catch {
      toast.error("Copying isn't available in this browser. Select the text and copy it manually.")
    }
  }

  const prices = draft && packagePrices(draft.price)

  return (
    <ToolLayout
      input={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Field id="service" label="Service you offer" error={errors.service?.message}>
            <input id="service" placeholder="Fix Next.js deployment errors" className={controlClass}
              aria-invalid={!!errors.service} {...register("service")} />
          </Field>
          <Field id="buyerProblem" label="Buyer problem you solve" error={errors.buyerProblem?.message}>
            <textarea id="buyerProblem" rows={4} placeholder="Their app fails to deploy to Vercel" className={controlClass}
              aria-invalid={!!errors.buyerProblem} {...register("buyerProblem")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="price" label="Starting price (USD)" error={errors.price?.message}>
              <input id="price" type="number" min={5} className={controlClass} aria-invalid={!!errors.price} {...register("price")} />
            </Field>
            <Field id="days" label="Delivery time (days)" error={errors.days?.message}>
              <input id="days" type="number" min={1} className={controlClass} aria-invalid={!!errors.days} {...register("days")} />
            </Field>
          </div>
          <Button type="submit">Create draft</Button>
        </form>
      }
      output={
        draft && prices ? (
          <ResultPanel
            title="Gig draft"
            source="template"
            actions={<Button type="button" variant="outline" size="sm" onClick={copy}><Copy data-icon="inline-start" /> Copy draft</Button>}
          >
            <Field id="draftTitle" label="Title">
              <textarea id="draftTitle" rows={2} className={controlClass} value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field id="draftDesc" label="Description">
              <textarea id="draftDesc" rows={6} className={controlClass} value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </Field>
            <div>
              <p className="mb-2 text-[13px] font-medium">Example packages</p>
              <dl className="grid grid-cols-3 divide-x rounded-lg border text-center">
                {([["Basic", prices.basic], ["Standard", prices.standard], ["Premium", prices.premium]] as const).map(([name, price]) => (
                  <div key={name} className="px-2 py-3">
                    <dt className="text-xs text-muted-foreground">{name}</dt>
                    <dd className="font-semibold tabular-nums">${price}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="mb-1 text-[13px] font-medium">FAQs to answer</p>
              <p className="text-muted-foreground">What access do you need? What is included? How are revisions handled?</p>
            </div>
            <Caveat>Check Fiverr&apos;s current title and description limits before publishing. Gigwise never publishes for you.</Caveat>
          </ResultPanel>
        ) : (
          <EmptyResult icon={FilePlus2} title="Your gig draft will appear here">
            Describe your service and the buyer problem it solves. You can edit every part of the draft.
          </EmptyResult>
        )
      }
    />
  )
}
