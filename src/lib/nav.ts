import {
  Activity,
  Calculator,
  ChartNoAxesCombined,
  Compass,
  FilePlus2,
  Image,
  LayoutDashboard,
  MessagesSquare,
  Paintbrush,
  PanelsTopLeft,
  Route,
  ScanSearch,
  SwatchBook,
  WandSparkles,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  href: string
  label: string
  icon: LucideIcon
  keywords?: string
}

export type NavSection = { title: string; items: NavItem[] }

// Single source for sidebar, mobile "More" menu and the top search bar.
export const navSections: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard, keywords: "home" },
      { href: "/discover", label: "Discover services", icon: Compass, keywords: "skills niche ideas" },
      { href: "/gigs/new", label: "Create a gig", icon: FilePlus2, keywords: "new draft" },
      { href: "/optimize", label: "Optimize gig", icon: WandSparkles, keywords: "audit seo improve" },
      { href: "/growth-plan", label: "Growth roadmap", icon: Route, keywords: "plan tasks" },
    ],
  },
  {
    title: "Growth tools",
    items: [
      { href: "/tools/gig-doctor", label: "Gig Problem Doctor", icon: Activity, keywords: "ctr clicks orders" },
      { href: "/tools/thumbnails", label: "Thumbnail tester", icon: Image, keywords: "image preview" },
      { href: "/tools/competitors", label: "Competitor gaps", icon: ScanSearch, keywords: "positioning" },
      { href: "/tools/buyer-coach", label: "Buyer reply coach", icon: MessagesSquare, keywords: "message" },
      { href: "/tools/experiments", label: "Experiments", icon: ChartNoAxesCombined, keywords: "tracker snapshot" },
      { href: "/tools/profitability", label: "Profit calculator", icon: Calculator, keywords: "earnings fee" },
    ],
  },
  {
    title: "Portfolio websites",
    items: [
      { href: "/portfolio", label: "Portfolio websites", icon: PanelsTopLeft },
      { href: "/portfolio/themes", label: "Explore themes", icon: SwatchBook },
      { href: "/portfolio/new", label: "Create portfolio", icon: FilePlus2 },
      { href: "/portfolio/editor", label: "Visual editor", icon: Paintbrush },
    ],
  },
]

export const allNavItems = navSections.flatMap((s) => s.items)

export function isActive(pathname: string, href: string) {
  if (href === "/portfolio") return pathname === "/portfolio"
  return pathname === href || pathname.startsWith(href + "/")
}
