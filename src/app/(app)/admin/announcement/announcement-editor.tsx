"use client"

import { Field, controlClass } from "@/components/app/form-bits"
import type { Announcement } from "@/lib/site/schema"
import { saveAnnouncement } from "../actions"
import { Panel, SaveBar, Switch, useSettingsEditor } from "../admin-bits"

export function AnnouncementEditor({ initial }: { initial: Announcement }) {
  const editor = useSettingsEditor(initial, saveAnnouncement, "announcement")
  const { value, setValue } = editor
  const set = (patch: Partial<Announcement>) => setValue({ ...value, ...patch })

  return (
    <div className="space-y-6">
      <Panel title="Announcement bar" description="A one-line notice across the top of the site, e.g. maintenance or a new feature.">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-ink-soft">
            <label className="flex items-center gap-2">
              <Switch checked={value.enabled} label="Show announcement" onChange={(enabled) => set({ enabled })} /> Show announcement
            </label>
            <label className="flex items-center gap-2">
              <Switch checked={value.showOnLanding} label="On the landing page" onChange={(showOnLanding) => set({ showOnLanding })} /> On the landing page
            </label>
            <label className="flex items-center gap-2">
              <Switch checked={value.showInWorkspace} label="In the workspace" onChange={(showInWorkspace) => set({ showInWorkspace })} /> In the workspace
            </label>
          </div>
          <Field id="ann-text" label="Message">
            <input id="ann-text" className={controlClass} value={value.text} maxLength={200} onChange={(e) => set({ text: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="ann-link-label" label="Link label (optional)">
              <input id="ann-link-label" className={controlClass} value={value.linkLabel} onChange={(e) => set({ linkLabel: e.target.value })} />
            </Field>
            <Field id="ann-link" label="Link" hint="/signup, #pricing or https://…">
              <input id="ann-link" className={controlClass} value={value.linkHref} onChange={(e) => set({ linkHref: e.target.value })} />
            </Field>
          </div>
          {value.enabled && value.text && (
            <div>
              <p className="mb-2 text-xs text-ink-faint">Preview</p>
              <div className="rounded-lg border bg-accent px-4 py-2 text-center text-[13px] text-accent-foreground">
                {value.text}
                {value.linkLabel && <span className="ml-2 font-medium underline underline-offset-2">{value.linkLabel}</span>}
              </div>
            </div>
          )}
        </div>
      </Panel>
      <SaveBar {...editor} />
    </div>
  )
}
