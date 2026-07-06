import { redirect } from "next/navigation"

import { routes } from "@/config/routes"

export default function GroupSpacePage() {
  redirect(routes.board.groupSpace.roles)
}
