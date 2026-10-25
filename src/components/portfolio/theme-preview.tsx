import type { PortfolioTheme } from "@/lib/portfolio/themes"

/** Miniature of a portfolio theme. Colours come from the user-selectable theme. */
export function ThemePreview({ theme, className = "h-[185px] p-4" }: { theme: PortfolioTheme; className?: string }) {
  return (
    <div className={className} style={{ background: theme.bg }} aria-hidden>
      <div className="h-full rounded-[7px] p-3 shadow-[0_10px_25px_#0002]" style={{ background: theme.paper, color: theme.ink }}>
        <div className="flex justify-between text-[8px] font-extrabold opacity-80">
          <span>PORTFOLIO.</span>
          <span>About  Work  Contact</span>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <div className="flex-1">
            <b className="block text-base leading-tight tracking-tight">Building ideas<br />into reality.</b>
            <p className="text-[8px] opacity-65">{theme.role}</p>
            <span className="inline-block h-2 w-14 rounded-[3px]" style={{ background: theme.accent }} />
          </div>
          <div className="h-[66px] w-[55px] shrink-0 rounded-md" style={{ background: `linear-gradient(140deg,${theme.accent},${theme.bg})` }} />
        </div>
      </div>
    </div>
  )
}
