"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Eye, EyeOff, Globe } from "lucide-react"
import { toast } from "sonner"
import { Field, controlClass } from "@/components/app/form-bits"
import { PageHeader } from "@/components/app/page-header"
import { usePortfolio } from "@/components/portfolio/portfolio-provider"
import { SitePreview } from "@/components/portfolio/site-preview"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ALL_SECTIONS, accentColors, getTheme, sectionLabels, themes } from "@/lib/portfolio/themes"
import type { Portfolio } from "@/lib/portfolio/types"
import { cn } from "@/lib/utils"

const MAX_PHOTO_BYTES = 1024 * 1024
const PHOTO_TYPES = ["image/png", "image/jpeg", "image/webp"]

const textFields: { key: keyof Portfolio; label: string; multiline?: boolean; type?: string }[] = [
  { key: "name", label: "Your name" },
  { key: "role", label: "Professional title" },
  { key: "bio", label: "Short introduction", multiline: true },
  { key: "skills", label: "Skills" },
  { key: "p1", label: "Project one" },
  { key: "p2", label: "Project two" },
  { key: "email", label: "Email", type: "email" },
]

export default function PortfolioEditorPage() {
  const { draft, update, save } = usePortfolio()
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop")

  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= draft.sections.length) return
    const sections = [...draft.sections]
    ;[sections[i], sections[j]] = [sections[j], sections[i]]
    update({ sections })
  }

  function onPhoto(file: File | undefined, input: HTMLInputElement) {
    if (!file) return
    if (file.size > MAX_PHOTO_BYTES) { toast.error("Choose an image smaller than 1 MB."); input.value = ""; return }
    if (!PHOTO_TYPES.includes(file.type)) { toast.error("Choose a PNG, JPG, or WebP image."); input.value = ""; return }
    const reader = new FileReader()
    reader.onload = () => {
      update({ photo: String(reader.result) })
      toast("Image added to your preview. Save draft to keep it.")
    }
    reader.readAsDataURL(file)
  }

  function exportJSON() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" }))
    const a = Object.assign(document.createElement("a"), { href: url, download: "gigwise-portfolio.json" })
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <>
      <PageHeader section="Portfolio websites" title="Portfolio editor" description="Personalize your content and see updates instantly.">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => save() && toast.success("Draft saved to this browser.")}>Save draft</Button>
          <Button size="sm" variant="outline" onClick={exportJSON}>Export data</Button>
          <Button
            size="sm"
            onClick={() => {
              if (save({ ...draft, published: true })) toast("Preview marked ready. Public hosting is not connected yet.")
            }}
          >
            <Globe data-icon="inline-start" /> Publish preview
          </Button>
        </div>
      </PageHeader>

      <div className="grid items-start gap-4 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_255px]">
        <Card className="gap-3 px-4">
          <h3 className="text-sm font-semibold">Page sections</h3>
          <ul className="space-y-2">
            {draft.sections.map((s, i) => {
              const hidden = draft.hidden.includes(s)
              return (
                <li key={s} className="flex items-center justify-between gap-1 rounded-[9px] border p-1.5 pl-3 text-xs">
                  <span className={cn(hidden && "text-muted-foreground line-through")}>{sectionLabels[s]}</span>
                  <span className="flex text-primary">
                    <IconBtn label={`Move ${sectionLabels[s]} up`} onClick={() => move(i, -1)}><ArrowUp /></IconBtn>
                    <IconBtn label={`Move ${sectionLabels[s]} down`} onClick={() => move(i, 1)}><ArrowDown /></IconBtn>
                    <IconBtn
                      label={hidden ? `Show ${sectionLabels[s]}` : `Hide ${sectionLabels[s]}`}
                      onClick={() => update({ hidden: hidden ? draft.hidden.filter((x) => x !== s) : [...draft.hidden, s] })}
                    >
                      {hidden ? <EyeOff /> : <Eye />}
                    </IconBtn>
                  </span>
                </li>
              )
            })}
          </ul>
          <Button size="sm" variant="secondary" onClick={() => update({ sections: ALL_SECTIONS, hidden: [] })}>
            Restore all sections
          </Button>
        </Card>

        <Card className="min-h-[540px] gap-3 bg-ink-100 px-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Live website preview</span>
            <div className="flex gap-1.5" role="group" aria-label="Preview device">
              {(["desktop", "mobile"] as const).map((d) => (
                <Button key={d} size="sm" variant={device === d ? "default" : "outline"} aria-pressed={device === d} onClick={() => setDevice(d)}>
                  {d === "desktop" ? "Desktop" : "Mobile"}
                </Button>
              ))}
            </div>
          </div>
          <SitePreview data={draft} device={device} />
        </Card>

        <Card className="gap-4 px-4 lg:col-span-2 xl:col-span-1">
          <h3 className="text-sm font-semibold">Customize design</h3>
          {textFields.map(({ key, label, multiline, type }) => (
            <Field key={key} id={`edit-${key}`} label={label}>
              {multiline ? (
                <textarea id={`edit-${key}`} rows={4} className={controlClass} value={String(draft[key])}
                  onChange={(e) => update({ [key]: e.target.value })} />
              ) : (
                <input id={`edit-${key}`} type={type ?? "text"} className={controlClass} value={String(draft[key])}
                  onChange={(e) => update({ [key]: e.target.value })} />
              )}
            </Field>
          ))}
          <Field id="edit-theme" label="Theme">
            <select id="edit-theme" className={controlClass} value={draft.theme}
              onChange={(e) => update({ theme: e.target.value, accent: getTheme(e.target.value).accent })}>
              {themes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </Field>
          <fieldset>
            <legend className="mb-1.5 text-xs font-semibold">Accent color</legend>
            <div className="flex gap-2">
              {accentColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Accent ${c}`}
                  aria-pressed={draft.accent === c}
                  onClick={() => update({ accent: c })}
                  className={cn("size-7 rounded-full border-2 border-white shadow-[0_0_0_1px_var(--color-ink-300)]", draft.accent === c && "shadow-[0_0_0_2px_var(--primary)]")}
                  style={{ background: c }}
                />
              ))}
            </div>
          </fieldset>
          <Field id="edit-photo" label="Profile image" hint="Stored in this browser only. Maximum 1 MB.">
            <input id="edit-photo" type="file" accept={PHOTO_TYPES.join(",")} className={controlClass}
              onChange={(e) => onPhoto(e.target.files?.[0], e.target)} />
          </Field>
          <Field id="edit-font" label="Heading font">
            <select id="edit-font" className={controlClass} value={draft.font}
              onChange={(e) => update({ font: e.target.value as Portfolio["font"] })}>
              <option>Manrope</option><option>Georgia</option><option>Arial</option>
            </select>
          </Field>
          <div className="rounded-[10px] bg-ink-50 p-3 text-xs">
            <strong>Publishing status</strong>
            <p className="mt-2">
              {draft.published
                ? "Preview ready — this is a local draft, not a publicly hosted website."
                : "Draft — live hosting requires Supabase and deployment integration."}
            </p>
          </div>
        </Card>
      </div>
    </>
  )
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick}
      className="grid size-8 place-items-center rounded-md hover:bg-mint [&_svg]:size-3.5">
      {children}
    </button>
  )
}
