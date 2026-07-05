import "server-only"

import type { Options } from "ky"

import { normalizeApiError } from "@/lib/api-error"
import { httpClient } from "@/lib/http-client"

function getApiUrl(path: string) {
  const baseUrl = process.env.HELP_DESK_API_URL

  if (!baseUrl) {
    throw new Error("HELP_DESK_API_URL is not configured")
  }

  const normalizedPath = path.replace(/^\//, "")
  return `${baseUrl.replace(/\/$/, "")}/${normalizedPath}`
}

type BackendRequestOptions = Options & {
  token?: string
}

export async function requestBackendApi<T>(
  path: string,
  { token, headers, ...options }: BackendRequestOptions = {}
): Promise<T> {
  const requestHeaders = new Headers()
  if (headers instanceof Headers) {
    headers.forEach((value, key) => requestHeaders.set(key, value))
  } else if (Array.isArray(headers)) {
    for (const [key, value] of headers) requestHeaders.set(key, value)
  } else if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      if (value !== undefined) requestHeaders.set(key, value)
    }
  }
  if (token) requestHeaders.set("authorization", `Bearer ${token}`)

  try {
    return await httpClient(getApiUrl(path), {
      ...options,
      headers: requestHeaders,
    }).json<T>()
  } catch (error) {
    throw await normalizeApiError(error)
  }
}
