import "server-only"

import { requestBackendApi } from "@/lib/backend-api-client"
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

export const authService = {
  signIn: (input: SignInRequest) =>
    requestBackendApi<AuthResponse>("/api/v1/auth/email/sign-in", {
      method: "post",
      json: input,
    }),
  signUp: (input: SignUpRequest) =>
    requestBackendApi<AuthResponse>("/api/v1/auth/email/sign-up", {
      method: "post",
      json: input,
    }),
  verifyEmail: ({ id, ...input }: VerifyEmailRequest, token: string) =>
    requestBackendApi<AuthResponse>(
      `/api/v1/auth/email/validate/${encodeURIComponent(id)}`,
      { method: "put", json: input, token }
    ),
  resendVerification: (input: EmailRequest) =>
    requestBackendApi<MessageResponse>(
      "/api/v1/auth/email/resend-verification",
      { method: "post", json: input }
    ),
  sendResetEmail: (input: EmailRequest) =>
    requestBackendApi<MessageResponse>(
      "/api/v1/auth/email/send-reset-email",
      { method: "post", json: input }
    ),
  resetPassword: (input: ResetPasswordRequest) =>
    requestBackendApi<AuthResponse>("/api/v1/auth/email/reset-password", {
      method: "post",
      json: input,
    }),
  getCurrentUser: (token: string) =>
    requestBackendApi<CurrentUserResponse>("/api/v1/users/me", { token }),
}
