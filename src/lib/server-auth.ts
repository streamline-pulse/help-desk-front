import "server-only"

import { cookies } from "next/headers"

import { normalizeApiError } from "@/lib/api-error"
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie"
import { authService } from "@/services/auth.service"
import type { AuthUser } from "@/types/api/user.type"

export async function getSessionToken() {
  return (await cookies()).get(AUTH_COOKIE_NAME)?.value
}

export async function getCurrentUserFromSession(): Promise<AuthUser | null> {
  const token = await getSessionToken()

  if (!token) {
    return null
  }

  try {
    const response = await authService.getCurrentUser(token)
    return response.data
  } catch (error) {
    const normalized = await normalizeApiError(error)

    if (normalized.status === 401 || normalized.status === 403) {
      return null
    }

    throw normalized
  }
}
