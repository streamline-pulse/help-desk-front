import { redirect } from "next/navigation"

import { routes } from "@/config/routes"

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(routes.board.groups.roles(id))
}
