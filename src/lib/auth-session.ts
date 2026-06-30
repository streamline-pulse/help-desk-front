import { mockAuthCredentials } from "@/config/mock-auth"

const STORAGE_KEY = "help-desk-auth-session"
const AUTH_CHANGE_EVENT = "help-desk-auth-change"

export type AuthSession = {
  email: string
}

export function getAuthSessionSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  return sessionStorage.getItem(STORAGE_KEY)
}

export function parseAuthSession(raw: string | null): AuthSession | null {
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    return null
  }
}

export function getAuthSession() {
  return parseAuthSession(getAuthSessionSnapshot())
}

export function subscribeToAuthSession(callback: () => void) {
  window.addEventListener(AUTH_CHANGE_EVENT, callback)

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback)
  }
}

export function signInWithMockCredentials(
  email: string,
  password: string
): { ok: true } | { ok: false; message: string } {
  const normalizedEmail = email.trim().toLowerCase()

  if (
    normalizedEmail !== mockAuthCredentials.email ||
    password !== mockAuthCredentials.password
  ) {
    return { ok: false, message: "E-mail ou mot de passe incorrect." }
  }

  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ email: mockAuthCredentials.email })
  )
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))

  return { ok: true }
}

export function signOut() {
  sessionStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}
