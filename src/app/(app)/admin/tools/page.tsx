import type { Metadata } from "next"
import { getSiteSettings } from "@/lib/site/store"
import { ToolsEditor } from "./tools-editor"

export const metadata: Metadata = { title: "Admin: tools" }

export default async function AdminToolsPage() {
  const { tools } = await getSiteSettings()
  return <ToolsEditor key={JSON.stringify(tools)} initial={tools} />
}
