"use client"

import type { ReactNode } from "react"

import { OnboardingProvider } from "@/components/shared/onboarding/onboarding-provider"

type BoardLayoutShellProps = {
  children: ReactNode
}

export function BoardLayoutShell({ children }: BoardLayoutShellProps) {
  return <OnboardingProvider>{children}</OnboardingProvider>
}
