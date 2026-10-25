"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { toast } from "sonner"
import { Field, controlClass } from "@/components/app/form-bits"
import { usePortfolio } from "@/components/portfolio/portfolio-provider"
import { StudioHeader } from "@/components/portfolio/studio-header"
import { ThemePreview } from "@/components/portfolio/theme-preview"
import { Button } from "@/components/ui/button"
import { defaultPortfolio } from "@/lib/portfolio/themes"
import { useThemes } from "@/components/portfolio/themes-context"
import { cn } from "@/lib/utils"

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name to create your portfolio.").max(90),
  role: z.string().trim().max(100),
  bio: z.string().trim().max(1000),
  skills: z.string().trim(),
  email: z.union([z.literal(""), z.email("Enter a valid email.")]),
  p1: z.string().trim(),
  p2: z.string().trim(),
  theme: z.string(),
})
type Values = z.infer<typeof schema>

// Three steps, as in the Portfolio Studio ref. Each step validates only its own fields.
const steps = [
  { title: "Your profile", heading: "Tell us about yourself", hint: "This information appears in your portfolio preview.", fields: ["name", "role", "bio"] },
  { title: "Work & skills", heading: "Your work and skills", hint: "Empty fields use sample text you can replace later.", fields: ["skills", "email", "p1", "p2"] },
  { title: "Theme & launch", heading: "Pick a theme", hint: "You can switch themes and colours any time in the editor.", fields: ["theme"] },
] as const

export default function NewPortfolioPage() {
  const router = useRouter()
  const { wizardTheme, save } = usePortfolio()
  const { themes, getTheme } = useThemes()
  const [step, setStep] = useState(0)
  const [reached, setReached] = useState(0)
  const { register, handleSubmit, trigger, control, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", role: "", bio: "", skills: "", email: "", p1: "", p2: "", theme: wizardTheme },
  })
  const selectedTheme = useWatch({ control, name: "theme" })
  const current = steps[step]
  const last = step === steps.length - 1

  async function next() {
    if (!(await trigger([...current.fields]))) return
    const to = step + 1
    setStep(to)
    setReached((r) => Math.max(r, to))
  }

  function onSubmit(v: Values) {
    const ok = save({
      ...defaultPortfolio, // id "" → save() assigns a new one
      name: v.name,
      role: v.role || defaultPortfolio.role,
      bio: v.bio || defaultPortfolio.bio,
      skills: v.skills || defaultPortfolio.skills,
      email: v.email,
      p1: v.p1 || defaultPortfolio.p1,
      p2: v.p2 || defaultPortfolio.p2,
      theme: v.theme,
      accent: getTheme(v.theme).accent,
    })
    if (!ok) return
    toast.success("Portfolio created! Customize it in the editor.")
    router.push("/portfolio/editor")
  }

  return (
    <>
      <StudioHeader
        eyebrow="Quick start"
        title="Create your portfolio"
        description="Just a few details. You can change everything later in the visual editor."
      />
      <div className="grid items-start gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        <ol aria-label="Steps" className="flex gap-1.5 overflow-x-auto rounded-[20px] border bg-card p-2.5 lg:flex-col lg:p-4">
          {steps.map((s, i) => {
            const done = i < step
            const active = i === step
            return (
              <li key={s.title} className="shrink-0">
                <button
                  type="button"
                  disabled={i > reached}
                  onClick={() => setStep(i)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl p-3 text-left text-[13px] whitespace-nowrap transition-colors disabled:cursor-default",
                    active ? "bg-brand-50 font-extrabold text-foreground" : "font-semibold text-ink-700 enabled:hover:bg-ink-25 disabled:text-ink-soft",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                      done ? "bg-evergreen text-white" : active ? "bg-pine text-lime" : "border border-ink-300 text-ink-soft",
                    )}
                  >
                    {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
                  </span>
                  {s.title}
                </button>
              </li>
            )
          })}
        </ol>

        {/* Enter on steps 1–2 advances to the next step instead of creating the portfolio. */}
        <form onSubmit={last ? handleSubmit(onSubmit) : (e) => { e.preventDefault(); void next() }} noValidate className="rounded-[20px] border bg-card p-5 md:p-7">
          <p className="text-xs font-bold text-ink-soft">Step {step + 1} of {steps.length}</p>
          <h2 className="mt-1 text-[23px] font-extrabold tracking-[-0.02em]">{current.heading}</h2>
          <p className="mt-1 text-[13px] text-ink-soft">{current.hint}</p>

          <div className="mt-6 space-y-4">
            {/* All steps stay mounted so values persist; inactive ones are hidden. */}
            <div className={cn("space-y-4", step !== 0 && "hidden")}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="name" label="Full name" error={errors.name?.message}>
                  <input id="name" maxLength={90} placeholder="e.g. Alex Morgan" className={controlClass} aria-invalid={!!errors.name} {...register("name")} />
                </Field>
                <Field id="role" label="Professional title">
                  <input id="role" maxLength={100} placeholder="e.g. Full Stack Developer" className={controlClass} {...register("role")} />
                </Field>
              </div>
              <Field id="bio" label="About you">
                <textarea id="bio" rows={4} placeholder="Describe what you do, who you help, and what makes your work valuable." className={controlClass} {...register("bio")} />
              </Field>
            </div>

            <div className={cn("grid gap-4 sm:grid-cols-2", step !== 1 && "hidden")}>
              <Field id="skills" label="Skills (comma separated)">
                <input id="skills" placeholder="React, Next.js, Node.js" className={controlClass} {...register("skills")} />
              </Field>
              <Field id="email" label="Contact email" error={errors.email?.message}>
                <input id="email" type="email" placeholder="hello@example.com" className={controlClass} aria-invalid={!!errors.email} {...register("email")} />
              </Field>
              <Field id="p1" label="Featured project 1">
                <input id="p1" placeholder="e.g. E-commerce Dashboard" className={controlClass} {...register("p1")} />
              </Field>
              <Field id="p2" label="Featured project 2">
                <input id="p2" placeholder="e.g. Marketing Website" className={controlClass} {...register("p2")} />
              </Field>
            </div>

            <fieldset className={cn(step !== 2 && "hidden")}>
              <legend className="sr-only">Portfolio theme</legend>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {themes.map((t) => {
                  const selected = selectedTheme === t.id
                  return (
                    <label
                      key={t.id}
                      className={cn(
                        "cursor-pointer overflow-hidden rounded-2xl border-2 bg-card transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
                        selected ? "border-evergreen" : "border-transparent ring-1 ring-border hover:ring-evergreen/40",
                      )}
                    >
                      <input type="radio" value={t.id} className="sr-only" {...register("theme")} />
                      <ThemePreview theme={t} className="h-[130px] p-3" />
                      <span className="flex items-center justify-between gap-2 px-3 py-2.5">
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-bold">{t.name}</span>
                          <span className="block truncate text-[11px] text-ink-soft">{t.type}</span>
                        </span>
                        <span className={cn("grid size-5 shrink-0 place-items-center rounded-full", selected ? "bg-evergreen text-white" : "border border-ink-300")}>
                          {selected && <Check className="size-3" strokeWidth={3} aria-hidden />}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft data-icon="inline-start" /> Back
              </Button>
            ) : (
              <span className="text-xs text-ink-soft">Your information stays in this browser until you export it.</span>
            )}
            {last ? (
              <Button type="submit" variant="pine">Create and customize <ArrowRight data-icon="inline-end" /></Button>
            ) : (
              <Button type="submit" variant="pine">Continue <ArrowRight data-icon="inline-end" /></Button>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
