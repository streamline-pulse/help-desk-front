"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { OnboardingChecklist } from "@/components/shared/onboarding/onboarding-checklist"
import { OnboardingSpotlight } from "@/components/shared/onboarding/onboarding-spotlight"
import { useOnboarding } from "@/hooks/use-onboarding"

type OnboardingProviderProps = {
  children: ReactNode
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const pathname = usePathname()
  const {
    userId,
    progress,
    visibleSteps,
    activeStep,
    isEnabled,
    hasHydrated,
    dismissStep,
    dismissFlow,
    focusStep,
  } = useOnboarding()

  return (
    <>
      {children}
      {hasHydrated && isEnabled && userId && progress ? (
        <>
          <OnboardingChecklist
            steps={visibleSteps}
            progress={progress}
            activeStepId={activeStep?.id ?? null}
            onFocusStep={(stepId) => focusStep(userId, stepId)}
            onDismissFlow={() => dismissFlow(userId)}
          />
          {activeStep ? (
            <OnboardingSpotlight
              key={`${activeStep.id}-${pathname}`}
              step={activeStep}
              onDismiss={() => dismissStep(userId, activeStep.id)}
            />
          ) : null}
        </>
      ) : null}
    </>
  )
}
