import { z } from "zod"
import { themes as builtInThemes, type PortfolioTheme } from "@/lib/portfolio/themes"

// Everything a super admin can change, stored as one JSON document
// (public.site_settings.data). Each top-level key is validated on its own so a
// bad value in one area falls back to its defaults without breaking the rest.

const text = (max: number) => z.string().trim().max(max)
const required = (max: number) => z.string().trim().min(1, "Required").max(max)
/** Relative paths, in-page anchors or https links only. */
const href = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || v.startsWith("/") || v.startsWith("#") || v.startsWith("https://"), {
    message: "Use a path like /signup, an anchor like #pricing, or an https:// link",
  })
const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex colour like #187a66")
const id = z.string().regex(/^[a-z0-9-]{1,40}$/, "Use lowercase letters, numbers and dashes")

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------

export const BUILT_IN_SECTIONS = {
  hero: "Hero",
  journeys: "Every step (journeys)",
  discovery: "Service discovery",
  creator: "Gig creator",
  optimizer: "Gig optimizer",
  portfolio: "Portfolio builder",
  tools: "Tools directory",
  how: "How it works",
  pricing: "Pricing",
  faq: "FAQ",
  cta: "Closing call to action",
} as const

export type BuiltInSectionId = keyof typeof BUILT_IN_SECTIONS

export const customSectionSchema = z.object({
  id,
  eyebrow: text(60),
  title: required(140),
  body: text(1200),
  ctaLabel: text(40),
  ctaHref: href,
})

export const landingSchema = z.object({
  /** Render order. Built-in ids or the id of a custom section. */
  sections: z.array(z.object({ id: z.string().max(40), visible: z.boolean() })).max(40),
  hero: z.object({
    eyebrow: text(60),
    title: required(140),
    subtitle: text(400),
    primaryLabel: required(40),
    primaryHref: href,
    secondaryLabel: text(40),
    secondaryHref: href,
    note: text(160),
  }),
  custom: z.array(customSectionSchema).max(20),
  faqs: z.array(z.object({ id, q: required(200), a: required(1200) })).max(40),
  plans: z
    .array(
      z.object({
        id,
        name: required(40),
        price: required(20),
        note: text(40),
        summary: text(200),
        cta: required(40),
        featured: z.boolean(),
        features: z.array(z.object({ label: required(100), included: z.boolean() })).max(20),
      }),
    )
    .max(6),
  pricingNote: text(300),
})

export type LandingSettings = z.infer<typeof landingSchema>
export type CustomSection = z.infer<typeof customSectionSchema>

export const defaultLanding: LandingSettings = {
  sections: (Object.keys(BUILT_IN_SECTIONS) as BuiltInSectionId[]).map((sid) => ({ id: sid, visible: true })),
  hero: {
    eyebrow: "The freelance growth workspace",
    title: "Everything you need to *grow* as a freelancer.",
    subtitle:
      "Discover opportunities, create better gigs, and build a portfolio that makes your work stand out, from finding the right service to showcasing your best projects.",
    primaryLabel: "Start for free",
    primaryHref: "/signup",
    secondaryLabel: "Explore the workspace",
    secondaryHref: "/dashboard",
    note: "No credit card · No Fiverr password needed",
  },
  custom: [],
  faqs: [
    { id: "what", q: "What is Gigwise?", a: "A workspace for independent freelancers. It helps you find services worth offering, create and improve your marketplace gigs, run small experiments, and build a portfolio website, all in one place." },
    { id: "fiverr", q: "Is Gigwise affiliated with Fiverr?", a: "No. Gigwise is an independent product and is not affiliated with, endorsed by, or connected to Fiverr. It helps you prepare and improve your own listings; nothing is published on your behalf." },
    { id: "orders", q: "Can Gigwise guarantee orders?", a: "No, and you should be skeptical of any tool that does. Gigwise gives structured recommendations, clearer positioning and better presentation. Results depend on demand, competition and your work." },
    { id: "no-gig", q: "Can I use Gigwise without an existing gig?", a: "Yes. Start with Service Discovery to find a direction, then use the Gig Creator to build your first listing step by step." },
    { id: "url", q: "Can I analyze my Fiverr gig URL?", a: "The URL is stored as a reference only. Gigwise doesn't scrape Fiverr. Paste your gig's title, description, tags and packages and the optimizer reviews that." },
    { id: "publish", q: "Does Gigwise publish gigs or send messages for me?", a: "Never. You review, edit and copy your gig content and replies yourself, then publish them on your chosen platform." },
    { id: "portfolio", q: "Can I create a portfolio without coding?", a: "Yes. Pick a theme, fill in your details in a guided setup, and refine everything in the visual editor. Public hosting isn't live yet, so publishing is a preview for now." },
    { id: "ai", q: "Is the analysis done by AI?", a: "The current tools use transparent rules and templates, and every result is labeled that way. AI analysis is planned; when it arrives it will be labeled and fully editable too." },
  ],
  plans: [
    {
      id: "free", name: "Free", price: "$0", note: "forever", summary: "For freelancers exploring the platform.", cta: "Start for free", featured: false,
      features: [
        { label: "3 service idea reports", included: true }, { label: "3 gig drafts", included: true }, { label: "2 gig analyses", included: true },
        { label: "1 portfolio website", included: true }, { label: "All calculators", included: true }, { label: "Exportable reports", included: false },
        { label: "Experiment tracking", included: false },
      ],
    },
    {
      id: "starter", name: "Starter", price: "$7", note: "per month", summary: "For freelancers actively building their business.", cta: "Choose Starter", featured: true,
      features: [
        { label: "25 service idea reports", included: true }, { label: "25 gig drafts", included: true }, { label: "15 gig analyses", included: true },
        { label: "Portfolio customization", included: true }, { label: "Saved history", included: true }, { label: "Exportable reports", included: true },
        { label: "Experiment tracking", included: false },
      ],
    },
    {
      id: "pro", name: "Pro", price: "$15", note: "per month", summary: "For active sellers managing multiple services.", cta: "Choose Pro", featured: false,
      features: [
        { label: "100 service idea reports", included: true }, { label: "100 gig drafts", included: true }, { label: "Unlimited gig analyses", included: true },
        { label: "Advanced diagnostics", included: true }, { label: "Experiment tracking", included: true }, { label: "Up to 3 portfolios", included: true },
        { label: "Exportable reports", included: true },
      ],
    },
  ],
  pricingNote: "Plans and limits shown are a preview. Billing isn't enabled yet, so nothing is charged and everything is free during early access.",
}

