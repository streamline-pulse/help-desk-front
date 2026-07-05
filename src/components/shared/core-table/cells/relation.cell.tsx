"use client"

import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { isEmptyValue } from "@/components/shared/core-table/cells/cell.utils"

export function RelationCell({
  value,
  fallback = "—",
  variant = "default",
}: {
  value?: string | null
  fallback?: string
  variant?: "default" | "primary"
}) {
  if (isEmptyValue(value)) {
    return <TextCell value={null} fallback={fallback} variant="muted" />
  }

  return <TextCell value={value} variant={variant} />
}
