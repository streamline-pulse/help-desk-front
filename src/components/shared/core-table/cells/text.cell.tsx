"use client"

import { CellShell, CellTruncate, isEmptyValue, resolveTextValue } from "@/components/shared/core-table/cells/cell.utils"
import { cn } from "@/lib/utils"

type TextCellVariant = "default" | "primary" | "muted" | "mono"

const variantClassNames: Record<TextCellVariant, string> = {
  default: "text-foreground",
  primary: "font-medium text-foreground",
  muted: "text-muted-foreground",
  mono: "font-mono text-muted-foreground",
}

export function TextCell({
  value,
  variant = "default",
  fallback,
  className,
}: {
  value?: string | number | null
  variant?: TextCellVariant
  fallback?: string
  className?: string
}) {
  const displayValue = resolveTextValue(value, fallback)
  const isFallback = isEmptyValue(value) && fallback === undefined

  return (
    <CellShell title={isFallback ? undefined : displayValue}>
      <CellTruncate
        className={cn(
          "text-sm",
          variantClassNames[variant],
          isFallback && "text-muted-foreground",
          className
        )}
      >
        {displayValue}
      </CellTruncate>
    </CellShell>
  )
}
