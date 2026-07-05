import { isAppApiError, isCancelledApiError } from "@/lib/api-error"

export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string | null {
  if (isCancelledApiError(error)) return null

  if (isAppApiError(error) && error.message.trim()) {
    return error.message.trim()
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim()
  }

  if (typeof error === "string" && error.trim()) {
    return error.trim()
  }

  return fallback
}

export function getApiSuccessMessage(data: unknown, fallback: string) {
  if (typeof data !== "object" || data === null) return fallback

  const message = (data as { message?: unknown }).message
  return typeof message === "string" && message.trim()
    ? message.trim()
    : fallback
}
