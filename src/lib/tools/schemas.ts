import { z } from "zod"

// Form schemas shared by the tool pages. The same schemas should validate
// route-handler input when these tools move server-side.

const count = z.coerce.number<string>().int("Use whole numbers.").min(0, "Can't be negative.")

export const discoverSchema = z.object({
  skills: z.string().trim().min(1, "Add at least one skill."),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  goal: z.enum(["Get my first order", "Find higher-value work", "Find repeatable services"]),
})

export const createGigSchema = z.object({
  service: z.string().trim().min(3, "Describe the service you offer."),
  buyerProblem: z.string().trim().min(3, "Describe the buyer problem you solve."),
  price: z.coerce.number<string>().min(5, "Fiverr's minimum is $5."),
  days: z.coerce.number<string>().int().min(1, "At least 1 day."),
})

export const optimizeSchema = z.object({
  username: z.string().trim().max(100),
  gigUrl: z.union([z.literal(""), z.url("Enter a full URL, e.g. https://www.fiverr.com/…")]),
  title: z.string().trim().min(1, "Paste your current gig title."),
  description: z.string().trim().min(1, "Paste your current gig description."),
})

export const funnelSchema = z
  .object({ impressions: count, clicks: count, orders: count })
  .refine((v) => v.impressions > 0, { path: ["impressions"], message: "Need at least 1 impression." })
  .refine((v) => v.clicks <= v.impressions, { path: ["clicks"], message: "Clicks can't exceed impressions." })
  .refine((v) => v.orders <= v.clicks, { path: ["orders"], message: "Orders can't exceed clicks." })

export const experimentSchema = z
  .object({ change: z.string().trim().min(1, "Describe what you changed."), impressions: count, clicks: count, orders: count })
  .refine((v) => v.clicks <= v.impressions, { path: ["clicks"], message: "Clicks can't exceed impressions." })
  .refine((v) => v.orders <= v.clicks, { path: ["orders"], message: "Orders can't exceed clicks." })

export const competitorSchema = z.object({
  service: z.string().trim().min(1, "Enter your service."),
  offers: z.string().trim().min(1, "Paste at least one competitor offer."),
})

export const buyerSchema = z.object({
  message: z.string().trim().min(1, "Paste a buyer message.").max(10000),
})

export const profitSchema = z.object({
  price: z.coerce.number<string>().min(0),
  hours: z.coerce.number<string>().gt(0, "Hours must be more than 0."),
  fee: z.coerce.number<string>().min(0).max(100, "Fee must be 0–100%."),
  costs: z.coerce.number<string>().min(0),
})
