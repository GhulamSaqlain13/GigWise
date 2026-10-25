import { Instrument_Serif, Inter_Tight } from "next/font/google"

// Landing-page fonts only (exposed as font-landing / font-serif in globals.css).
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] })
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: "italic" })

export const landingFontVars = `${interTight.variable} ${instrumentSerif.variable}`
