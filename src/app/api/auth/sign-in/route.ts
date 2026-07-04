import { NextResponse, type NextRequest } from "next/server"

import { setAuthCookie } from "@/lib/auth-cookie"
import {
  apiErrorResponse,
  parseJson,
  rejectUntrustedMutation,
} from "@/lib/route-handler"
import { signInRequestSchema } from "@/schemas/api-auth.schema"
import { authService } from "@/services/auth.service"

export async function POST(request: NextRequest) {
  const rejected = rejectUntrustedMutation(request)
  if (rejected) return rejected

  const input = await parseJson(request, signInRequestSchema)
  if (input instanceof NextResponse) return input

  try {
    const result = await authService.signIn(input)
    const response = NextResponse.json({ user: result.user ?? null })
    setAuthCookie(response, result.token, input.rememberMe)
    return response
  } catch (error) {
    return apiErrorResponse(error)
  }
}
