import type { Department } from "@/app/(board)/board/employees/_components/employee-mock-data"
import { departmentColors } from "@/app/(board)/board/employees/_components/employee-mock-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type DepartmentLabelProps = {
  department: Department
  className?: string
}

export function DepartmentLabel({ department, className }: DepartmentLabelProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 gap-1.5 px-2",
        className
      )}
    >
      <span
        className={cn("size-1.5 shrink-0 rounded", departmentColors[department])}
        aria-hidden
      />
      {department}
    </Badge>
  )
}
