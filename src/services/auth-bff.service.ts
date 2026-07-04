import { httpClient } from "@/lib/http-client"
import { normalizeApiError } from "@/lib/api-error"
import type {
  EmailRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  VerifyEmailRequest,
} from "@/types/api/auth.type"
import type { AuthUser } from "@/types/api/user.type"

async function request<T>(
  path: string,
  options?: Parameters<typeof httpClient>[1]
): Promise<T> {
  try {
    return await httpClient(path, options).json<T>()
  } catch (error) {
    throw await normalizeApiError(error)
  }
}

export const authBffService = {
  signIn: (input: SignInRequest) =>
    request<{ user: AuthUser | null }>("/api/auth/sign-in", {
      method: "post",
      json: input,
    }),
  signUp: (input: SignUpRequest) =>
    request<{ user: AuthUser | null }>("/api/auth/sign-up", {
      method: "post",
      json: input,
    }),
  verifyEmail: (input: VerifyEmailRequest) =>
    request<{ success: true }>("/api/auth/verify-email", {
      method: "put",
      json: input,
    }),
  resendVerification: (input: EmailRequest) =>
    request<{ success: true }>("/api/auth/resend-verification", {
      method: "post",
      json: input,
    }),
  sendResetEmail: (input: EmailRequest) =>
    request<{ success: true }>("/api/auth/forgot-password", {
      method: "post",
      json: input,
    }),
  resetPassword: (input: ResetPasswordRequest) =>
    request<{ success: true }>("/api/auth/reset-password", {
      method: "post",
      json: input,
    }),
  getCurrentUser: () => request<AuthUser>("/api/auth/session"),
  signOut: () =>
    request<{ success: true }>("/api/auth/logout", { method: "post" }),
}
