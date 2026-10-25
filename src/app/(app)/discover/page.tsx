import type { Metadata } from "next"
import { PageHeader } from "@/components/app/page-header"
import { DiscoverForm } from "./discover-form"

export const metadata: Metadata = { title: "Discover services" }

export default function DiscoverPage() {
  return (
    <>
      <PageHeader
        title="Find the right service to sell"
        description="Start with what you're good at. We will suggest specific service angles—not made-up order probabilities."
      />
      <DiscoverForm />
    </>
  )
}
