"use client"

import type { ComponentType } from "react"
import {
  IconCheck,
  IconClock,
  IconCircleCheck,
  IconX,
} from "@tabler/icons-react"

import { CellShell } from "@/components/shared/core-table/cells/cell.utils"
import { cn } from "@/lib/utils"

export type BooleanCellTone = "success" | "danger" | "warning" | "neutral"

export type BooleanCellPreset = "active" | "verified"

type StatusPillProps = {
  label: string
  tone: BooleanCellTone
  icon: ComponentType<{ className?: string; stroke?: number }>
  className?: string
}

const toneClassNames: Record<BooleanCellTone, string> = {
  success: "bg-green-500/20 text-green-700 dark:bg-green-950/50 dark:text-green-400",
  danger: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
  warning:
    "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  neutral: "bg-muted text-muted-foreground",
}

const presetConfig: Record<
  BooleanCellPreset,
  {
    true: { tone: BooleanCellTone; icon: StatusPillProps["icon"] }
    false: { tone: BooleanCellTone; icon: StatusPillProps["icon"] }
  }
> = {
  active: {
    true: { tone: "success", icon: IconCheck },
    false: { tone: "danger", icon: IconX },
  },
  verified: {
    true: { tone: "success", icon: IconCircleCheck },
    false: { tone: "warning", icon: IconClock },
  },
}

export function StatusPill({ label, tone, icon: Icon, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex h-5 max-w-full items-center gap-1 rounded-full px-2 text-[11px] font-medium",
        toneClassNames[tone],
        className
      )}
      title={label}
    >
      <Icon className="size-3 shrink-0" stroke={2.5} aria-hidden="true" />
      <span className="truncate">{label}</span>
    </span>
  )
}

export function BooleanCell({
  value,
  preset = "active",
  trueLabel,
  falseLabel,
  trueTone,
  falseTone,
  trueIcon,
  falseIcon,
  className,
}: {
  value?: boolean | null
  preset?: BooleanCellPreset
  trueLabel?: string
  falseLabel?: string
  trueTone?: BooleanCellTone
  falseTone?: BooleanCellTone
  trueIcon?: StatusPillProps["icon"]
  falseIcon?: StatusPillProps["icon"]
  className?: string
}) {
  const isTrue = Boolean(value)
  const config = presetConfig[preset]
  const state = isTrue ? config.true : config.false

  const defaultLabels: Record<BooleanCellPreset, { true: string; false: string }> =
    {
      active: { true: "Actif", false: "Inactif" },
      verified: { true: "E-mail vérifié", false: "En attente" },
    }

  const label = isTrue
    ? (trueLabel ?? defaultLabels[preset].true)
    : (falseLabel ?? defaultLabels[preset].false)

  return (
    <CellShell className={className}>
      <StatusPill
        label={label}
        tone={isTrue ? (trueTone ?? state.tone) : (falseTone ?? state.tone)}
        icon={isTrue ? (trueIcon ?? state.icon) : (falseIcon ?? state.icon)}
      />
    </CellShell>
  )
}
