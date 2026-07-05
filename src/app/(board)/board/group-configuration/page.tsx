import { redirect } from "next/navigation"

import { routes } from "@/config/routes"

export default function GroupConfigurationPage() {
  redirect(routes.board.groupConfiguration.resource("group-types"))
}
