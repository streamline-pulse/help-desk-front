import { HTTPError, TimeoutError } from "ky"

import type {
  ApiErrorResponse,
  ApiErrorKind,
  ClientApiError,
} from "@/types/api/api-error.type"

const DEFAULT_MESSAGES: Record<number, string> = {
  400: "La requête est invalide.",
  401: "Votre session est absente ou a expiré.",
  403: "Vous n’avez pas l’autorisation d’effectuer cette action.",
  404: "La ressource demandée est introuvable.",
  409: "Cette information est déjà utilisée.",
  422: "Certaines informations sont invalides.",
  500: "Le service est momentanément indisponible.",
  502: "Le service d’authentification est momentanément indisponible.",
  503: "Le service d’authentification est momentanément indisponible. Réessayez dans quelques instants.",
  504: "Le service d’authentification met trop de temps à répondre.",
}

export class AppApiError extends Error implements ClientApiError {
  status: number
  httpStatus?: number
  code: string | number
  fieldErrors?: Record<string, string[]>
  data?: unknown
  kind: ApiErrorKind
  override cause?: unknown

  constructor(error: ClientApiError) {
    super(error.message)
    this.name = "AppApiError"
    this.status = error.status
    this.httpStatus = error.httpStatus ?? (error.status || undefined)
    this.code = error.code
    this.fieldErrors = error.fieldErrors
    this.data = error.data
    this.kind = error.kind ?? classifyStatus(error.status)
    this.cause = error.cause
  }
}

function classifyStatus(status: number): ApiErrorKind {
  if (status === 400 || status === 422) return "validation"
  if (status === 401) return "authentication"
  if (status === 403) return "authorization"
  if (status === 404) return "not-found"
  if (status === 409) return "conflict"
  if (status >= 500) return "server"
  if (status === 0 || status === 408) return "network"
  return "unknown"
}

function isAbortError(error: unknown) {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  )
}

function readErrorPayload(data: unknown) {
  if (typeof data === "string") {
    return { message: data }
  }

  if (typeof data !== "object" || data === null) {
    return {}
  }

  const payload = data as ApiErrorResponse & {
    summary?: unknown
    fieldErrors?: unknown
  }
  const message =
    typeof payload.message === "string"
      ? payload.message
      : typeof payload.summary === "string"
        ? payload.summary
        : undefined
  const fieldErrors =
    typeof payload.fieldErrors === "object" && payload.fieldErrors !== null
      ? (payload.fieldErrors as Record<string, string[]>)
      : undefined

  return {
    code: payload.code,
    message,
    data: payload.data,
    fieldErrors,
  }
}

export async function normalizeApiError(error: unknown): Promise<AppApiError> {
  if (error instanceof AppApiError) {
    return error
  }

  if (isAbortError(error)) {
    return new AppApiError({
      status: 0,
      code: "REQUEST_CANCELLED",
      message: "La requête a été annulée.",
      kind: "cancelled",
      cause: error,
    })
  }

  if (error instanceof TimeoutError) {
    return new AppApiError({
      status: 408,
      httpStatus: 408,
      code: "TIMEOUT",
      message: "Le service met trop de temps à répondre. Réessayez.",
      kind: "network",
      cause: error,
    })
  }

  if (error instanceof HTTPError) {
    const payload = readErrorPayload(error.data)

    const status = error.response.status
    const invalidCredentials =
      payload.code === "INVALID_CREDENTIALS" ||
      (status === 500 &&
        payload.message
          ?.toLocaleLowerCase("fr")
          .includes("identifiants invalides"))

    return new AppApiError({
      status: invalidCredentials ? 401 : status,
      httpStatus: status,
      code: invalidCredentials
        ? "INVALID_CREDENTIALS"
        : (payload.code ?? `HTTP_${status}`),
      message: invalidCredentials
        ? "E-mail ou mot de passe incorrect."
        : (payload.message ??
          DEFAULT_MESSAGES[status] ??
          "Une erreur inattendue est survenue."),
      data: payload.data,
      fieldErrors: payload.fieldErrors,
      kind: invalidCredentials ? "authentication" : classifyStatus(status),
      cause: error,
    })
  }

  return new AppApiError({
    status: 0,
    code: "NETWORK_ERROR",
    message: "Impossible de joindre le service. Vérifiez votre connexion.",
    kind: "network",
    cause: error,
  })
}

export function isAppApiError(error: unknown): error is AppApiError {
  return error instanceof AppApiError
}

export function isCancelledApiError(error: unknown) {
  return error instanceof AppApiError && error.kind === "cancelled"
}
