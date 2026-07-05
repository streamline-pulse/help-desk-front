"use client"

import type { ComponentProps, ReactElement } from "react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const ICON_BUTTON_TOOLTIP_DELAY = 750

type IconButtonTooltipProps = {
  label: string
  side?: ComponentProps<typeof TooltipContent>["side"]
  delay?: number
  children: ReactElement
}

export function IconButtonTooltip({
  label,
  side = "top",
  delay = ICON_BUTTON_TOOLTIP_DELAY,
  children,
}: IconButtonTooltipProps) {
  return (
    <TooltipProvider delay={delay}>
      <Tooltip>
        <TooltipTrigger render={children} />
        <TooltipContent side={side}>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

type IconButtonProps = ComponentProps<typeof Button> & {
  tooltip: string
  tooltipSide?: ComponentProps<typeof TooltipContent>["side"]
  tooltipDelay?: number
}

export function IconButton({
  tooltip,
  tooltipSide = "top",
  tooltipDelay,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <IconButtonTooltip
      label={tooltip}
      side={tooltipSide}
      delay={tooltipDelay}
    >
      <Button
        className={className}
        aria-label={props["aria-label"] ?? tooltip}
        {...props}
      >
        {children}
      </Button>
    </IconButtonTooltip>
  )
}

type IconButtonSize = "sm" | "md"

export function getIconButtonSizeProps(size: IconButtonSize = "sm") {
  if (size === "md") {
    return { size: "icon" as const }
  }
  return { size: "icon-sm" as const }
}
