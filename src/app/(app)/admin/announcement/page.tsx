import type { Metadata } from "next"
import { getSiteSettings } from "@/lib/site/store"
import { AnnouncementEditor } from "./announcement-editor"

export const metadata: Metadata = { title: "Admin: announcement" }

export default async function AdminAnnouncementPage() {
  const { announcement } = await getSiteSettings()
  return <AnnouncementEditor key={JSON.stringify(announcement)} initial={announcement} />
}
