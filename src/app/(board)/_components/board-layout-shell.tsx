"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Spinner } from "@/components/ui/spinner"
import { routes } from "@/config/routes"
import { useAuth } from "@/hooks/use-auth"

type BoardLayoutShellProps = {
  children: React.ReactNode
}

export function BoardLayoutShell({ children }: BoardLayoutShellProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(routes.auth.signIn)
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  return children
}
