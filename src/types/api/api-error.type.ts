export type ApiErrorResponse = {
  code?: string | number
  message?: string | null
  data?: unknown
}

export type ApiErrorKind =
  | "validation"
  | "authentication"
  | "authorization"
  | "not-found"
  | "conflict"
  | "network"
  | "cancelled"
  | "server"
  | "unknown"

export type NormalizedApiError = {
  httpStatus?: number
  code?: string | number
  message: string
  fieldErrors?: Record<string, string[]>
  data?: unknown
  kind: ApiErrorKind
  cause?: unknown
}

export type ClientApiError = NormalizedApiError & {
  status: number
  code: string | number
}
