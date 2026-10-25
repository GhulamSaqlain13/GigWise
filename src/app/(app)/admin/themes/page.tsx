import type { Metadata } from "next"
import { getSiteSettings } from "@/lib/site/store"
import { ThemesEditor } from "./themes-editor"

export const metadata: Metadata = { title: "Admin: themes" }

export default async function AdminThemesPage() {
  const { themes } = await getSiteSettings()
  return <ThemesEditor key={JSON.stringify(themes)} initial={themes} />
}
