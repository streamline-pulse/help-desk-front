"use client"

import { useLayoutEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"

import type { OnboardingStepDefinition } from "@/config/onboarding-steps"
import { onboardingPreviews } from "@/components/shared/onboarding/onboarding-previews"
import { Button } from "@/components/ui/button"
import { findOnboardingTarget } from "@/utils/onboarding"
import { cn } from "@/lib/utils"

type AnchorRect = {
  top: number
  left: number
  width: number
  height: number
  bottom: number
  right: number
}

type Placement = "top" | "bottom" | "left" | "right"

type SpotlightLayout = {
  placement: Placement
  top: number
  left: number
  transform?: string
  arrowOffset: number
}

type OnboardingSpotlightProps = {
  step: OnboardingStepDefinition
  onDismiss: () => void
}

const CARD_WIDTH = 288
const CARD_HEIGHT_ESTIMATE = 248
const GAP = 10
const VIEWPORT_PADDING = 12
const MAX_POLL_ATTEMPTS = 20

const tooltipSurfaceClass =
  "border-transparent bg-foreground text-background dark:border-zinc-200 dark:bg-zinc-50 dark:text-zinc-900"

const tooltipDescriptionClass =
  "text-background/75 dark:text-zinc-600"

const tooltipButtonClass =
  "bg-background/15 text-background hover:bg-background/25 dark:bg-zinc-900/8 dark:text-zinc-900 dark:hover:bg-zinc-900/12"

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function readAnchorRect(target: string) {
  const element = findOnboardingTarget(target)
  if (!element) {
    return null
  }

  const bounds = element.getBoundingClientRect()
  if (bounds.width === 0 && bounds.height === 0) {
    return null
  }

  return {
    top: bounds.top,
    left: bounds.left,
    width: bounds.width,
    height: bounds.height,
    bottom: bounds.bottom,
    right: bounds.right,
  }
}

function useAnchorRect(target: string) {
  const pathname = usePathname()
  const [rect, setRect] = useState<AnchorRect | null>(null)

  useLayoutEffect(() => {
    let cancelled = false
    let frameId = 0
    let attempts = 0

    function updateRect() {
      const nextRect = readAnchorRect(target)
      if (nextRect) {
        setRect(nextRect)
        return true
      }
      return false
    }

    function pollForTarget() {
      if (cancelled) {
        return
      }

      if (updateRect()) {
        return
      }

      attempts += 1
      if (attempts < MAX_POLL_ATTEMPTS) {
        frameId = window.requestAnimationFrame(pollForTarget)
      }
    }

    if (!updateRect()) {
      frameId = window.requestAnimationFrame(pollForTarget)
    }

    function onLayoutChange() {
      if (!cancelled) {
        updateRect()
      }
    }

    window.addEventListener("resize", onLayoutChange)
    window.addEventListener("scroll", onLayoutChange, true)

    const observer = new MutationObserver(onLayoutChange)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("resize", onLayoutChange)
      window.removeEventListener("scroll", onLayoutChange, true)
      observer.disconnect()
    }
  }, [pathname, target])

  return rect
}

function useDialogOpen() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useLayoutEffect(() => {
    function updateDialogState() {
      setIsDialogOpen(
        Boolean(
          document.querySelector(
            '[data-slot="dialog-overlay"][data-open], [data-slot="alert-dialog-overlay"][data-open]'
          )
        )
      )
    }

    updateDialogState()
    const observer = new MutationObserver(updateDialogState)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-open", "open", "role"],
    })

    return () => observer.disconnect()
  }, [])

  return isDialogOpen
}

