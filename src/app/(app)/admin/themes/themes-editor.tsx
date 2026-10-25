"use client"

import { Plus } from "lucide-react"
import { Field, controlClass } from "@/components/app/form-bits"
import { ThemePreview } from "@/components/portfolio/theme-preview"
import { Button } from "@/components/ui/button"
import type { ThemeSetting } from "@/lib/site/schema"
import { saveThemes } from "../actions"
import { Panel, RowControls, SaveBar, Switch, move, newId, useSettingsEditor } from "../admin-bits"

const colourFields = [
  ["bg", "Background"],
  ["paper", "Page"],
  ["ink", "Text"],
  ["accent", "Accent"],
] as const

export function ThemesEditor({ initial }: { initial: ThemeSetting[] }) {
  const editor = useSettingsEditor(initial, saveThemes, "themes")
  const { value: themes, setValue } = editor
  const update = (i: number, patch: Partial<ThemeSetting>) => setValue(themes.map((t, j) => (j === i ? { ...t, ...patch } : t)))

  return (
    <div className="space-y-6">
      <Panel
        title="Portfolio themes"
        description="Hidden themes can't be picked for new portfolios; existing portfolios keep working."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setValue([
                ...themes,
                { id: newId("theme"), name: "New theme", type: "", role: "Freelancer", bg: "#eaf4ef", paper: "#ffffff", ink: "#192c30", accent: "#187a66", hidden: false },
              ])
            }
          >
            <Plus data-icon="inline-start" /> Add theme
          </Button>
        }
      >
        <div className="space-y-4">
          {themes.map((theme, i) => (
            <div key={theme.id} className="grid gap-4 rounded-xl border p-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-lg border">
                <ThemePreview theme={theme} className="h-[150px] p-3" />
              </div>
              <div className="min-w-0 space-y-4">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-[13px] text-ink-soft">
                    <Switch checked={!theme.hidden} label={`Show ${theme.name}`} onChange={(shown) => update(i, { hidden: !shown })} />
                    Visible
                  </label>
                  <span className="ml-auto">
                    <RowControls
                      label={theme.name}
                      first={i === 0}
                      last={i === themes.length - 1}
                      onUp={() => setValue(move(themes, i, -1))}
                      onDown={() => setValue(move(themes, i, 1))}
                      onRemove={themes.length > 1 ? () => setValue(themes.filter((_, j) => j !== i)) : undefined}
                    />
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field id={`${theme.id}-name`} label="Name">
                    <input id={`${theme.id}-name`} className={controlClass} value={theme.name} onChange={(e) => update(i, { name: e.target.value })} />
                  </Field>
                  <Field id={`${theme.id}-type`} label="Best for">
                    <input id={`${theme.id}-type`} className={controlClass} value={theme.type} onChange={(e) => update(i, { type: e.target.value })} />
                  </Field>
                  <Field id={`${theme.id}-role`} label="Sample role">
                    <input id={`${theme.id}-role`} className={controlClass} value={theme.role} onChange={(e) => update(i, { role: e.target.value })} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {colourFields.map(([key, label]) => (
                    <Field key={key} id={`${theme.id}-${key}`} label={label}>
                      <span className="flex items-center gap-2">
                        <input
                          type="color"
                          aria-label={`${label} colour picker`}
                          value={theme[key]}
                          onChange={(e) => update(i, { [key]: e.target.value })}
                          className="size-10 shrink-0 cursor-pointer rounded-lg border bg-card p-1"
                        />
                        <input
                          id={`${theme.id}-${key}`}
                          className={`${controlClass} font-mono text-xs`}
                          value={theme[key]}
                          maxLength={7}
                          onChange={(e) => update(i, { [key]: e.target.value })}
                        />
                      </span>
                    </Field>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <SaveBar {...editor} />
    </div>
  )
}
