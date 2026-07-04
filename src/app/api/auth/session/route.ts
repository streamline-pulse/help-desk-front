import { NextResponse, type NextRequest } from "next/server"

import { AUTH_COOKIE_NAME, clearAuthCookie } from "@/lib/auth-cookie"
import { apiErrorResponse } from "@/lib/route-handler"
import { authService } from "@/services/auth.service"

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.json(
      { code: "MISSING_SESSION", message: "Aucune session active." },
      { status: 401 }
    )
  }

  try {
    const result = await authService.getCurrentUser(token)
    return NextResponse.json(result.data)
  } catch (error) {
    const response = await apiErrorResponse(error)

    if (response.status === 401 || response.status === 403) {
      clearAuthCookie(response)
    }

    return response
  }
}
