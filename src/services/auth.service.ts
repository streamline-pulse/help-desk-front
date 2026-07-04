import "server-only"

import { httpClient } from "@/lib/http-client"
import type {
  AuthResponse,
  EmailRequest,
  MessageResponse,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  VerifyEmailRequest,
} from "@/types/api/auth.type"
import type { CurrentUserResponse } from "@/types/api/user.type"

function getApiUrl(path: string) {
  const baseUrl = process.env.HELP_DESK_API_URL

  if (!baseUrl) {
    throw new Error("HELP_DESK_API_URL is not configured")
  }

  return `${baseUrl.replace(/\/$/, "")}${path}`
}

function authorization(token: string) {
  return { authorization: `Bearer ${token}` }
}

export const authService = {
  signIn: (input: SignInRequest) =>
    httpClient
      .post(getApiUrl("/api/v1/auth/email/sign-in"), { json: input })
      .json<AuthResponse>(),
  signUp: (input: SignUpRequest) =>
    httpClient
      .post(getApiUrl("/api/v1/auth/email/sign-up"), { json: input })
      .json<AuthResponse>(),
  verifyEmail: ({ id, ...input }: VerifyEmailRequest, token: string) =>
    httpClient
      .put(getApiUrl(`/api/v1/auth/email/validate/${encodeURIComponent(id)}`), {
        json: input,
        headers: authorization(token),
      })
      .json<AuthResponse>(),
  resendVerification: (input: EmailRequest) =>
    httpClient
      .post(getApiUrl("/api/v1/auth/email/resend-verification"), {
        json: input,
      })
      .json<MessageResponse>(),
  sendResetEmail: (input: EmailRequest) =>
    httpClient
      .post(getApiUrl("/api/v1/auth/email/send-reset-email"), { json: input })
      .json<MessageResponse>(),
  resetPassword: (input: ResetPasswordRequest) =>
    httpClient
      .post(getApiUrl("/api/v1/auth/email/reset-password"), { json: input })
      .json<AuthResponse>(),
  getCurrentUser: (token: string) =>
    httpClient
      .get(getApiUrl("/api/v1/users/me"), {
        headers: authorization(token),
      })
      .json<CurrentUserResponse>(),
}
