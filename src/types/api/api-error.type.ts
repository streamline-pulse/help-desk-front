export type ApiErrorResponse = {
  code?: string | number
  message?: string | null
  data?: unknown
}

export type ClientApiError = {
  status: number
  code: string
  message: string
  fieldErrors?: Record<string, string[]>
}
