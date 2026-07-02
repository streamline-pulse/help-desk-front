"use client"

import { useMemo, useSyncExternalStore } from "react"

import {
  getAuthSessionSnapshot,
  parseAuthSession,
  signOut,
  subscribeToAuthSession,
} from "@/lib/auth-session"

function subscribeNoop() {
  return () => {}
}

function getIsClientSnapshot() {
  return true
}

function getIsServerSnapshot() {
  return false
}

export function useAuth() {
  const isHydrated = useSyncExternalStore(
    subscribeNoop,
    getIsClientSnapshot,
    getIsServerSnapshot
  )

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
    isHydrated,
    signOut,
  }
}
