import type { Metadata } from "next"
import { PageHeader } from "@/components/app/page-header"
import { OptimizeForm } from "./optimize-form"

export const metadata: Metadata = { title: "Optimize gig" }

export default function OptimizePage() {
  return (
    <>
      <PageHeader
        section="Workspace"
        title="Find opportunities to improve your gig"
        description="Paste your gig content. A URL is stored as a reference only; Gigwise does not fetch Fiverr."
      />
      <OptimizeForm />
    </>
  )
}
