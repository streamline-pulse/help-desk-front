import Link from "next/link"

import { AuthBrandPanel } from "@/app/(public)/_components/auth-brand-panel"
import { routes } from "@/config/routes"
import { cn } from "@/lib/utils"

type AuthShellProps = {
  children: React.ReactNode
  className?: string
}

export function AuthShell({ children, className }: AuthShellProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col bg-background">
        <header className="px-6 py-6 lg:px-16">
          <Link
            href={routes.home}
            className="font-heading text-sm font-semibold text-foreground"
          >
            Help Desk 
          </Link>
        </header>

        <main
          className={cn(
            "flex flex-1 flex-col justify-center px-6 pb-10 lg:px-16",
            className
          )}
        >
          <div className="mx-auto w-full max-w-md">{children}</div>
        </main>
      </div>

      <aside className="hidden min-h-dvh lg:flex lg:flex-col">
        <AuthBrandPanel />
      </aside>
    </div>
  )
}
