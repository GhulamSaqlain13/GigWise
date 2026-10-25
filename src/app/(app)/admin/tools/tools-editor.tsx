"use client"

import { navSections } from "@/lib/nav"
import { ALWAYS_ON, type ToolSettings } from "@/lib/site/schema"
import { cn } from "@/lib/utils"
import { controlClass } from "@/components/app/form-bits"
import { saveTools } from "../actions"
import { Panel, RowControls, SaveBar, Switch, move, useSettingsEditor } from "../admin-bits"

type Row = ToolSettings[number]

/** Every nav item, grouped by section, in the configured order. Empty label = default name. */
function toRows(tools: ToolSettings): Row[][] {
  const config = new Map(tools.map((t, i) => [t.href, { ...t, order: i }]))
  return navSections.map((section) =>
    section.items
      .map((item, i) => ({ item, order: config.get(item.href)?.order ?? 1000 + i }))
      .sort((a, b) => a.order - b.order)
      .map(({ item }) => ({
        href: item.href,
        enabled: config.get(item.href)?.enabled ?? true,
        label: config.get(item.href)?.label ?? "",
      })),
  )
}

const defaults = new Map(navSections.flatMap((s) => s.items).map((i) => [i.href, i.label]))

export function ToolsEditor({ initial }: { initial: ToolSettings }) {
  const editor = useSettingsEditor<Row[][]>(toRows(initial), (groups) => saveTools(groups.flat()), "tools")
  const { value: groups, setValue } = editor

  const update = (g: number, i: number, patch: Partial<Row>) =>
    setValue(groups.map((rows, gi) => (gi === g ? rows.map((r, ri) => (ri === i ? { ...r, ...patch } : r)) : rows)))

  return (
    <div className="space-y-6">
      <p className="text-[13px] text-ink-soft">
        Turned-off tools disappear from the sidebar, search, Overview and landing page, and their pages show a
        &ldquo;turned off&rdquo; notice. Leave a name empty to use the default.
      </p>
      {navSections.map((section, g) => (
        <Panel key={section.title} title={section.title}>
          <ul className="divide-y rounded-xl border">
            {groups[g].map((row, i) => {
              const locked = ALWAYS_ON.includes(row.href)
              return (
                <li key={row.href} className="flex flex-wrap items-center gap-3 px-3 py-2.5 sm:flex-nowrap">
                  <Switch
                    checked={row.enabled}
                    disabled={locked}
                    label={locked ? `${defaults.get(row.href)} is always on` : `Enable ${defaults.get(row.href)}`}
                    onChange={(enabled) => update(g, i, { enabled })}
                  />
                  <input
                    aria-label={`Name for ${defaults.get(row.href)}`}
                    placeholder={defaults.get(row.href)}
                    value={row.label}
                    maxLength={40}
                    onChange={(e) => update(g, i, { label: e.target.value })}
                    className={cn(controlClass, "min-h-9 max-w-xs flex-1 py-1.5", !row.enabled && "text-ink-faint")}
                  />
                  <code className="hidden text-xs text-ink-faint md:block">{row.href}</code>
                  <span className="ml-auto">
                    <RowControls
                      label={defaults.get(row.href) ?? row.href}
                      first={i === 0}
                      last={i === groups[g].length - 1}
                      onUp={() => setValue(groups.map((rows, gi) => (gi === g ? move(rows, i, -1) : rows)))}
                      onDown={() => setValue(groups.map((rows, gi) => (gi === g ? move(rows, i, 1) : rows)))}
                    />
                  </span>
                </li>
              )
            })}
          </ul>
        </Panel>
      ))}
      <SaveBar {...editor} />
    </div>
  )
}
