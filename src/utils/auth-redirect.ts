import { routes } from "@/config/routes"

const AUTH_PATH_PREFIXES = [
  routes.auth.signIn,
  routes.auth.signUp,
  routes.auth.forgotPassword,
  routes.auth.verifyOtp,
  routes.auth.resetPassword,
  routes.auth.acceptInvitation,
] as const

export function getSafeCallbackUrl(
  callbackUrl: string | null | undefined,
  fallback: string = routes.board.root
): string {
  if (!callbackUrl?.startsWith("/") || callbackUrl.startsWith("//")) {
    return fallback
  }

  const isAuthPath = AUTH_PATH_PREFIXES.some(
    (path) => callbackUrl === path || callbackUrl.startsWith(`${path}?`)
  )

  if (isAuthPath) {
    return fallback
  }

  return callbackUrl
}
