"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { Field, controlClass } from "@/components/app/form-bits"
import { PageHeader } from "@/components/app/page-header"
import { usePortfolio } from "@/components/portfolio/portfolio-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { defaultPortfolio, getTheme, themes } from "@/lib/portfolio/themes"

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

export default function NewPortfolioPage() {
  const router = useRouter()
  const { wizardTheme, save } = usePortfolio()
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", role: "", bio: "", skills: "", email: "", p1: "", p2: "", theme: wizardTheme },
  })

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
      <PageHeader
        section="Portfolio websites"
        title="Create your portfolio"
        description="Just a few details. You can change everything later in the visual editor."
      />
      <div className="max-w-3xl">
        <Card className="px-5 md:px-7">
          <div>
            <h2 className="text-base font-semibold">About you</h2>
            <p className="text-[13px] text-muted-foreground">Only your name is required. Empty fields use sample text you can replace.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
            <div className="grid gap-4 sm:grid-cols-2">
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
            <Field id="theme" label="Portfolio theme">
              <select id="theme" className={controlClass} {...register("theme")}>
                {themes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-xs text-muted-foreground">Your information stays in this browser until you export it.</span>
              <Button type="submit">Create and customize <ArrowRight data-icon="inline-end" /></Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  )
}
