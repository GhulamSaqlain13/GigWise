export type SectionId = "hero" | "about" | "skills" | "projects" | "contact"

export type Portfolio = {
  id: string
  name: string
  role: string
  bio: string
  skills: string
  email: string
  p1: string
  p2: string
  theme: string
  accent: string
  font: "Manrope" | "Georgia" | "Arial"
  /** Data URL, ≤1 MB. TODO(supabase): move to a private Storage bucket. */
  photo: string
  sections: SectionId[]
  hidden: SectionId[]
  /** Demo flag only — public hosting is not implemented. */
  published: boolean
}