// ---------------------------------------------------------------------------
// Workspace tools & navigation
// ---------------------------------------------------------------------------

/** One entry per nav href. Array order = order within its nav section. */
export const toolsSchema = z
  .array(z.object({ href: z.string().startsWith("/").max(80), enabled: z.boolean(), label: text(40) }))
  .max(60)

export type ToolSettings = z.infer<typeof toolsSchema>

/** Pages that can't be switched off, so the workspace always has a home. */
export const ALWAYS_ON = ["/dashboard"]

// ---------------------------------------------------------------------------
// Portfolio themes
// ---------------------------------------------------------------------------

export const themeSchema = z.object({
  id,
  name: required(40),
  type: text(60),
  role: text(40),
  bg: hex,
  paper: hex,
  ink: hex,
  accent: hex,
  hidden: z.boolean(),
})

export const themesSchema = z
  .array(themeSchema)
  .min(1, "Keep at least one theme")
  .max(30)
  .refine((list) => list.some((t) => !t.hidden), "At least one theme must stay visible")
  .refine((list) => new Set(list.map((t) => t.id)).size === list.length, "Theme ids must be unique")

export type ThemeSetting = z.infer<typeof themeSchema>

export const defaultThemes: ThemeSetting[] = builtInThemes.map((t) => ({
  ...t,
  bg: expandHex(t.bg),
  paper: expandHex(t.paper),
  ink: expandHex(t.ink),
  accent: expandHex(t.accent),
  hidden: false,
}))

/** Drop the admin-only fields. */
export function toPortfolioTheme({ id, name, type, role, bg, paper, ink, accent }: ThemeSetting): PortfolioTheme {
  return { id, name, type, role, bg, paper, ink, accent }
}

function expandHex(value: string) {
  return /^#[0-9a-f]{3}$/i.test(value) ? `#${[...value.slice(1)].map((c) => c + c).join("")}` : value
}

// ---------------------------------------------------------------------------
// Site-wide announcement
// ---------------------------------------------------------------------------

export const announcementSchema = z.object({
  enabled: z.boolean(),
  text: text(200),
  linkLabel: text(40),
  linkHref: href,
  /** Where it appears. */
  showOnLanding: z.boolean(),
  showInWorkspace: z.boolean(),
})

export type Announcement = z.infer<typeof announcementSchema>

export const defaultAnnouncement: Announcement = {
  enabled: false,
  text: "",
  linkLabel: "",
  linkHref: "",
  showOnLanding: true,
  showInWorkspace: true,
}

// ---------------------------------------------------------------------------

export type SiteSettings = {
  landing: LandingSettings
  tools: ToolSettings
  themes: ThemeSetting[]
  announcement: Announcement
}

export type SiteSettingsKey = keyof SiteSettings

export const settingsSchemas = {
  landing: landingSchema,
  tools: toolsSchema,
  themes: themesSchema,
  announcement: announcementSchema,
} satisfies Record<SiteSettingsKey, z.ZodType>

export const defaultSettings: SiteSettings = {
  landing: defaultLanding,
  tools: [],
  themes: defaultThemes,
  announcement: defaultAnnouncement,
}

/** Validate each key independently; invalid or missing keys use their defaults. */
export function resolveSettings(raw: unknown): SiteSettings {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>
  const pick = <K extends SiteSettingsKey>(key: K): SiteSettings[K] => {
    const parsed = settingsSchemas[key].safeParse(source[key])
    return (parsed.success ? parsed.data : defaultSettings[key]) as SiteSettings[K]
  }
  return { landing: pick("landing"), tools: pick("tools"), themes: pick("themes"), announcement: pick("announcement") }
}
