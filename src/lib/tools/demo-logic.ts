// Template/rule-based demo logic ported 1:1 from the HTML prototype
// (docs/Gigwise_All_in_One_Landing_Dashboard_Portfolio.html).
// NONE of this is AI or market research. Replace with server-side AI jobs
// (src/app/api/ai/*) that validate output with Zod — see CLAUDE.md.
// Product rule: never present outputs as order probabilities or official SEO.

/** Landing-page "explore your service direction" demo. */
export function landingServiceDirection(skills: string, goal: "focused" | "projects" | "recurring") {
  const s = skills.toLowerCase()
  const idea = /react|next|node|aws|docker|javascript|web/.test(s)
    ? "Fix a specific website or deployment issue"
    : /design|figma|photoshop|illustrat/.test(s)
      ? "Create focused brand or social-media design assets"
      : /shopify|ecommerce|store/.test(s)
        ? "Improve one specific online-store experience"
        : /write|content|seo/.test(s)
          ? "Create targeted website content or content refreshes"
          : "Turn one of your skills into a clearly scoped, buyer-focused service"
  const next =
    goal === "recurring"
      ? "Consider a monthly maintenance or recurring deliverable."
      : goal === "projects"
        ? "Define a fixed-scope project with clear acceptance criteria."
        : "Choose a narrow buyer problem instead of a broad category."
  return `${idea}. ${next}`
}

export function splitSkills(input: string, max = 8) {
  return input
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, max)
}

/** Discover: brainstorm service directions from skills. */
export function suggestServices(skills: string[]) {
  return skills
    .flatMap((x) => [`Fix common ${x} issues for small businesses`, `Set up and customize ${x} for a specific use case`])
    .slice(0, 8)
}

/** Create: template gig draft. */
export function draftGig(service: string, buyerProblem: string) {
  const title = "I will " + service.replace(/^i will\s+/i, "").replace(/[.!]+$/, "")
  const description = `I help clients with ${service}. If you are facing this issue: ${buyerProblem}, I can review your requirements and deliver a clearly defined solution. Please contact me before ordering to confirm scope, access and timeline.`
  return { title, description }
}

export function packagePrices(price: number) {
  return { basic: price, standard: Math.round(price * 2), premium: Math.round(price * 3) }
}

/** Optimize: transparent heuristic checks. Internal score, NOT official SEO. */
export function auditGigContent(title: string, description: string) {
  const issues: string[] = []
  if (title.length < 25) issues.push("Title may be too vague; describe a specific buyer outcome.")
  if (title.length > 80) issues.push("Check title length against Fiverr current requirements.")
  if (description.length < 250) issues.push("Add clearer deliverables, scope, buyer requirements and next steps.")
  if (!/you|your|buyer|client/i.test(description)) issues.push("Write more directly to the buyer and their problem.")
  if (!/deliver|include|provide|fix|build|design/i.test(description)) issues.push("Describe the exact deliverables.")
  if (!issues.length) issues.push("Review pricing, proof, FAQs and thumbnail clarity manually.")
  const score = Math.max(20, 100 - issues.length * 13)
  return { issues, score }
}

/** Gig Problem Doctor: deterministic funnel maths + rule-based note. */
export function diagnoseFunnel(impressions: number, clicks: number, orders: number) {
  const ctr = (clicks / impressions) * 100
  const conversion = clicks > 0 ? (orders / clicks) * 100 : 0
  const note =
    clicks < 10
      ? "There is limited click data. Collect more observations before drawing conclusions."
      : clicks / impressions < 0.01
        ? "Investigate title, thumbnail and search relevance; low CTR alone does not prove the cause."
        : orders === 0
          ? "Investigate pricing, service clarity, trust and requirements; this does not establish causation."
          : "Continue monitoring and test one change at a time."
  return { ctr, conversion, note }
}

export function thumbnailChecklist(headline: string) {
  return [
    headline.length > 42
      ? "Long headline: try a shorter, more readable phrase."
      : "Headline length is reasonable for a small card.",
    "Check legibility on a mobile screen.",
    "Use one dominant benefit and strong contrast.",
    "Verify safe margins and image requirements before upload.",
  ]
}

export function positioningIdeas(service: string) {
  return [
    `Focus on one narrow buyer problem within “${service}”.`,
    "Offer a clear scope, turnaround and defined deliverables.",
    "Explain who the service is best for and what is excluded.",
    "Check whether competitors already offer the same promise.",
  ]
}

export const SCOPE_CLARIFICATION_REPLY =
  "Thanks for reaching out! I can take a look. Could you please share the exact issue, your desired outcome, relevant screenshots or error messages, and your preferred deadline? After reviewing the details, I can confirm the scope, timeline, and price before we proceed."

/** Simple red-flag scan for buyer messages (spec §5.8 safety). */
export function buyerMessageFlags(message: string) {
  const flags: string[] = []
  if (/password|login details|credentials/i.test(message)) flags.push("Asks for passwords or login details — never share credentials in chat.")
  if (/whatsapp|telegram|skype|outside fiverr|off[- ]platform|my email/i.test(message)) flags.push("Mentions moving off-platform — keep communication and payment on Fiverr.")
  if (/https?:\/\//i.test(message)) flags.push("Contains a link — check it carefully before opening.")
  return flags
}

/** Profit calculator: Net = price × (1 − fee%) − costs. */
export function profit(price: number, hours: number, feePct: number, costs: number) {
  const net = price * (1 - feePct / 100) - costs
  return { net, hourly: net / hours }
}

export const DEFAULT_ROADMAP = [
  "Choose a specific service niche",
  "Create or optimize one gig",
  "Review gig thumbnail clarity",
  "Record starting performance metrics",
  "Review results and plan next experiment",
] as const

/** One-line explanation per step, index-aligned with DEFAULT_ROADMAP. */
export const ROADMAP_HINTS = [
  "Turn your skills into two or three specific service ideas, then pick the one with the clearest buyer problem.",
  "Write a gig around one buyer problem with a clear scope, price and delivery time.",
  "Check that your thumbnail headline is short and readable at mobile card size.",
  "Note your current impressions, clicks and orders so you have a baseline to compare against.",
  "Compare results with your baseline and choose one change to test next.",
] as const

/** Where each roadmap step is done, index-aligned with DEFAULT_ROADMAP. */
export const ROADMAP_LINKS = ["/discover", "/gigs/new", "/tools/thumbnails", "/tools/gig-doctor", "/tools/experiments"] as const
