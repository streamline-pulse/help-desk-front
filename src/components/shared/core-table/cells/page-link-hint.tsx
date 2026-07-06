"use client"

import { IconArrowUpRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

export function TablePageLinkHint({ className }: { className?: string }) {
  return (
    <IconArrowUpRight
      className={cn(
        "size-3 shrink-0 text-muted-foreground/45 transition-colors group-hover/trigger:text-primary/70 group-focus-visible/trigger:text-primary/80",
        className
      )}
      stroke={2}
      aria-hidden="true"
    />
  )
}
