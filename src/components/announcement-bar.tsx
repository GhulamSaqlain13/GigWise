import Link from "next/link"
import { Megaphone } from "lucide-react"
import type { Announcement } from "@/lib/site/schema"

/** Site-wide notice set by the super admin. */
export function AnnouncementBar({ announcement }: { announcement: Announcement }) {
  if (!announcement.enabled || !announcement.text) return null
  return (
    <div className="border-b bg-accent px-4 py-2 text-center text-[13px] text-accent-foreground">
      <Megaphone className="mr-1.5 inline size-3.5 align-[-2px]" aria-hidden />
      {announcement.text}
      {announcement.linkLabel && announcement.linkHref && (
        <Link href={announcement.linkHref} className="ml-2 font-medium underline underline-offset-2">
          {announcement.linkLabel}
        </Link>
      )}
    </div>
  )
}
