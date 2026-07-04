import { EmployeeDataTable } from "@/app/(board)/board/employees/_components/employee-data-table"
import { PageHeader } from "@/components/shared/page/page.header"
import { IconLock } from "@tabler/icons-react"

export function PageContent() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        label="Private Database"
        title="Employee Management System"
        description="Employee tracking across all departments, salaries, responsibilities, and termination"
        icon={IconLock}
      />
      <EmployeeDataTable />
    </div>
  )
}
