"use client"

import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { ArrowRight, Compass, FilePlus2 } from "lucide-react"
import { Caveat, EmptyResult, Field, ResultPanel, ToolLayout, controlClass } from "@/components/app/form-bits"
import { IdeasPreview } from "@/components/illustrations/previews"
import { Button } from "@/components/ui/button"
import { splitSkills, suggestServices } from "@/lib/tools/demo-logic"
import { discoverSchema } from "@/lib/tools/schemas"

type Values = z.output<typeof discoverSchema>

export function DiscoverForm() {
  const [result, setResult] = useState<{ ideas: string[]; goal: string } | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof discoverSchema>, unknown, Values>({
    resolver: zodResolver(discoverSchema),
    defaultValues: { skills: "", level: "Intermediate", goal: "Get my first order" },
  })

  const onSubmit = (v: Values) => setResult({ ideas: suggestServices(splitSkills(v.skills)), goal: v.goal })

  return (
    <ToolLayout
      input={
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Field id="skills" label="Your skills" error={errors.skills?.message}
            hint="Separate skills with commas. Include tools, industries or tasks you enjoy.">
            <textarea id="skills" rows={4} placeholder="React, Next.js, Docker, video editing"
              className={controlClass} aria-invalid={!!errors.skills} {...register("skills")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="level" label="Experience">
              <select id="level" className={controlClass} {...register("level")}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </Field>
            <Field id="goal" label="Primary goal">
              <select id="goal" className={controlClass} {...register("goal")}>
                <option>Get my first order</option><option>Find higher-value work</option><option>Find repeatable services</option>
              </select>
            </Field>
          </div>
          <Button type="submit">
            Suggest services <ArrowRight data-icon="inline-end" />
          </Button>
        </form>
      }
      output={
        result ? (
          <ResultPanel title="Service directions to explore" source="template">
            <Caveat>Goal: {result.goal}. These are starting ideas, not validated market demand.</Caveat>
            <ul className="divide-y rounded-lg border">
              {result.ideas.map((idea) => (
                <li key={idea} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-3.5 py-3">
                  <span className="min-w-0">{idea}</span>
                  {/* Journey C → B handoff: prefill the gig creator. */}
                  <Link
                    href={`/gigs/new?service=${encodeURIComponent(idea)}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:text-primary-hover"
                  >
                    <FilePlus2 className="size-3.5" aria-hidden /> Create gig
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-[13px] text-muted-foreground">
              Before choosing, check real buyer requests and competing offers for the idea.
            </p>
          </ResultPanel>
        ) : (
          <EmptyResult icon={Compass} title="Your service ideas will appear here" preview={<IdeasPreview />}>
            Add a few skills and choose a goal to get specific service angles to explore.
          </EmptyResult>
        )
      }
    />
  )
}
