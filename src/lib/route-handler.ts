import { NextResponse, type NextRequest } from "next/server"
import type { z } from "zod"

import { normalizeApiError } from "@/lib/api-error"
import { hasTrustedOrigin } from "@/lib/request-security"

export function rejectUntrustedMutation(request: NextRequest) {
  if (hasTrustedOrigin(request)) {
    return null
  }

  return NextResponse.json(
    {
      code: "INVALID_ORIGIN",
      message: "L’origine de la requête est invalide.",
    },
    { status: 403 }
  )
}

export async function parseJson<TSchema extends z.ZodType>(
  request: NextRequest,
  schema: TSchema
): Promise<z.output<TSchema> | NextResponse> {
  try {
    const payload: unknown = await request.json()
    const result = schema.safeParse(payload)

    if (result.success) {
      return result.data
    }

    const fieldErrors: Record<string, string[]> = {}

    for (const issue of result.error.issues) {
      const field = String(issue.path[0] ?? "form")
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message]
    }

    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        message: "Certaines informations sont invalides.",
        fieldErrors,
      },
      { status: 422 }
    )
  } catch {
    return NextResponse.json(
      { code: "INVALID_JSON", message: "La requête est invalide." },
      { status: 400 }
    )
  }
}

export async function apiErrorResponse(error: unknown) {
  const normalized = await normalizeApiError(error)

  return NextResponse.json(
    { code: normalized.code, message: normalized.message },
    { status: normalized.status || 503 }
  )
}
