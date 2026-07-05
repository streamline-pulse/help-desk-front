"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function DetailTriggerCell({
  children,
  label,
  onClick,
  className,
}: {
  children: ReactNode
  label?: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      className={cn(
        "w-full min-w-0 rounded-md text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      data-table-interactive="true"
      aria-label={label ? `Voir ${label}` : "Voir le détail"}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      {children}
    </button>
  )
}
