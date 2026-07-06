"use client"

import type { ReactNode } from "react"

import { TablePageLinkHint } from "@/components/shared/core-table/cells/page-link-hint"
import { cn } from "@/lib/utils"

export function PageLinkTriggerCell({
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
      aria-label={label ? `Ouvrir ${label}` : "Ouvrir la page"}
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
    >
      <span className="page-link-text min-w-0 flex-1 underline-offset-2 group-hover/trigger:underline group-focus-visible/trigger:underline">
        {children}
      </span>
      {showHint ? <TablePageLinkHint /> : null}
    </button>
  )
}
