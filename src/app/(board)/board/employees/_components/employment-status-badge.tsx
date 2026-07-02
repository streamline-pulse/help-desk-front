import { IconCheck, IconX } from "@tabler/icons-react"

import type { EmploymentStatus } from "@/app/(board)/board/employees/_components/employee-mock-data"
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
    <span
      className={cn(
        "inline-flex h-5 items-center gap-1 rounded-full px-2 text-[11px] font-medium",
        isActive
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-600",
        className
      )}
    >
      {isActive ? (
        <IconCheck className="size-3" stroke={2.5} />
      ) : (
        <IconX className="size-3" stroke={2.5} />
      )}
      {status}
    </span>
  )
}
