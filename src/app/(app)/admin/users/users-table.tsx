"use client"

import { useState, useTransition } from "react"
import { Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/app/confirm-dialog"
import { cn } from "@/lib/utils"
import { deleteUser, setUserPlan, setUserRole, setUserSuspended, type ActionResult } from "../actions"

export type AdminUserRow = {
  id: string
  email: string
  name: string | null
  createdAt: string
  lastSignInAt: string | null
  role: "user" | "super_admin"
  envAdmin: boolean
  suspended: boolean
  plan: "free" | "starter" | "pro"
  /** Plan comes from real billing, so manual changes are disabled. */
  paidPlan: boolean
  isSelf: boolean
}

const selectClass =
  "h-8 rounded-lg border bg-card px-2 text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:opacity-50"
const date = new Intl.DateTimeFormat("en", { dateStyle: "medium" })

export function UsersTable({ rows }: { rows: AdminUserRow[] }) {
  const [query, setQuery] = useState("")
  const [pending, startTransition] = useTransition()
  const [toDelete, setToDelete] = useState<AdminUserRow | null>(null)

  const run = (action: () => Promise<ActionResult>, success: string) =>
    startTransition(async () => {
      const result = await action()
      if (result.ok) toast.success(success)
      else toast.error(result.error)
    })

  const q = query.trim().toLowerCase()
  const visible = q ? rows.filter((r) => `${r.email} ${r.name ?? ""}`.toLowerCase().includes(q)) : rows

  return (
    <div className="rounded-2xl border bg-card shadow-card">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Search className="size-4 text-ink-faint" aria-hidden />
        <input
          aria-label="Filter users on this page"
          placeholder="Filter by email or name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm outline-0 placeholder:text-ink-faint"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-[13px]">
          <thead className="border-b text-xs text-ink-faint">
            <tr>
              <th className="px-4 py-2.5 font-medium">User</th>
              <th className="px-4 py-2.5 font-medium">Joined</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Plan</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5"><span className="sr-only">Delete</span></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {visible.map((row) => {
              const locked = row.isSelf || row.envAdmin
              const lockReason = row.isSelf ? "You can't change your own account" : row.envAdmin ? "Super admin via SUPER_ADMIN_EMAILS" : undefined
              return (
                <tr key={row.id} className={cn(row.suspended && "bg-secondary/50")}>
                  <td className="max-w-[260px] px-4 py-3">
                    <p className="truncate font-medium text-foreground">{row.name || row.email}</p>
                    {row.name && <p className="truncate text-xs text-ink-faint">{row.email}</p>}
                    {row.isSelf && <p className="text-xs text-primary">You</p>}
                  </td>
                  <td className="px-4 py-3 text-ink-soft tabular-nums">
                    {date.format(new Date(row.createdAt))}
                    <p className="text-xs text-ink-faint">
                      {row.lastSignInAt ? `Last seen ${date.format(new Date(row.lastSignInAt))}` : "Never signed in"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Role for ${row.email}`}
                      title={lockReason}
                      className={selectClass}
                      value={row.role}
                      disabled={locked || pending}
                      onChange={(e) => run(() => setUserRole(row.id, e.target.value), "Role updated.")}
                    >
                      <option value="user">User</option>
                      <option value="super_admin">Super admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Plan for ${row.email}`}
                      title={row.paidPlan ? "Managed by billing" : undefined}
                      className={selectClass}
                      value={row.plan}
                      disabled={row.paidPlan || pending}
                      onChange={(e) => run(() => setUserPlan(row.id, e.target.value), "Plan updated.")}
                    >
                      <option value="free">Free</option>
                      <option value="starter">Starter</option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      title={lockReason}
                      disabled={locked || pending}
                      onClick={() =>
                        run(() => setUserSuspended(row.id, !row.suspended), row.suspended ? "User restored." : "User suspended.")
                      }
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors disabled:opacity-50",
                        row.suspended ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "bg-accent text-accent-foreground hover:bg-brand-200",
                      )}
                    >
                      {row.suspended ? "Suspended, restore" : "Active, suspend"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`Delete ${row.email}`}
                      title={lockReason ?? "Delete user"}
                      disabled={locked || pending}
                      onClick={() => setToDelete(row)}
                      className="grid size-8 place-items-center rounded-lg text-ink-faint hover:bg-secondary hover:text-destructive disabled:opacity-30"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-faint">No users match.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`Delete ${toDelete?.email ?? "user"}?`}
        description="Their account and all their gigs, audits, portfolios and history are permanently deleted. This can't be undone."
        confirmLabel="Delete user"
        onConfirm={() => {
          if (toDelete) run(() => deleteUser(toDelete.id), "User deleted.")
        }}
      />
    </div>
  )
}
