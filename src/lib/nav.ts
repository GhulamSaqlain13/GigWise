import {
  Calculator,
  ClipboardList,
  Compass,
  FlaskConical,
  Image,
  LayoutDashboard,
  LayoutTemplate,
  MessageSquareReply,
  Paintbrush,
  Palette,
  PenLine,
  PlusSquare,
  Search,
  Stethoscope,
  Wand2,
  type LucideIcon,
} from "lucide-react"
import { ALWAYS_ON, type ToolSettings } from "@/lib/site/schema"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  keywords?: string
}

export type NavSection = { title: string; items: NavItem[] }

// Single source for the sidebar, mobile drawer, breadcrumbs and tool search.
export const navSections: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard, keywords: "home" },
      { href: "/discover", label: "Discover Services", icon: Compass, keywords: "skills niche ideas" },
      { href: "/gigs/new", label: "Create a Gig", icon: PenLine, keywords: "new draft" },
      { href: "/optimize", label: "Optimize Gig", icon: Wand2, keywords: "audit seo improve" },
      { href: "/growth-plan", label: "Growth Roadmap", icon: ClipboardList, keywords: "plan tasks" },
    ],
  },
  {
    title: "Portfolio",
    items: [
      { href: "/portfolio", label: "Portfolio Websites", icon: LayoutTemplate },
      { href: "/portfolio/themes", label: "Explore Themes", icon: Palette },
      { href: "/portfolio/new", label: "Create Portfolio", icon: PlusSquare },
      { href: "/portfolio/editor", label: "Visual Editor", icon: Paintbrush },
    ],
  },
  {
    title: "Growth Tools",
    items: [
      { href: "/tools/gig-doctor", label: "Gig Problem Doctor", icon: Stethoscope, keywords: "ctr clicks orders" },
      { href: "/tools/thumbnails", label: "Thumbnail Tester", icon: Image, keywords: "image preview" },
      { href: "/tools/competitors", label: "Competitor Gaps", icon: Search, keywords: "positioning" },
      { href: "/tools/buyer-coach", label: "Buyer Reply Coach", icon: MessageSquareReply, keywords: "message" },
      { href: "/tools/experiments", label: "Experiments", icon: FlaskConical, keywords: "tracker snapshot" },
      { href: "/tools/profitability", label: "Profit Calculator", icon: Calculator, keywords: "earnings fee" },
    ],
  },
]

export const allNavItems = navSections.flatMap((s) => s.items)

export function isActive(pathname: string, href: string) {
  if (href === "/portfolio") return pathname === "/portfolio"
  return pathname === href || pathname.startsWith(href + "/")
}

/**
 * Apply the super admin's tool settings: hide disabled items, rename and
 * reorder within each section. Items missing from the settings keep their
 * default label and position after the configured ones.
 */
export function resolveNav(tools: ToolSettings): NavSection[] {
  const config = new Map(tools.map((t, i) => [t.href, { ...t, order: i }]))
  return navSections
    .map((section) => ({
      title: section.title,
      items: section.items
        .map((item, i) => ({ item, order: config.get(item.href)?.order ?? 1000 + i }))
        .filter(({ item }) => ALWAYS_ON.includes(item.href) || config.get(item.href)?.enabled !== false)
        .sort((a, b) => a.order - b.order)
        .map(({ item }) => ({ ...item, label: config.get(item.href)?.label || item.label })),
    }))
    .filter((section) => section.items.length > 0)
}

export function disabledHrefs(tools: ToolSettings) {
  return tools.filter((t) => !t.enabled && !ALWAYS_ON.includes(t.href)).map((t) => t.href)
}

/** Section + page label for the topbar breadcrumb. */
export function breadcrumbFor(pathname: string, sections: NavSection[] = navSections) {
  for (const section of sections) {
    const item = section.items.find((i) => i.href === pathname) ?? section.items.find((i) => isActive(pathname, i.href))
    if (item) return { section: section.title, item }
  }
  return null
}
