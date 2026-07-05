"use client"

import { IconCheck, IconX } from "@tabler/icons-react"

import type { EmploymentStatus } from "@/app/(board)/board/employees/_components/employee-mock-data"
import { StatusPill } from "@/components/shared/core-table/cells/boolean.cell"
import { cn } from "@/lib/utils"

type EmploymentStatusBadgeProps = {
  status: EmploymentStatus
  className?: string
}

export function EmploymentStatusBadge({
  status,
  className,
}: EmploymentStatusBadgeProps) {
  const isActive = status === "Active"

  return (
    <StatusPill
      label={status}
      tone={isActive ? "success" : "danger"}
      icon={isActive ? IconCheck : IconX}
      className={cn(className)}
    />
  )
}
