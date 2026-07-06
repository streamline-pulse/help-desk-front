import {
  isNavigationLinkItem,
  navigationItems,
} from "@/config/navigation-items"
import type { OnboardingStepDefinition } from "@/config/onboarding-steps"
import { routes } from "@/config/routes"
import type { UserOnboardingProgress } from "@/stores/onboarding.store"
import type { AuthUser } from "@/types/api/user.type"
import { hasPermission } from "@/utils/permissions"

export function matchesOnboardingRoute(pathname: string, route: string) {
  if (route === routes.board.root) {
    return pathname === route || pathname.startsWith(`${route}/`)
  }

  return pathname === route || pathname.startsWith(`${route}/`)
}

export function isOnboardingStepVisible(
  step: OnboardingStepDefinition,
  user: AuthUser
) {
  if (step.moduleCode) {
    const navigationItem = navigationItems.reduce<
      (typeof navigationItems)[number] | undefined
    >((currentItem, item) => {
      if (!isNavigationLinkItem(item)) {
        return currentItem
      }

      if (item.moduleCode !== step.moduleCode) {
        return currentItem
      }

      return item
    }, undefined)

    if (
      navigationItem &&
      isNavigationLinkItem(navigationItem) &&
      !navigationItem.isReady
    ) {
      return false
    }
  }

  if (!step.requires) {
    return true
  }

  return hasPermission(
    user,
    step.requires.moduleName,
    step.requires.permission
  )
}

export function getVisibleOnboardingSteps(
  steps: readonly OnboardingStepDefinition[],
  user: AuthUser
) {
  return steps.filter((step) => isOnboardingStepVisible(step, user))
}

export function getOnboardingProgressStats(
  steps: readonly { id: string }[],
  progress: UserOnboardingProgress
) {
  const completedCount = steps.filter((step) =>
    progress.completedStepIds.includes(step.id)
  ).length
  const dismissedCount = steps.filter((step) =>
    progress.dismissedStepIds.includes(step.id)
  ).length
  const doneCount = completedCount + dismissedCount
  const progressValue =
    steps.length === 0 ? 0 : Math.round((doneCount / steps.length) * 100)

  return {
    completedCount,
    dismissedCount,
    doneCount,
    progressValue,
    totalCount: steps.length,
  }
}

export function isOnboardingStepDone(
  stepId: string,
  progress: UserOnboardingProgress
) {
  return (
    progress.completedStepIds.includes(stepId) ||
    progress.dismissedStepIds.includes(stepId)
  )
}

export function getPendingOnboardingSteps(
  steps: readonly OnboardingStepDefinition[],
  progress: UserOnboardingProgress
) {
  return steps.filter((step) => !isOnboardingStepDone(step.id, progress))
}

export function shouldCompleteNavigationStep(pathname: string) {
  return (
    pathname !== routes.board.root &&
    pathname.startsWith(`${routes.board.root}/`)
  )
}

export function findOnboardingTarget(target: string) {
  if (typeof document === "undefined") {
    return null
  }

  const elements = document.querySelectorAll<HTMLElement>(
    `[data-onboarding="${target}"]`
  )

  for (const element of elements) {
    const style = window.getComputedStyle(element)
    if (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      element.getClientRects().length > 0
    ) {
      return element
    }
  }

  return elements[0] ?? null
}

export function resolveActiveOnboardingStep({
  steps,
  progress,
  pathname,
  preferStepId,
}: {
  steps: readonly OnboardingStepDefinition[]
  progress: UserOnboardingProgress
  pathname: string
  preferStepId?: string | null
}) {
  const pending = getPendingOnboardingSteps(steps, progress)
  if (pending.length === 0) {
    return null
  }

  if (preferStepId) {
    const focused = pending.find((step) => step.id === preferStepId)
    if (
      focused &&
      matchesOnboardingRoute(pathname, focused.route) &&
      findOnboardingTarget(focused.target)
    ) {
      return focused
    }
  }

  for (const step of pending) {
    if (!matchesOnboardingRoute(pathname, step.route)) {
      continue
    }

    if (!findOnboardingTarget(step.target)) {
      continue
    }

    return step
  }

  return null
}
