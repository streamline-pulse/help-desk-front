import { NextResponse, type NextRequest } from "next/server"

import { AUTH_COOKIE_NAME, clearAuthCookie } from "@/lib/auth-cookie"
import {
  apiErrorResponse,
  parseJson,
  rejectUntrustedMutation,
} from "@/lib/route-handler"
import { verifyEmailRequestSchema } from "@/schemas/api-auth.schema"
import { authService } from "@/services/auth.service"

export async function PUT(request: NextRequest) {
  const rejected = rejectUntrustedMutation(request)
  if (rejected) return rejected

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.json(
      { code: "MISSING_SESSION", message: "La session de validation a expiré." },
      { status: 401 }
    )
  }

  const input = await parseJson(request, verifyEmailRequestSchema)
  if (input instanceof NextResponse) return input

  try {
    await authService.verifyEmail(input, token)
    const response = NextResponse.json({ success: true as const })
    clearAuthCookie(response)
    return response
  } catch (error) {
    return apiErrorResponse(error)
  }
}
