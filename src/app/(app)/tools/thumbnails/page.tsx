"use client"

import { useEffect, useState } from "react"
import { ImageUp } from "lucide-react"
import { toast } from "sonner"
import { BulletList, Field, ResultPanel, ToolLayout, controlClass } from "@/components/app/form-bits"
import { PageHeader } from "@/components/app/page-header"
import { Button } from "@/components/ui/button"
import { thumbnailChecklist } from "@/lib/tools/demo-logic"
import { cn } from "@/lib/utils"

const MAX_HEADLINE = 90

export default function ThumbnailsPage() {
  const [headline, setHeadline] = useState("Fix your Next.js website fast")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [checklist, setChecklist] = useState<string[] | null>(null)

  // Object URLs must be released when replaced or on unmount.
  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl) }, [imageUrl])

  function onFile(input: HTMLInputElement) {
    const file = input.files?.[0]
    if (!file) return setImageUrl(null)
    if (!file.type.startsWith("image/")) {
      input.value = ""
      return toast.error("That file isn't an image. Choose a PNG, JPG or WebP.")
    }
    setImageUrl(URL.createObjectURL(file))
  }

  const text = headline.trim() || "Your gig headline"

  return (
    <>
      <PageHeader
        section="Growth tools"
        title="Thumbnail tester"
        description="See how your headline and image read at the size buyers see in search results."
      />
      <ToolLayout
        input={
          <div className="space-y-5">
            <Field id="thumbTitle" label="Thumbnail headline" hint={`${headline.length}/${MAX_HEADLINE} characters`}>
              <input id="thumbTitle" maxLength={MAX_HEADLINE} className={controlClass} value={headline}
                onChange={(e) => { setHeadline(e.target.value); setChecklist(null) }} />
            </Field>
            <Field id="thumbFile" label="Thumbnail image" hint="Optional. The image stays on your device.">
              <input id="thumbFile" type="file" accept="image/png,image/jpeg,image/webp"
                className={cn(controlClass, "py-2 file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-[13px] file:font-medium")}
                onChange={(e) => onFile(e.target)} />
            </Field>
            <Button onClick={() => setChecklist(thumbnailChecklist(headline.trim()))}>Check readability</Button>
          </div>
        }
        output={
          <div className="space-y-5">
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="text-sm font-semibold">Search card preview</h2>
                <span className="text-xs text-muted-foreground">Approximate, not Fiverr&apos;s exact layout</span>
              </div>
              <div className="flex flex-wrap items-start gap-5 rounded-lg bg-ink-25 p-4 ring-1 ring-border">
                {[{ w: "w-[260px]", label: "Desktop", size: "text-lg" }, { w: "w-[170px]", label: "Mobile", size: "text-sm" }].map(({ w, label, size }) => (
                  <figure key={label} className={cn(w, "max-w-full")}>
                    <div className="overflow-hidden rounded-lg border bg-card">
                      <div
                        className="grid aspect-16/10 place-items-center p-3 text-center font-semibold"
                        style={
                          imageUrl
                            ? { background: `linear-gradient(rgb(0 0 0 / .25), rgb(0 0 0 / .25)), url("${imageUrl}") center/cover`, color: "white" }
                            : { background: "var(--color-brand-50)", color: "var(--color-brand-800)" }
                        }
                      >
                        {!imageUrl && headline === "" ? <ImageUp className="size-6 opacity-50" aria-hidden /> : <span className={size}>{text}</span>}
                      </div>
                      <div className="p-2.5">
                        <p className="line-clamp-2 text-[13px] font-medium">{text}</p>
                        <p className="text-xs text-muted-foreground">Your seller name</p>
                      </div>
                    </div>
                    <figcaption className="mt-1.5 text-xs text-muted-foreground">{label}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
            {checklist && (
              <ResultPanel title="Readability checklist" source="template">
                <BulletList items={checklist} />
              </ResultPanel>
            )}
          </div>
        }
      />
    </>
  )
}
