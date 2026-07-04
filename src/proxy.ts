import { NextResponse, type NextRequest } from "next/server"

import { isModuleRouteAvailable } from "@/config/navigation-items"
import { routes } from "@/config/routes"
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie"

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isPrivateRoute = pathname === routes.board.root || pathname.startsWith(`${routes.board.root}/`)

  if (isPrivateRoute && !request.cookies.has(AUTH_COOKIE_NAME)) {
    const destination = new URL(routes.auth.signIn, request.url)
    destination.searchParams.set(
      "callbackUrl",
      `${pathname}${request.nextUrl.search}`
    )
    return NextResponse.redirect(destination)
  }

  if (isModuleRouteAvailable(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const destination = new URL(routes.board.root, request.url)
  destination.searchParams.set("module", "indisponible")

  return NextResponse.redirect(destination)
}

export const config = {
  matcher: [
    "/board/:path*",
    "/demandes/:path*",
    "/boite-de-reception/:path*",
    "/clients/:path*",
    "/approbations/:path*",
    "/equipes/:path*",
    "/statistiques/:path*",
    "/parametres/:path*",
  ],
}
