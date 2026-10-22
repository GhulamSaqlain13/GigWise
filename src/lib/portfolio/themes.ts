import type { Portfolio, SectionId } from "./types"

export type PortfolioTheme = {
  id: string
  name: string
  type: string
  bg: string
  paper: string
  ink: string
  accent: string
  role: string
}

export const themes: PortfolioTheme[] = [
  { id: "minimal", name: "Minimal Developer", type: "Developers & engineers", bg: "#eaf4ef", paper: "#fff", ink: "#192c30", accent: "#187a66", role: "Full Stack Developer" },
  { id: "creative", name: "Creative Studio", type: "Designers & illustrators", bg: "#f9e5f1", paper: "#fff5ec", ink: "#31243e", accent: "#ad4c9a", role: "Creative Designer" },
  { id: "dark", name: "Dark Premium", type: "Consultants & developers", bg: "#dbe3e7", paper: "#111c28", ink: "#fff", accent: "#51c5a4", role: "Software Engineer" },
  { id: "blue", name: "Modern Professional", type: "Marketers & consultants", bg: "#e3ebfb", paper: "#f5f8ff", ink: "#172d50", accent: "#4369bc", role: "Digital Consultant" },
  { id: "visual", name: "Visual Showcase", type: "Photographers & editors", bg: "#eae6ed", paper: "#f6f5f7", ink: "#222", accent: "#8b607b", role: "Visual Creator" },
  { id: "editorial", name: "Editorial Portfolio", type: "Writers & content creators", bg: "#f0e8d9", paper: "#f9f7f2", ink: "#302b26", accent: "#9b6b47", role: "Content Writer" },
]

export const accentColors = ["#187a66", "#4369bc", "#ad4c9a", "#d97745", "#222e3b", "#8b607b"]

export const sectionLabels: Record<SectionId, string> = {
  hero: "Hero",
  about: "About me",
  skills: "Skills",
  projects: "Projects",
  contact: "Contact",
}

export const ALL_SECTIONS: SectionId[] = ["hero", "about", "skills", "projects", "contact"]

export const defaultPortfolio: Portfolio = {
  id: "",
  name: "Alex Morgan",
  role: "Full Stack Developer",
  bio: "I build thoughtful digital experiences that help businesses grow. I combine clean design with reliable technology to create products people love using.",
  skills: "React, Next.js, Node.js, UI Design",
  email: "hello@example.com",
  p1: "E-commerce Platform",
  p2: "Analytics Dashboard",
  theme: "minimal",
  accent: "#187a66",
  font: "Manrope",
  photo: "",
  sections: ALL_SECTIONS,
  hidden: [],
  published: false,
}

export function getTheme(id: string) {
  return themes.find((t) => t.id === id) ?? themes[0]
}
