import type { Metadata } from "next"
import { Inter, Manrope, Plus_Jakarta_Sans } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] })
// Display font for headings (font-display / font-heading).
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] })
// Portfolio Studio site-preview font (user content).
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] })

export const metadata: Metadata = {
  title: { default: "Gigwise — From your skills to your next great gig", template: "%s · Gigwise" },
  description:
    "Gigwise helps freelancers discover services, create stronger Fiverr gigs, and improve their seller experience with actionable insights. Independent; not affiliated with Fiverr.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
