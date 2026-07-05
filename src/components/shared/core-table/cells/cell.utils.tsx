import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export const EMPTY_FALLBACK = "—"

export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === "string" && value.trim() === "") return true
  return false
}

export function resolveTextValue(
  value: unknown,
  fallback = EMPTY_FALLBACK
): string {
  if (isEmptyValue(value)) return fallback
  return String(value)
}

type CellShellProps = {
  children: ReactNode
  className?: string
  align?: "left" | "right"
  title?: string
}

export function CellShell({
  children,
  className,
  align = "left",
  title,
}: CellShellProps) {
  return (
    <div
      className={cn(
        "min-w-0 max-w-full",
        align === "right" && "text-right",
        className
      )}
      title={title}
    >
      {children}
    </div>
  )
}

type CellTruncateProps = {
  children: ReactNode
  className?: string
  title?: string
}

export function CellTruncate({ children, className, title }: CellTruncateProps) {
  return (
    <span className={cn("block truncate", className)} title={title}>
      {children}
    </span>
  )
}
