import { NextResponse, type NextRequest } from "next/server"

import { isModuleRouteAvailable } from "@/config/navigation-items"
import { routes } from "@/config/routes"

export function proxy(request: NextRequest) {
  if (isModuleRouteAvailable(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const destination = new URL(routes.board.root, request.url)
  destination.searchParams.set("module", "indisponible")

  return NextResponse.redirect(destination)
}

export const config = {
  matcher: [
    "/demandes/:path*",
    "/boite-de-reception/:path*",
    "/clients/:path*",
    "/approbations/:path*",
    "/equipes/:path*",
    "/statistiques/:path*",
    "/parametres/:path*",
  ],
}
