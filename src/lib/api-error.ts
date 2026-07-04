import { HTTPError, TimeoutError } from "ky"

import type {
  ApiErrorResponse,
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
  code: string
  fieldErrors?: Record<string, string[]>

  constructor(error: ClientApiError) {
    super(error.message)
    this.name = "AppApiError"
    this.status = error.status
    this.code = error.code
    this.fieldErrors = error.fieldErrors
  }
}

export async function normalizeApiError(error: unknown): Promise<AppApiError> {
  if (error instanceof AppApiError) {
    return error
  }

  if (error instanceof TimeoutError) {
    return new AppApiError({
      status: 408,
      code: "TIMEOUT",
      message: "Le service met trop de temps à répondre. Réessayez.",
    })
  }

  if (error instanceof HTTPError) {
    const payload =
      typeof error.data === "object" && error.data !== null
        ? (error.data as ApiErrorResponse)
        : undefined

    const status = error.response.status
    const invalidCredentials =
      payload?.code === "INVALID_CREDENTIALS" ||
      (status === 500 &&
        payload?.message
          ?.toLocaleLowerCase("fr")
          .includes("identifiants invalides"))

    return new AppApiError({
      status: invalidCredentials ? 401 : status,
      code: invalidCredentials ? "INVALID_CREDENTIALS" : `HTTP_${status}`,
      message: invalidCredentials
        ? "E-mail ou mot de passe incorrect."
        : (DEFAULT_MESSAGES[status] ?? "Une erreur inattendue est survenue."),
    })
  }

  return new AppApiError({
    status: 0,
    code: "NETWORK_ERROR",
    message: "Impossible de joindre le service. Vérifiez votre connexion.",
  })
}

export function isAppApiError(error: unknown): error is AppApiError {
  return error instanceof AppApiError
}
