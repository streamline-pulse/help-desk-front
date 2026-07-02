import { IconLock } from "@tabler/icons-react"

export function EmployeePageHeader() {
  return (
    <div className="px-6 pt-10 pb-2">
      <div className="mb-3 flex items-center gap-1.5 text-[13px] text-neutral-400">
        <IconLock className="size-3.5" stroke={1.75} />
        <span>Private Database</span>
      </div>
      <h1 className="text-[28px] leading-tight font-semibold tracking-tight text-neutral-900">
        Employee Management System
      </h1>
      <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-neutral-500">
        Employee tracking across all departments, salaries, responsibilities, and
        termination
      </p>
    </div>
  )
}
