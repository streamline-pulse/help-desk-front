import type { AuthUser } from "@/types/api/user.type"

export type SignInRequest = {
  email: string
  password: string
  rememberMe?: boolean
}

export type SignUpRequest = {
  email: string
  password: string
  lastName: string
  firstName: string
  phone?: string
  indicatif?: string
  invitationToken?: string
  rememberMe?: boolean
}

export type VerifyEmailRequest = {
  id: string
  verificationToken: string
  logOutDevices?: boolean
  rememberMe?: boolean
}

export type EmailRequest = {
  email: string
}

export type ResetPasswordRequest = {
  resetToken: string
  password: string
  logOutDevices?: boolean
  rememberMe?: boolean
}

export type AuthResponse = {
  token: string
  user?: AuthUser | null
}

export type MessageResponse = {
  code: number
  message?: string | null
  data?: unknown
}
