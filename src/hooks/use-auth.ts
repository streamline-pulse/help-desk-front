"use client"

import { useMemo, useSyncExternalStore } from "react"

import {
  getAuthSessionSnapshot,
  parseAuthSession,
  signOut,
  subscribeToAuthSession,
} from "@/lib/auth-session"

export function useAuth() {
  const rawSession = useSyncExternalStore(
    subscribeToAuthSession,
    getAuthSessionSnapshot,
    () => null
  )

  const session = useMemo(
    () => parseAuthSession(rawSession),
    [rawSession]
  )

  return {
    session,
    isAuthenticated: session !== null,
    signOut,
  }
}
