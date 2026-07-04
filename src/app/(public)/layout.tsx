import { redirect } from "next/navigation"

import { routes } from "@/config/routes"
import { getCurrentUserFromSession } from "@/lib/server-auth"

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUserFromSession()

  if (user?.emailVerified) {
    redirect(routes.board.root)
  }

  return children
}
