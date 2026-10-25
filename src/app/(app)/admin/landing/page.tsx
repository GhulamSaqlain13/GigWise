import type { Metadata } from "next"
import { getSiteSettings } from "@/lib/site/store"
import { LandingEditor } from "./landing-editor"

export const metadata: Metadata = { title: "Admin: landing page" }

export default async function AdminLandingPage() {
  const { landing } = await getSiteSettings()
  return <LandingEditor key={JSON.stringify(landing)} initial={landing} />
}
