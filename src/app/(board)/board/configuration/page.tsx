import { redirect } from "next/navigation"

import { routes } from "@/config/routes"

export default function ConfigurationPage() {
  redirect(routes.board.configuration.resource("countries"))
}
