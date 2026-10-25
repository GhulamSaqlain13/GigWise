import { notFound } from "next/navigation"
import { Suspense } from "react"
import { PageHeader } from "@/components/app/page-header"
import { getAdminContext } from "@/lib/admin"
import { AdminTabs } from "./admin-bits"

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <PageHeader title="Admin panel" description="Control what visitors and users see across Gigwise." />
      <AdminTabs />
      <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-secondary" />}>
        <AdminGate>{children}</AdminGate>
      </Suspense>
    </>
  )
}

// Reads the session, so it lives inside <Suspense>. Non-admins get a 404 so the
// panel's existence isn't advertised. Every Server Action re-checks as well.
async function AdminGate({ children }: { children: React.ReactNode }) {
  const ctx = await getAdminContext()
  if (!ctx) notFound()
  return children
}
