"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Copy, MessagesSquare, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Caveat, EmptyResult, Field, ResultPanel, ToolLayout, controlClass } from "@/components/app/form-bits"
import { ReplyPreview } from "@/components/illustrations/previews"
import { PageHeader } from "@/components/app/page-header"
import { Button } from "@/components/ui/button"
import { SCOPE_CLARIFICATION_REPLY, buyerMessageFlags } from "@/lib/tools/demo-logic"
import { buyerSchema } from "@/lib/tools/schemas"

type Values = z.output<typeof buyerSchema>

export default function BuyerCoachPage() {
  const [reply, setReply] = useState<string | null>(null)
  const [flags, setFlags] = useState<string[]>([])
  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof buyerSchema>, unknown, Values>({
    resolver: zodResolver(buyerSchema),
    defaultValues: { message: "" },
  })

  function onSubmit(v: Values) {
    setReply(SCOPE_CLARIFICATION_REPLY)
    setFlags(buyerMessageFlags(v.message))
  }

  async function copy() {
    if (reply === null) return
    try {
      await navigator.clipboard.writeText(reply)
      toast.success("Reply copied")
    } catch {
      toast.error("Copying isn't available in this browser. Select the text and copy it manually.")
    }
  }

  return (
    <>
      <PageHeader
        title="Buyer reply coach"
        description="Turn an unclear buyer message into a polite reply that pins down the scope."
      />
      <ToolLayout
        input={
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Field id="message" label="Buyer message" error={errors.message?.message}
              hint="Remove names, emails and other private details before pasting.">
              <textarea id="message" rows={7} placeholder="My website is broken, can you fix it today?" className={controlClass}
                aria-invalid={!!errors.message} {...register("message")} />
            </Field>
            <Button type="submit">Draft reply</Button>
          </form>
        }
        output={
          reply !== null ? (
            <ResultPanel
              title="Suggested reply"
              source="template"
              actions={<Button variant="outline" size="sm" onClick={copy}><Copy data-icon="inline-start" /> Copy reply</Button>}
            >
              {flags.length > 0 && (
                <div role="alert" className="space-y-1.5 rounded-lg border border-warning/25 bg-warning/8 p-3 text-warning">
                  {flags.map((f) => (
                    <p key={f} className="flex gap-2 text-[13px] font-medium">
                      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden /> {f}
                    </p>
                  ))}
                </div>
              )}
              <textarea aria-label="Suggested reply" rows={7} className={controlClass} value={reply} onChange={(e) => setReply(e.target.value)} />
              <Caveat>Edit it before sending. Gigwise never sends messages for you.</Caveat>
            </ResultPanel>
          ) : (
            <EmptyResult icon={MessagesSquare} title="Your reply will appear here" preview={<ReplyPreview />}>
              Paste a buyer message. Gigwise also flags requests for passwords or moving off Fiverr.
            </EmptyResult>
          )
        }
      />
    </>
  )
}
