"use client"

import type { ReactNode } from "react"

import { BadgeCell } from "@/components/shared/core-table/cells/badge.cell"
import { CellShell, CellTruncate, isEmptyValue } from "@/components/shared/core-table/cells/cell.utils"
import { TextCell } from "@/components/shared/core-table/cells/text.cell"
import { cn } from "@/lib/utils"

function formatPhone(indicatif?: string | null, phone?: string | null): string | null {
  const normalizedIndicatif = indicatif?.trim() ?? ""
  const normalizedPhone = phone?.trim() ?? ""

  if (!normalizedIndicatif && !normalizedPhone) return null
  if (!normalizedPhone) return normalizedIndicatif
  if (!normalizedIndicatif) return normalizedPhone

  const spacedPhone = normalizedPhone.replace(/(\d{2})(?=\d)/g, "$1 ").trim()
  return `${normalizedIndicatif} ${spacedPhone}`.trim()
}

type CustomCellProps =
  | {
      variant: "phone"
      indicatif?: string | null
      phone?: string | null
      fallback?: string
      className?: string
    }
  | {
      variant: "code"
      value?: string | null
      fallback?: string
      className?: string
    }
  | {
      variant?: "custom"
      children?: ReactNode
      fallback?: string
      className?: string
    }

export function CustomCell(props: CustomCellProps) {
  if (props.variant === "phone") {
    const formatted = formatPhone(props.indicatif, props.phone)

    return (
      <TextCell
        value={formatted}
        variant="default"
        fallback={props.fallback}
        className={cn("tabular-nums", props.className)}
      />
    )
  }

  if (props.variant === "code") {
    return (
      <BadgeCell
        value={props.value}
        variant="outline"
        fallback={props.fallback}
        className={props.className}
      />
    )
  }

  if (isEmptyValue(props.children)) {
    return (
      <CellShell>
        <CellTruncate className="text-sm text-muted-foreground">
          {props.fallback ?? "—"}
        </CellTruncate>
      </CellShell>
    )
  }

  return (
    <CellShell className={props.className}>
      <CellTruncate className="text-sm text-foreground">{props.children}</CellTruncate>
    </CellShell>
  )
}
