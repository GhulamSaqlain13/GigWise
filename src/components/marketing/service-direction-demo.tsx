"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, controlClass } from "@/components/app/form-bits"
import { landingServiceDirection } from "@/lib/tools/demo-logic"

type Goal = "focused" | "projects" | "recurring"

export function ServiceDirectionDemo() {
  const [result, setResult] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setResult(landingServiceDirection(String(form.get("skills") ?? ""), form.get("goal") as Goal))
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field id="demo-skills" label="Your skills">
          <input id="demo-skills" name="skills" required placeholder="React, Shopify, graphic design" className={controlClass} />
        </Field>
        <Field id="demo-goal" label="What are you looking for?">
          <select id="demo-goal" name="goal" className={controlClass}>
            <option value="focused">A focused niche</option>
            <option value="projects">Project-based work</option>
            <option value="recurring">Recurring services</option>
          </select>
        </Field>
        <Button type="submit" className="w-full">Suggest a direction</Button>
      </form>
      <div aria-live="polite">
        {result && (
          <div className="mt-5 rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm">
            <p className="font-medium text-brand-800">Direction to investigate</p>
            <p className="mt-1 leading-relaxed">{result}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info className="size-3.5" aria-hidden /> Template-based example, not live Fiverr research or AI.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
