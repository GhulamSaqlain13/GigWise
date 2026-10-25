"use client"

import { useState } from "react"
import { Info, Sparkles } from "lucide-react"
import { Chip, landingCard, pillClass } from "@/components/marketing/landing-ui"
import { landingServiceDirection } from "@/lib/tools/demo-logic"
import { cn } from "@/lib/utils"

type Goal = "focused" | "projects" | "recurring"

const inputClass =
  "min-h-12 rounded-xl border border-ink-300 bg-ink-25 px-3.5 text-[15px] font-normal text-forest-ink outline-none placeholder:text-ink-faint focus-visible:border-brand-700 focus-visible:ring-3 focus-visible:ring-brand-700/15"

export function ServiceDirectionDemo() {
  const [result, setResult] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setResult(landingServiceDirection(String(form.get("skills") ?? ""), form.get("goal") as Goal))
  }

  return (
    <div className={cn(landingCard, "relative rounded-3xl p-6 md:p-7")}>
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <div className="flex items-center justify-between gap-3">
          <strong className="text-base font-semibold">Find your direction</strong>
          <Chip className="bg-brand-100 text-brand-800">Free · no signup</Chip>
        </div>
        <label htmlFor="demo-skills" className="flex flex-col gap-2 text-[13px] font-semibold">
          Your skills
          <input id="demo-skills" name="skills" required placeholder="React, Shopify, graphic design" className={inputClass} />
        </label>
        <label htmlFor="demo-goal" className="flex flex-col gap-2 text-[13px] font-semibold">
          What are you looking for?
          <select id="demo-goal" name="goal" className={inputClass}>
            <option value="focused">A focused niche</option>
            <option value="projects">Project-based work</option>
            <option value="recurring">Recurring services</option>
          </select>
        </label>
        <button type="submit" className={cn(pillClass("dark"), "min-h-[50px] w-full")}>
          <Sparkles aria-hidden /> Suggest a direction
        </button>
      </form>
      <div aria-live="polite">
        {result && (
          <div className="mt-5 rounded-2xl bg-forest-ink p-4 text-white">
            <p className="flex items-center justify-between gap-3 text-[11px] font-semibold tracking-[0.12em] text-lime">
              DIRECTION TO INVESTIGATE
              <Chip className="bg-white/10 text-[11px] tracking-normal text-forest-fg">Example</Chip>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-forest-fg">{result}</p>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-forest-muted">
              <Info className="size-3.5" aria-hidden /> Template-based example, not live Fiverr research or AI.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