function computeLayout(
  rect: AnchorRect,
  preferred?: OnboardingStepDefinition["side"]
): SpotlightLayout {
  const targetCenterX = rect.left + rect.width / 2
  const targetCenterY = rect.top + rect.height / 2
  let placement: Placement = preferred ?? "bottom"

  if (placement === "bottom") {
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    if (spaceBelow < CARD_HEIGHT_ESTIMATE + GAP && spaceAbove > spaceBelow) {
      placement = "top"
    }
  }

  if (placement === "bottom") {
    const left = clamp(
      targetCenterX - CARD_WIDTH / 2,
      VIEWPORT_PADDING,
      window.innerWidth - CARD_WIDTH - VIEWPORT_PADDING
    )
    const top = rect.bottom + GAP
    const arrowOffset = clamp(targetCenterX - left, 24, CARD_WIDTH - 24)

    return { placement, top, left, arrowOffset }
  }

  if (placement === "top") {
    const left = clamp(
      targetCenterX - CARD_WIDTH / 2,
      VIEWPORT_PADDING,
      window.innerWidth - CARD_WIDTH - VIEWPORT_PADDING
    )
    const top = rect.top - GAP
    const arrowOffset = clamp(targetCenterX - left, 24, CARD_WIDTH - 24)

    return {
      placement,
      top,
      left,
      arrowOffset,
      transform: "translateY(-100%)",
    }
  }

  if (placement === "right") {
    const left = rect.right + GAP
    const top = clamp(
      targetCenterY - CARD_HEIGHT_ESTIMATE / 2,
      VIEWPORT_PADDING,
      window.innerHeight - CARD_HEIGHT_ESTIMATE - VIEWPORT_PADDING
    )
    const arrowOffset = clamp(
      targetCenterY - top,
      32,
      CARD_HEIGHT_ESTIMATE - 32
    )

    return { placement, top, left, arrowOffset }
  }

  const left = rect.left - GAP
  const top = clamp(
    targetCenterY - CARD_HEIGHT_ESTIMATE / 2,
    VIEWPORT_PADDING,
    window.innerHeight - CARD_HEIGHT_ESTIMATE - VIEWPORT_PADDING
  )
  const arrowOffset = clamp(
    targetCenterY - top,
    32,
    CARD_HEIGHT_ESTIMATE - 32
  )

  return {
    placement: "left",
    top,
    left,
    arrowOffset,
    transform: "translateX(-100%)",
  }
}

function SpotlightArrow({
  placement,
  offset,
}: {
  placement: Placement
  offset: number
}) {
  if (placement === "bottom") {
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-[7px] size-0 border-[7px] border-transparent border-b-foreground dark:border-b-zinc-50"
        style={{ left: offset, transform: "translateX(-50%)" }}
      />
    )
  }

  if (placement === "top") {
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[7px] size-0 border-[7px] border-transparent border-t-foreground dark:border-t-zinc-50"
        style={{ left: offset, transform: "translateX(-50%)" }}
      />
    )
  }

  if (placement === "right") {
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-[7px] size-0 border-[7px] border-transparent border-r-foreground dark:border-r-zinc-50"
        style={{ top: offset, transform: "translateY(-50%)" }}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-[7px] size-0 border-[7px] border-transparent border-l-foreground dark:border-l-zinc-50"
      style={{ top: offset, transform: "translateY(-50%)" }}
    />
  )
}

const placementMotion: Record<Placement, string> = {
  bottom:
    "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:slide-in-from-top-1 motion-safe:duration-150",
  top: "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:slide-in-from-bottom-1 motion-safe:duration-150",
  right:
    "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:slide-in-from-left-1 motion-safe:duration-150",
  left: "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:slide-in-from-right-1 motion-safe:duration-150",
}

export function OnboardingSpotlight({
  step,
  onDismiss,
}: OnboardingSpotlightProps) {
  const isDialogOpen = useDialogOpen()
  const rect = useAnchorRect(step.target)
  const Preview = onboardingPreviews[step.previewId]

  if (isDialogOpen || !rect || typeof document === "undefined") {
    return null
  }

  const layout = computeLayout(rect, step.side)

  return createPortal(
    <div
      role="dialog"
      aria-labelledby={`onboarding-title-${step.id}`}
      aria-describedby={`onboarding-description-${step.id}`}
      className={cn(
        "fixed z-[80] w-72 rounded-xl border p-3.5 shadow-xl",
        tooltipSurfaceClass,
        placementMotion[layout.placement]
      )}
      style={{
        top: layout.top,
        left: layout.left,
        transform: layout.transform,
      }}
    >
      <SpotlightArrow placement={layout.placement} offset={layout.arrowOffset} />

      <div className="space-y-3">
        <div className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-150 motion-safe:delay-75">
          <Preview />
        </div>

        <div className="space-y-1 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 motion-safe:duration-150 motion-safe:delay-100">
          <h3
            id={`onboarding-title-${step.id}`}
            className="text-sm font-semibold text-balance"
          >
            {step.title}
          </h3>
          <p
            id={`onboarding-description-${step.id}`}
            className={cn(
              "text-xs leading-relaxed text-pretty",
              tooltipDescriptionClass
            )}
          >
            {step.description}
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className={cn(
            "w-full transition-colors motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-150 motion-safe:delay-150",
            tooltipButtonClass
          )}
          onClick={onDismiss}
        >
          {"J'ai compris"}
        </Button>
      </div>
    </div>,
    document.body
  )
}
