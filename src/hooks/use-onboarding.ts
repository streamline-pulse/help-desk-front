"use client"

import { useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"

import {
  onboardingSteps,
  onboardingStepIds,
} from "@/config/onboarding-steps"
import { useCurrentUserQuery } from "@/hooks/queries/use-auth.query"
import {
  subscribeOnboardingEvents,
  type OnboardingEvent,
} from "@/lib/onboarding-events"
import {
  EMPTY_ONBOARDING_PROGRESS,
  useOnboardingStore,
} from "@/stores/onboarding.store"
import {
  getPendingOnboardingSteps,
  getVisibleOnboardingSteps,
  resolveActiveOnboardingStep,
  shouldCompleteNavigationStep,
} from "@/utils/onboarding"

export function useOnboarding() {
  const pathname = usePathname()
  const { data: user } = useCurrentUserQuery()
  const userId = user?.id
  const hasHydrated = useOnboardingStore((state) => state.hasHydrated)
  const progressByUserId = useOnboardingStore((state) => state.progressByUserId)
  const completeStep = useOnboardingStore((state) => state.completeStep)
  const dismissStep = useOnboardingStore((state) => state.dismissStep)
  const dismissFlow = useOnboardingStore((state) => state.dismissFlow)
  const focusStep = useOnboardingStore((state) => state.focusStep)

  const progress = useMemo(() => {
    if (!userId) {
      return null
    }

    return progressByUserId[userId] ?? EMPTY_ONBOARDING_PROGRESS
  }, [progressByUserId, userId])

  const visibleSteps = useMemo(
    () => (user ? getVisibleOnboardingSteps(onboardingSteps, user) : []),
    [user]
  )

  const pendingSteps = useMemo(
    () => (progress ? getPendingOnboardingSteps(visibleSteps, progress) : []),
    [progress, visibleSteps]
  )

  const activeStep = useMemo(() => {
    if (!progress || progress.flowDismissed || pendingSteps.length === 0) {
      return null
    }

    return resolveActiveOnboardingStep({
      steps: visibleSteps,
      progress,
      pathname,
      preferStepId: progress.focusedStepId,
    })
  }, [pathname, pendingSteps.length, progress, visibleSteps])

  useEffect(() => {
    if (!userId || !progress) {
      return
    }

    if (
      shouldCompleteNavigationStep(pathname) &&
      !progress.completedStepIds.includes(onboardingStepIds.exploreNavigation) &&
      !progress.dismissedStepIds.includes(onboardingStepIds.exploreNavigation)
    ) {
      completeStep(userId, onboardingStepIds.exploreNavigation)
    }
  }, [completeStep, pathname, progress, userId])

  useEffect(() => {
    if (!userId) {
      return
    }

    return subscribeOnboardingEvents((event: OnboardingEvent) => {
      for (const step of onboardingSteps) {
        if (step.completeOn === "action" && step.actionEvent === event) {
          completeStep(userId, step.id)
        }
      }
    })
  }, [completeStep, userId])

  const isEnabled =
    Boolean(userId && user && progress && hasHydrated) &&
    !progress?.flowDismissed &&
    pendingSteps.length > 0

  return {
    userId,
    user,
    progress,
    visibleSteps,
    pendingSteps,
    activeStep,
    isEnabled,
    hasHydrated,
    completeStep,
    dismissStep,
    dismissFlow,
    focusStep,
  }
}
