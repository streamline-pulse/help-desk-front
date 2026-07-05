import type { NextResponse } from "next/server"

import { AUTH_COOKIE_NAME } from "@/config/auth"

export { AUTH_COOKIE_NAME }

const MAX_PERSISTENT_AGE_SECONDS = 60 * 60 * 24 * 30

function getJwtRemainingAge(token: string): number | undefined {
  const payload = token.split(".")[1]

  if (!payload) {
    return undefined
  }

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
    const parsed = JSON.parse(
      Buffer.from(normalized, "base64").toString("utf8")
    ) as { exp?: unknown }

    if (typeof parsed.exp !== "number") {
      return undefined
    }

    return Math.max(0, parsed.exp - Math.floor(Date.now() / 1000))
  } catch {
    return undefined
  }
}

export function setAuthCookie(
  response: NextResponse,
  token: string,
  rememberMe: boolean
) {
  const remainingAge = getJwtRemainingAge(token)
  const maxAge = rememberMe
    ? Math.min(remainingAge ?? MAX_PERSISTENT_AGE_SECONDS, MAX_PERSISTENT_AGE_SECONDS)
    : undefined

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    priority: "high",
    ...(maxAge !== undefined ? { maxAge } : {}),
  })
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
}
