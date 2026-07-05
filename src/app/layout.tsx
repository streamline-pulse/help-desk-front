import { Figtree, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { QueryProvider } from "@/provider/query.provider"
import { NuqsAdapter } from "nuqs/adapters/next/app"

const interHeading = Inter({ subsets: ["latin"], variable: "--font-heading" })

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        figtree.variable,
        interHeading.variable
      )}
    >
      <body>
        <QueryProvider>
          <NuqsAdapter>
            <ThemeProvider>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster closeButton expand visibleToasts={5} duration={5_000} />
            </ThemeProvider>
          </NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  )
}
