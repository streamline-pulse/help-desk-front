"use client"

import type { VariantProps } from "class-variance-authority"

import { CellShell, CellTruncate, isEmptyValue } from "@/components/shared/core-table/cells/cell.utils"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

export function BadgeCell({
  value,
  variant = "outline",
  fallback = "—",
  className,
}: {
  value?: string | number | null
  variant?: BadgeVariant
  fallback?: string
  className?: string
}) {
  if (isEmptyValue(value)) {
    return (
      <CellShell>
        <CellTruncate className="text-sm text-muted-foreground">{fallback}</CellTruncate>
      </CellShell>
    )
  }

  const displayValue = String(value)

  return (
    <CellShell title={displayValue}>
      <Badge
        variant={variant}
        className={cn("max-w-full truncate", className)}
        title={displayValue}
      >
        <CellTruncate>{displayValue}</CellTruncate>
      </Badge>
    </CellShell>
  )
}
