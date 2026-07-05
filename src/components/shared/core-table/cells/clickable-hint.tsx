"use client"

import { IconChevronRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

export function TableClickableHint({ className }: { className?: string }) {
  return (
    <IconChevronRight
      className={cn(
        "size-3 shrink-0 text-muted-foreground/35 transition-colors group-hover/trigger:text-muted-foreground group-focus-visible/trigger:text-muted-foreground/75",
        className
      )}
      stroke={2}
      aria-hidden="true"
    />
  )
}
