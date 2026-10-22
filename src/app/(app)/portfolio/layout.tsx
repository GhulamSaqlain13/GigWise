import { PortfolioProvider } from "@/components/portfolio/portfolio-provider"

export default function PortfolioLayout({ children }: LayoutProps<"/portfolio">) {
  return <PortfolioProvider>{children}</PortfolioProvider>
}
