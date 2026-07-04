import { redirect } from "next/navigation"

import { BoardLayoutShell } from "@/app/(board)/_components/board-layout-shell"
import { BoardSidebarLayout } from "@/app/(board)/_components/board-sidebar-layout"
import { AuthHydration } from "@/components/shared/auth/auth-hydration"
import { routes } from "@/config/routes"
import { getCurrentUserFromSession } from "@/lib/server-auth"

export default async function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUserFromSession()

  if (!user) {
    redirect(`${routes.auth.signIn}?callbackUrl=${encodeURIComponent(routes.board.root)}`)
  }

  if (!user.emailVerified) {
    const params = new URLSearchParams({ id: user.id })
    if (user.email) params.set("email", user.email)
    redirect(`${routes.auth.verifyOtp}?${params.toString()}`)
  }

  return (
    <AuthHydration user={user}>
      <BoardLayoutShell>
        <BoardSidebarLayout>{children}</BoardSidebarLayout>
      </BoardLayoutShell>
    </AuthHydration>
  )
}
