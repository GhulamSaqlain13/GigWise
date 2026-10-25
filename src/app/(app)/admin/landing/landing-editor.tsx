"use client"

import { Plus } from "lucide-react"
import { Field, controlClass } from "@/components/app/form-bits"
import { Button } from "@/components/ui/button"
import { BUILT_IN_SECTIONS, type LandingSettings } from "@/lib/site/schema"
import { cn } from "@/lib/utils"
import { saveLanding } from "../actions"
import { Panel, RowControls, SaveBar, Switch, move, newId, useSettingsEditor } from "../admin-bits"

type Plan = LandingSettings["plans"][number]

/** Features as editable text: one per line, "- " prefix marks "not included". */
function featuresToText(features: Plan["features"]) {
  return features.map((f) => (f.included ? f.label : `- ${f.label}`)).join("\n")
}
function textToFeatures(text: string): Plan["features"] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith("-") ? { label: line.replace(/^-\s*/, ""), included: false } : { label: line, included: true }))
}

export function LandingEditor({ initial }: { initial: LandingSettings }) {
  const editor = useSettingsEditor(initial, saveLanding, "landing")
  const { value, setValue } = editor
  const set = (patch: Partial<LandingSettings>) => setValue({ ...value, ...patch })

  const label = (sid: string) =>
    sid in BUILT_IN_SECTIONS
      ? BUILT_IN_SECTIONS[sid as keyof typeof BUILT_IN_SECTIONS]
      : value.custom.find((c) => c.id === sid)?.title || "Untitled custom section"

  function addCustom() {
    const sid = newId("section")
    set({
      custom: [...value.custom, { id: sid, eyebrow: "", title: "New section", body: "", ctaLabel: "", ctaHref: "" }],
      sections: [...value.sections, { id: sid, visible: true }],
    })
  }

  function removeCustom(sid: string) {
    set({ custom: value.custom.filter((c) => c.id !== sid), sections: value.sections.filter((s) => s.id !== sid) })
  }

  const updateCustom = (sid: string, patch: Partial<LandingSettings["custom"][number]>) =>
    set({ custom: value.custom.map((c) => (c.id === sid ? { ...c, ...patch } : c)) })
  const updateFaq = (i: number, patch: Partial<LandingSettings["faqs"][number]>) =>
    set({ faqs: value.faqs.map((f, j) => (j === i ? { ...f, ...patch } : f)) })
  const updatePlan = (i: number, patch: Partial<Plan>) =>
    set({ plans: value.plans.map((p, j) => (j === i ? { ...p, ...patch } : p)) })

  return (
    <div className="space-y-6">
      <Panel
        title="Sections"
        description="Order, show or hide sections. Custom sections can be removed."
        action={<Button variant="outline" size="sm" onClick={addCustom}><Plus data-icon="inline-start" /> Add section</Button>}
      >
        <ul className="divide-y rounded-xl border">
          {value.sections.map((section, i) => {
            const custom = !(section.id in BUILT_IN_SECTIONS)
            return (
              <li key={section.id} className="flex items-center gap-3 px-3 py-2">
                <Switch
                  checked={section.visible}
                  label={`Show ${label(section.id)}`}
                  onChange={(visible) => set({ sections: value.sections.map((s, j) => (j === i ? { ...s, visible } : s)) })}
                />
                <span className={cn("min-w-0 flex-1 truncate text-[13px]", section.visible ? "text-foreground" : "text-ink-faint")}>
                  {label(section.id)}
                  {custom && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">Custom</span>}
                </span>
                <RowControls
                  label={label(section.id)}
                  first={i === 0}
                  last={i === value.sections.length - 1}
                  onUp={() => set({ sections: move(value.sections, i, -1) })}
                  onDown={() => set({ sections: move(value.sections, i, 1) })}
                  onRemove={custom ? () => removeCustom(section.id) : undefined}
                />
              </li>
            )
          })}
        </ul>
      </Panel>

      {value.custom.length > 0 && (
        <Panel title="Custom sections" description="Simple text sections with an optional button.">
          <div className="space-y-6">
            {value.custom.map((c) => (
              <div key={c.id} className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2">
                <Field id={`${c.id}-eyebrow`} label="Eyebrow (optional)">
                  <input id={`${c.id}-eyebrow`} className={controlClass} value={c.eyebrow} onChange={(e) => updateCustom(c.id, { eyebrow: e.target.value })} />
                </Field>
                <Field id={`${c.id}-title`} label="Title">
                  <input id={`${c.id}-title`} className={controlClass} value={c.title} onChange={(e) => updateCustom(c.id, { title: e.target.value })} />
                </Field>
                <Field id={`${c.id}-body`} label="Text" className="sm:col-span-2">
                  <textarea id={`${c.id}-body`} rows={4} className={controlClass} value={c.body} onChange={(e) => updateCustom(c.id, { body: e.target.value })} />
                </Field>
                <Field id={`${c.id}-cta`} label="Button label (optional)">
                  <input id={`${c.id}-cta`} className={controlClass} value={c.ctaLabel} onChange={(e) => updateCustom(c.id, { ctaLabel: e.target.value })} />
                </Field>
                <Field id={`${c.id}-href`} label="Button link" hint="/signup, #pricing or https://…">
                  <input id={`${c.id}-href`} className={controlClass} value={c.ctaHref} onChange={(e) => updateCustom(c.id, { ctaHref: e.target.value })} />
                </Field>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel title="Hero" description="The first thing visitors read.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="hero-eyebrow" label="Eyebrow">
            <input id="hero-eyebrow" className={controlClass} value={value.hero.eyebrow} onChange={(e) => set({ hero: { ...value.hero, eyebrow: e.target.value } })} />
          </Field>
          <Field id="hero-title" label="Headline" hint="Wrap a word in *asterisks* to highlight it.">
            <input id="hero-title" className={controlClass} value={value.hero.title} onChange={(e) => set({ hero: { ...value.hero, title: e.target.value } })} />
          </Field>
          <Field id="hero-subtitle" label="Subtitle" className="sm:col-span-2">
            <textarea id="hero-subtitle" rows={3} className={controlClass} value={value.hero.subtitle} onChange={(e) => set({ hero: { ...value.hero, subtitle: e.target.value } })} />
          </Field>
          <Field id="hero-primary" label="Primary button">
            <input id="hero-primary" className={controlClass} value={value.hero.primaryLabel} onChange={(e) => set({ hero: { ...value.hero, primaryLabel: e.target.value } })} />
          </Field>
          <Field id="hero-primary-href" label="Primary link">
            <input id="hero-primary-href" className={controlClass} value={value.hero.primaryHref} onChange={(e) => set({ hero: { ...value.hero, primaryHref: e.target.value } })} />
          </Field>
          <Field id="hero-secondary" label="Secondary button (optional)">
            <input id="hero-secondary" className={controlClass} value={value.hero.secondaryLabel} onChange={(e) => set({ hero: { ...value.hero, secondaryLabel: e.target.value } })} />
          </Field>
          <Field id="hero-secondary-href" label="Secondary link">
            <input id="hero-secondary-href" className={controlClass} value={value.hero.secondaryHref} onChange={(e) => set({ hero: { ...value.hero, secondaryHref: e.target.value } })} />
          </Field>
          <Field id="hero-note" label="Small note under the buttons" hint="Separate items with · to show each with a check mark." className="sm:col-span-2">
            <input id="hero-note" className={controlClass} value={value.hero.note} onChange={(e) => set({ hero: { ...value.hero, note: e.target.value } })} />
          </Field>
        </div>
      </Panel>

      <Panel
        title="FAQ"
        description="Questions shown in the FAQ section."
        action={
          <Button variant="outline" size="sm" onClick={() => set({ faqs: [...value.faqs, { id: newId("faq"), q: "New question", a: "Answer" }] })}>
            <Plus data-icon="inline-start" /> Add question
          </Button>
        }
      >
        <div className="space-y-4">
          {value.faqs.map((faq, i) => (
            <div key={faq.id} className="flex gap-3 rounded-xl border p-4">
              <div className="grid min-w-0 flex-1 gap-3">
                <Field id={`${faq.id}-q`} label="Question">
                  <input id={`${faq.id}-q`} className={controlClass} value={faq.q} onChange={(e) => updateFaq(i, { q: e.target.value })} />
                </Field>
                <Field id={`${faq.id}-a`} label="Answer">
                  <textarea id={`${faq.id}-a`} rows={3} className={controlClass} value={faq.a} onChange={(e) => updateFaq(i, { a: e.target.value })} />
                </Field>
              </div>
              <RowControls
                label={faq.q}
                first={i === 0}
                last={i === value.faqs.length - 1}
                onUp={() => set({ faqs: move(value.faqs, i, -1) })}
                onDown={() => set({ faqs: move(value.faqs, i, 1) })}
                onRemove={() => set({ faqs: value.faqs.filter((_, j) => j !== i) })}
              />
            </div>
          ))}
          {value.faqs.length === 0 && <p className="text-[13px] text-ink-faint">No questions. Hide the FAQ section or add one.</p>}
        </div>
      </Panel>

      <Panel
        title="Pricing"
        description="Plans shown on the landing page. This is display only; billing isn't connected."
        action={
          value.plans.length < 6 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => set({ plans: [...value.plans, { id: newId("plan"), name: "New plan", price: "$0", note: "per month", summary: "", cta: "Get started", featured: false, features: [] }] })}
            >
              <Plus data-icon="inline-start" /> Add plan
            </Button>
          )
        }
      >
        <div className="space-y-4">
          {value.plans.map((plan, i) => (
            <div key={plan.id} className="rounded-xl border p-4">
              <div className="mb-4 flex items-center gap-3">
                <p className="min-w-0 flex-1 truncate font-medium text-foreground">{plan.name || "Untitled plan"}</p>
                <label className="flex items-center gap-2 text-[13px] text-ink-soft">
                  <Switch checked={plan.featured} label={`Feature ${plan.name}`} onChange={(featured) => updatePlan(i, { featured })} />
                  Featured
                </label>
                <RowControls
                  label={plan.name}
                  first={i === 0}
                  last={i === value.plans.length - 1}
                  onUp={() => set({ plans: move(value.plans, i, -1) })}
                  onDown={() => set({ plans: move(value.plans, i, 1) })}
                  onRemove={() => set({ plans: value.plans.filter((_, j) => j !== i) })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field id={`${plan.id}-name`} label="Name">
                  <input id={`${plan.id}-name`} className={controlClass} value={plan.name} onChange={(e) => updatePlan(i, { name: e.target.value })} />
                </Field>
                <Field id={`${plan.id}-price`} label="Price">
                  <input id={`${plan.id}-price`} className={controlClass} value={plan.price} onChange={(e) => updatePlan(i, { price: e.target.value })} />
                </Field>
                <Field id={`${plan.id}-note`} label="Price note">
                  <input id={`${plan.id}-note`} className={controlClass} value={plan.note} onChange={(e) => updatePlan(i, { note: e.target.value })} />
                </Field>
                <Field id={`${plan.id}-summary`} label="Summary" className="sm:col-span-2">
                  <input id={`${plan.id}-summary`} className={controlClass} value={plan.summary} onChange={(e) => updatePlan(i, { summary: e.target.value })} />
                </Field>
                <Field id={`${plan.id}-cta`} label="Button label">
                  <input id={`${plan.id}-cta`} className={controlClass} value={plan.cta} onChange={(e) => updatePlan(i, { cta: e.target.value })} />
                </Field>
                <Field id={`${plan.id}-features`} label="Features" hint='One per line. Start a line with "-" for "not included".' className="sm:col-span-3">
                  <textarea
                    key={featuresToText(plan.features)}
                    id={`${plan.id}-features`}
                    rows={6}
                    className={controlClass}
                    defaultValue={featuresToText(plan.features)}
                    onBlur={(e) => updatePlan(i, { features: textToFeatures(e.target.value) })}
                  />
                </Field>
              </div>
            </div>
          ))}
          <Field id="pricing-note" label="Note under the plans">
            <input id="pricing-note" className={controlClass} value={value.pricingNote} onChange={(e) => set({ pricingNote: e.target.value })} />
          </Field>
        </div>
      </Panel>

      <SaveBar {...editor} />
    </div>
  )
}
