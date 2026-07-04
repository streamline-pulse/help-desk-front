"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { routes } from "@/config/routes"
import {
  useCurrentUserQuery,
  useSignOutMutation,
} from "@/hooks/queries/use-auth.query"
import { isAppApiError } from "@/lib/api-error"

export function useSessionGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const currentUser = useCurrentUserQuery()
  const signOut = useSignOutMutation()

  useEffect(() => {
    if (
      !currentUser.error ||
      !isAppApiError(currentUser.error) ||
      ![401, 403].includes(currentUser.error.status) ||
      signOut.isPending
    ) {
      return
    }

    void signOut.mutateAsync().finally(() => {
      const callbackUrl = encodeURIComponent(pathname)
      router.replace(`${routes.auth.signIn}?callbackUrl=${callbackUrl}`)
      router.refresh()
    })
  }, [currentUser.error, pathname, router, signOut])
}
