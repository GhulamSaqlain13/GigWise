import type { Metadata } from "next"
import { Suspense } from "react"
import { PageHeader } from "@/components/app/page-header"
import { CreateGigForm } from "./create-gig-form"

export const metadata: Metadata = { title: "Create a gig" }

export default function CreateGigPage() {
  return (
    <>
      <PageHeader
        section="Workspace"
        title="Create a gig buyers understand"
        description="Define your offer, buyer problem and deliverables. Review and edit the draft before publishing."
      />
      {/* Reads ?service= (handoff from Discover), so it streams behind Suspense. */}
      <Suspense>
        <CreateGigForm />
      </Suspense>
    </>
  )
}
