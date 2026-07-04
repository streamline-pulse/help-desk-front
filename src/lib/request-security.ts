import type { NextRequest } from "next/server"

export function hasTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host")

  if (!origin || !host) {
    return false
  }

  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}
