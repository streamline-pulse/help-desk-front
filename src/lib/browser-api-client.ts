import type { Options } from "ky"

import { AUTH_COOKIE_NAME } from "@/config/auth"
import { normalizeApiError } from "@/lib/api-error"
import { httpClient } from "@/lib/http-client"

function getAuthToken() {
  if (typeof document === "undefined") return undefined

  const prefix = `${encodeURIComponent(AUTH_COOKIE_NAME)}=`
  const cookie = document.cookie
    .split("; ")
    .find((value) => value.startsWith(prefix))

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined
}

function getApiUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_HELP_DESK_API_URL

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_HELP_DESK_API_URL is not configured")
  }

  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

export async function requestApi<T>(
  path: string,
  options: Options = {}
): Promise<T> {
  const headers = new Headers(options.headers as HeadersInit | undefined)
  const token = getAuthToken()
  if (token) headers.set("authorization", `Bearer ${token}`)

  try {
    return await httpClient(getApiUrl(path), { ...options, headers }).json<T>()
  } catch (error) {
    throw await normalizeApiError(error)
  }
}
