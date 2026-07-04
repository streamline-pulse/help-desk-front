import { NextResponse, type NextRequest } from "next/server"

import { normalizeApiError } from "@/lib/api-error"
import {
  apiErrorResponse,
  parseJson,
  rejectUntrustedMutation,
} from "@/lib/route-handler"
import { emailRequestSchema } from "@/schemas/api-auth.schema"
import { authService } from "@/services/auth.service"

export async function POST(request: NextRequest) {
  const rejected = rejectUntrustedMutation(request)
  if (rejected) return rejected

  const input = await parseJson(request, emailRequestSchema)
  if (input instanceof NextResponse) return input

  try {
    await authService.sendResetEmail(input)
    return NextResponse.json({ success: true as const })
  } catch (error) {
    const normalized = await normalizeApiError(error)

    if (normalized.status === 404) {
      return NextResponse.json({ success: true as const })
    }

    return apiErrorResponse(normalized)
  }
}
