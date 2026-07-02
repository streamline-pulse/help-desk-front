import type { Department } from "@/app/(board)/board/employees/_components/employee-mock-data"
import { departmentColors } from "@/app/(board)/board/employees/_components/employee-mock-data"
import { cn } from "@/lib/utils"

type DepartmentLabelProps = {
  department: Department
  className?: string
}

export function DepartmentLabel({ department, className }: DepartmentLabelProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn("size-2 shrink-0 rounded-full", departmentColors[department])}
        aria-hidden
      />
      <span className="text-[13px] text-foreground">{department}</span>
    </span>
  )
}
