"use client"

/* eslint-disable @next/next/no-img-element -- user-supplied data URL preview */
import type { CSSProperties, ReactNode } from "react"
import { ArrowUpRight } from "lucide-react"
import { CurrentYear } from "@/components/marketing/current-year"
import { useThemes } from "./themes-context"
import type { Portfolio, SectionId } from "@/lib/portfolio/types"
import { cn } from "@/lib/utils"

const fontStacks: Record<Portfolio["font"], string> = {
  Manrope: "var(--font-manrope), sans-serif",
  Georgia: "Georgia, serif",
  Arial: "Arial, sans-serif",
}

// Live preview of the generated portfolio site. React escapes all text, so
// user input is safe to render (the prototype hand-escaped HTML strings).
export function SitePreview({ data, device }: { data: Portfolio; device: "desktop" | "mobile" }) {
  const theme = useThemes().getTheme(data.theme)
  const mobile = device === "mobile"
  const heading = { fontFamily: fontStacks[data.font] }
  const skills = data.skills.split(",").map((s) => s.trim()).filter(Boolean)

  const blocks: Record<SectionId, ReactNode> = {
    hero: (
      <section className={cn("grid items-center gap-4 px-[7%] pt-12 pb-14", !mobile && "@lg:grid-cols-[1fr_34%]")}>
        <div>
          <p className="mb-3 text-[10px] font-extrabold" style={{ color: "var(--accent)" }}>WELCOME TO MY PORTFOLIO</p>
          <h1 className="mb-3 text-[clamp(23px,4cqi,39px)] leading-tight font-extrabold tracking-tight" style={heading}>
            Hi, I&apos;m {data.name}.
          </h1>
          <p className="text-[13px] font-extrabold" style={{ color: "var(--accent)" }}>{data.role}</p>
          <p className="text-xs leading-relaxed opacity-70">{data.bio}</p>
          <span className="mt-3 inline-block rounded-[7px] px-4 py-2.5 text-[11px] font-extrabold text-white" style={{ background: "var(--accent)" }}>
            Explore my work <ArrowUpRight className="ml-1 inline size-3" aria-hidden />
          </span>
        </div>
        {!mobile && (
          <div
            className="hidden min-h-[175px] place-items-center overflow-hidden rounded-[13px] text-6xl font-extrabold text-white @lg:grid"
            style={{ background: "linear-gradient(145deg,var(--accent),var(--color-brand-200))", ...heading }}
          >
            {data.photo ? <img src={data.photo} alt="Profile portrait" className="size-full object-cover" /> : (data.name || "A").charAt(0)}
          </div>
        )}
      </section>
    ),
    about: (
      <Section title="About me" heading={heading}>
        <p className="text-xs leading-relaxed opacity-75">{data.bio}</p>
      </Section>
    ),
    skills: (
      <Section title="My expertise" heading={heading}>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <span key={s} className="rounded-full border border-current/20 px-2.5 py-1.5 text-[10px]">{s}</span>
          ))}
        </div>
      </Section>
    ),
    projects: (
      <Section title="Selected projects" heading={heading}>
        <div className={cn("grid gap-3", !mobile && "@md:grid-cols-2")}>
          {[data.p1, data.p2].map((p, i) => (
            <div key={i} className="rounded-[9px] border border-current/20 p-3.5 text-xs">
              <div className="mb-2.5 h-14 rounded-[5px] bg-[linear-gradient(120deg,var(--color-ink-200),var(--color-brand-300))]" />
              <strong>{p}</strong>
              <p className="opacity-70">Featured project</p>
            </div>
          ))}
        </div>
      </Section>
    ),
    contact: (
      <Section title="Let's work together." heading={heading}>
        <p className="text-xs opacity-75">Have a project in mind? I&apos;d love to hear about it.</p>
        <strong className="text-xs" style={{ color: "var(--accent)" }}>{data.email || "Add your email in the editor"}</strong>
      </Section>
    ),
  }

  return (
    <div
      className={cn("@container mx-auto min-h-[430px] overflow-hidden shadow-[0_10px_25px_#0001] transition-[width]", mobile ? "w-[350px] max-w-full" : "w-full")}
      style={{ "--accent": data.accent, background: theme.paper, color: theme.ink } as CSSProperties}
    >
      <header className="flex justify-between px-[7%] py-6 text-[11px]">
        <strong className="font-extrabold">{data.name}</strong>
        <span className="flex gap-3"><span>About</span><span>Projects</span><span>Contact</span></span>
      </header>
      {data.sections.filter((s) => !data.hidden.includes(s)).map((s) => <div key={s}>{blocks[s]}</div>)}
      <footer className="px-[7%] py-6 text-[11px] opacity-60">
        © <CurrentYear /> {data.name}. Made with Gigwise.
      </footer>
    </div>
  )
}

function Section({ title, heading, children }: { title: string; heading: CSSProperties; children: ReactNode }) {
  return (
    <section className="space-y-3 border-t border-current/10 px-[7%] py-7">
      <h2 className="text-xl font-extrabold" style={heading}>{title}</h2>
      {children}
    </section>
  )
}
