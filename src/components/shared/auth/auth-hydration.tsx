import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"

import { authQueryKeys } from "@/hooks/queries/auth-query-keys"
import type { AuthUser } from "@/types/api/user.type"

export function AuthHydration({
  user,
  children,
}: {
  user: AuthUser
  children: React.ReactNode
}) {
  const queryClient = new QueryClient()
  queryClient.setQueryData(authQueryKeys.currentUser(), user)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}
