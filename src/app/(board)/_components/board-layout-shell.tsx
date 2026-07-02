"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import { useAuth } from "@/hooks/use-auth"

type BoardLayoutShellProps = {
  children: React.ReactNode
}

export function BoardLayoutShell({ children }: BoardLayoutShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isHydrated } = useAuth()

  useEffect(() => {
    if (!isHydrated || isAuthenticated) {
      return
    }

    const callbackUrl = encodeURIComponent(pathname)
    router.replace(`${routes.auth.signIn}?callbackUrl=${callbackUrl}`)
  }, [isAuthenticated, isHydrated, pathname, router])

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  return children
}
