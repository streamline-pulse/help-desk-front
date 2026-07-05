"use client"

import type { ComponentType, ReactNode } from "react"

import { cn } from "@/lib/utils"

type TableColumnHeaderProps = {
  icon?: ComponentType<{ className?: string; stroke?: number }>
  children: ReactNode
  className?: string
}

export function TableColumnHeader({
  icon: Icon,
  children,
  className,
}: TableColumnHeaderProps) {
  return (
    <span
      className={cn("inline-flex min-w-0 items-center gap-1.5 text-sm", className)}
    >
      {Icon ? (
        <Icon
          className="size-3.5 shrink-0 text-muted-foreground"
          stroke={1.75}
          aria-hidden="true"
        />
      ) : null}
      <span className="truncate font-medium text-foreground">{children}</span>
    </span>
  )
}
