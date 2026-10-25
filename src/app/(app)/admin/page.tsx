import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Info, LayoutTemplate, Megaphone, Palette, SlidersHorizontal, Users } from "lucide-react"
import { getAdminContext, isEnvSuperAdmin } from "@/lib/admin"
import { disabledHrefs } from "@/lib/nav"
import { getSiteSettings } from "@/lib/site/store"
import { createAdminClient } from "@/lib/supabase/admin"

export const metadata: Metadata = { title: "Admin" }

const dateTime = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" })

export default async function AdminOverviewPage() {
  const [ctx, settings] = await Promise.all([getAdminContext(), getSiteSettings()])
  const { landing, tools, themes, announcement } = settings

  const areas = [
    { href: "/admin/landing", icon: LayoutTemplate, title: "Landing page", detail: `${landing.sections.filter((s) => s.visible).length} visible sections, ${landing.custom.length} custom, ${landing.faqs.length} FAQs, ${landing.plans.length} plans` },
    { href: "/admin/tools", icon: SlidersHorizontal, title: "Tools & navigation", detail: `${disabledHrefs(tools).length} turned off` },
    { href: "/admin/themes", icon: Palette, title: "Portfolio themes", detail: `${themes.filter((t) => !t.hidden).length} visible of ${themes.length}` },
    { href: "/admin/announcement", icon: Megaphone, title: "Announcement", detail: announcement.enabled ? "Showing" : "Off" },
    { href: "/admin/users", icon: Users, title: "Users", detail: ctx?.mode === "supabase" ? "Roles, plans, suspension" : "Needs Supabase" },
  ]

  return (
    <div className="space-y-8">
      {ctx?.mode === "demo" ? (
        <p className="flex gap-2.5 rounded-xl border bg-accent px-4 py-3 text-[13px] text-accent-foreground">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            Local demo mode: Supabase isn&apos;t configured, so anyone running the app locally is a super admin and
            settings are saved to <code className="font-mono text-xs">.data/site-settings.json</code>. In production the
            panel needs Supabase and an account listed in <code className="font-mono text-xs">SUPER_ADMIN_EMAILS</code>.
          </span>
        </p>
      ) : (
        ctx && (
          <p className="text-[13px] text-ink-soft">
            Signed in as <span className="font-medium text-foreground">{ctx.email}</span>
            {isEnvSuperAdmin(ctx.email) ? ", super admin via SUPER_ADMIN_EMAILS." : ", super admin via role."}
          </p>
        )
      )}

      <div className="divide-y rounded-2xl border bg-card shadow-card">
        {areas.map(({ href, icon: Icon, title, detail }) => (
          <Link key={href} href={href} className="group flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-secondary/50">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
              <Icon className="size-4 text-ink-soft group-hover:text-primary" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">{title}</span>
              <span className="block truncate text-xs text-ink-faint">{detail}</span>
            </span>
            <ArrowRight className="size-4 text-ink-faint" aria-hidden />
          </Link>
        ))}
      </div>

      <section>
        <h2 className="text-xs font-semibold tracking-wider text-ink-faint uppercase">Recent admin activity</h2>
        <div className="mt-3">
          {ctx?.mode === "supabase" ? <AuditLog /> : (
            <p className="rounded-xl border bg-card px-4 py-6 text-center text-[13px] text-ink-soft">
              The audit log is recorded in Supabase once it&apos;s connected.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

async function AuditLog() {
  let rows: { id: string; action: string; target: string | null; details: Record<string, unknown>; created_at: string }[] = []
  try {
    const { data, error } = await createAdminClient()
      .from("admin_audit_log")
      .select("id, action, target, details, created_at")
      .order("created_at", { ascending: false })
      .limit(20)
    if (error) throw new Error(error.message)
    rows = data ?? []
  } catch (e) {
    return (
      <p className="rounded-xl border bg-card px-4 py-6 text-center text-[13px] text-destructive">
        Couldn&apos;t load the audit log: {e instanceof Error ? e.message : "unknown error"}. Check SUPABASE_SECRET_KEY
        and that the super admin migration is applied.
      </p>
    )
  }
  if (rows.length === 0) {
    return <p className="rounded-xl border bg-card px-4 py-6 text-center text-[13px] text-ink-soft">No admin changes yet.</p>
  }
  return (
    <ul className="divide-y rounded-xl border bg-card">
      {rows.map((row) => (
        <li key={row.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-4 py-3 text-[13px]">
          <span className="min-w-0">
            <span className="font-medium text-foreground">{row.action}</span>
            {row.target && <span className="text-ink-soft"> on {row.target}</span>}
            {typeof row.details.actor_email === "string" && <span className="text-ink-faint"> by {row.details.actor_email}</span>}
          </span>
          <time dateTime={row.created_at} className="text-xs text-ink-faint tabular-nums">{dateTime.format(new Date(row.created_at))}</time>
        </li>
      ))}
    </ul>
  )
}
