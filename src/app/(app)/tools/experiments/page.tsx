"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { FlaskConical } from "lucide-react"
import { toast } from "sonner"
import { Caveat, EmptyResult, Field, ResultPanel, ToolLayout, controlClass } from "@/components/app/form-bits"
import { PageHeader } from "@/components/app/page-header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLocalStore } from "@/lib/local-store"
import { experimentSchema } from "@/lib/tools/schemas"

type Values = z.output<typeof experimentSchema>

const DEFAULTS = { change: "", impressions: "200", clicks: "8", orders: "0" }
const dateFormat = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" })

export default function ExperimentsPage() {
  const [snapshots, setSnapshots] = useLocalStore("experiments")
  const { register, handleSubmit, reset, formState: { errors } } = useForm<z.input<typeof experimentSchema>, unknown, Values>({
    resolver: zodResolver(experimentSchema),
    defaultValues: DEFAULTS,
  })

  function onSubmit(v: Values) {
    try {
      setSnapshots((prev) => [{ ...v, createdAt: new Date().toISOString() }, ...prev])
      reset(DEFAULTS)
      toast.success("Snapshot saved")
    } catch {
      toast.error("Couldn't save the snapshot. Browser storage is full or blocked.")
    }
  }

  return (
    <>
      <PageHeader
        section="Growth tools"
        title="Experiments"
        description="Log one gig change at a time with the numbers that followed, then compare."
      />
      <ToolLayout
        input={
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Field id="change" label="What did you change?" error={errors.change?.message}>
              <input id="change" placeholder="Shortened the thumbnail headline" className={controlClass}
                aria-invalid={!!errors.change} {...register("change")} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {(["impressions", "clicks", "orders"] as const).map((k) => (
                <Field key={k} id={k} label={k[0].toUpperCase() + k.slice(1)} error={errors[k]?.message}>
                  <input id={k} type="number" min={0} inputMode="numeric" className={controlClass} aria-invalid={!!errors[k]} {...register(k)} />
                </Field>
              ))}
            </div>
            <Button type="submit">Save snapshot</Button>
          </form>
        }
        output={
          snapshots.length === 0 ? (
            <EmptyResult icon={FlaskConical} title="No snapshots yet">
              Record what you changed and the numbers for the period after it.
            </EmptyResult>
          ) : (
            <ResultPanel title={`History (${snapshots.length})`} source="calculated">
              <div className="-mx-5 -mt-5 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Change</TableHead>
                      <TableHead className="text-right">Impr.</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                      <TableHead className="pr-5 text-right">Orders</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {snapshots.map((s) => (
                      <TableRow key={s.createdAt}>
                        <TableCell className="pl-5 whitespace-normal">
                          <span className="block font-medium">{s.change}</span>
                          <span className="text-xs text-muted-foreground">{dateFormat.format(new Date(s.createdAt))}</span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{s.impressions}</TableCell>
                        <TableCell className="text-right tabular-nums">{s.clicks}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {s.impressions > 0 ? `${((s.clicks / s.impressions) * 100).toFixed(1)}%` : "–"}
                        </TableCell>
                        <TableCell className="pr-5 text-right tabular-nums">{s.orders}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Caveat>Results can change for many reasons, such as seasonality or other edits. Compare periods of similar length.</Caveat>
            </ResultPanel>
          )
        }
      />
    </>
  )
}
