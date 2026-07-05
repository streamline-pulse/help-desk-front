"use client"

import type { ReactNode } from "react"

import { TableClickableHint } from "@/components/shared/core-table/cells/clickable-hint"
import { cn } from "@/lib/utils"

export function DetailTriggerCell({
  children,
  label,
  onClick,
  showHint = true,
  className,
}: {
  children: ReactNode
  label?: string
  onClick: () => void
  showHint?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      className={cn(
        "group/trigger flex w-full min-w-0 items-center gap-1 rounded-md text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      data-table-interactive="true"
      aria-label={label ? `Voir ${label}` : "Voir le détail"}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {showHint ? <TableClickableHint /> : null}
    </button>
  )
}
