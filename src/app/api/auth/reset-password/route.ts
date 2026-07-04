import { NextResponse, type NextRequest } from "next/server"

import { clearAuthCookie } from "@/lib/auth-cookie"
import {
  apiErrorResponse,
  parseJson,
  rejectUntrustedMutation,
} from "@/lib/route-handler"
import { resetPasswordRequestSchema } from "@/schemas/api-auth.schema"
import { authService } from "@/services/auth.service"

export async function POST(request: NextRequest) {
  const rejected = rejectUntrustedMutation(request)
  if (rejected) return rejected

  const input = await parseJson(request, resetPasswordRequestSchema)
  if (input instanceof NextResponse) return input

  try {
    await authService.resetPassword(input)
    const response = NextResponse.json({ success: true as const })
    clearAuthCookie(response)
    return response
  } catch (error) {
    return apiErrorResponse(error)
  }
}
