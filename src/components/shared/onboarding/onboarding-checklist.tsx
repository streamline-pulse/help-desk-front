"use client"

import { useRouter } from "next/navigation"

import type { OnboardingStepDefinition } from "@/config/onboarding-steps"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  getOnboardingProgressStats,
  isOnboardingStepDone,
} from "@/utils/onboarding"
import type { UserOnboardingProgress } from "@/stores/onboarding.store"
import {
  IconChevronDown,
  IconCircle,
  IconCircleCheck,
  IconCircleMinus,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

type OnboardingChecklistProps = {
  steps: readonly OnboardingStepDefinition[]
  progress: UserOnboardingProgress
  activeStepId: string | null
  onFocusStep: (stepId: string) => void
  onDismissFlow: () => void
}

export function OnboardingChecklist({
  steps,
  progress,
  activeStepId,
  onFocusStep,
  onDismissFlow,
}: OnboardingChecklistProps) {
  const router = useRouter()
  const { completedCount, doneCount, progressValue, totalCount } =
    getOnboardingProgressStats(steps, progress)
  const nextStep = steps.find((step) => !isOnboardingStepDone(step.id, progress))

  function handleStepClick(step: OnboardingStepDefinition) {
    if (isOnboardingStepDone(step.id, progress)) {
      return
    }

    onFocusStep(step.id)
    if (step.route) {
      router.push(step.route)
    }
  }

  return (
    <Collapsible
      defaultOpen
      className="fixed right-4 bottom-4 z-[80] w-80 overflow-hidden rounded-xl border bg-card shadow-lg motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500"
    >
      <div className="flex items-start justify-between gap-2 border-b px-4 py-3">
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-semibold">Premiers pas</p>
          <p className="text-xs text-pretty text-muted-foreground">
            {nextStep?.checklistHint ?? "Toutes les étapes sont terminées."}
          </p>
        </div>
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 shrink-0 text-muted-foreground"
              aria-label="Replier la checklist"
            />
          }
        >
          <IconChevronDown className="transition-transform in-data-open:rotate-180" />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="px-4 py-3 motion-safe:transition-all motion-safe:duration-300">
        <ul className="space-y-1">
          {steps.map((step) => {
            const isCompleted = progress.completedStepIds.includes(step.id)
            const isDismissed = progress.dismissedStepIds.includes(step.id)
            const isDone = isCompleted || isDismissed
            const isActive = activeStepId === step.id

            return (
              <li key={step.id}>
                <button
                  type="button"
                  disabled={isDone}
                  onClick={() => handleStepClick(step)}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    isCompleted && "cursor-default text-muted-foreground",
                    isDismissed && "cursor-default text-muted-foreground/70",
                    !isDone && "hover:bg-muted/60",
                    isActive && !isDone && "bg-muted/50"
                  )}
                >
                  {isCompleted ? (
                    <IconCircleCheck
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                  ) : isDismissed ? (
                    <IconCircleMinus
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground/60"
                      aria-hidden="true"
                    />
                  ) : (
                    <IconCircle
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={cn(
                      "min-w-0 text-pretty",
                      isCompleted && "text-muted-foreground",
                      isDismissed && "text-muted-foreground/70 line-through"
                    )}
                  >
                    {step.title}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-primary tabular-nums">
                {doneCount} sur {totalCount} traitées
                {completedCount > 0 ? ` · ${completedCount} complétée${completedCount > 1 ? "s" : ""}` : ""}
              </p>
              <span className="text-xs text-muted-foreground tabular-nums">
                {progressValue}%
              </span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={progressValue}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progression de l’onboarding"
            >
              <div
                className="h-full min-w-0 rounded-full bg-primary transition-[width] duration-500 ease-out"
                style={{ width: `${Math.max(progressValue, doneCount > 0 ? 4 : 0)}%` }}
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onDismissFlow}
          >
            Masquer le guide
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
