import { EmployeeDataTable } from "@/app/(board)/board/employees/_components/employee-data-table"
import { EmployeePageHeader } from "@/app/(board)/board/employees/_components/employee-page-header"
import { EmployeeTabsToolbar } from "@/app/(board)/board/employees/_components/employee-tabs-toolbar"

export function EmployeeManagementPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <EmployeePageHeader />
      <EmployeeTabsToolbar />
      <EmployeeDataTable />
    </div>
  )
}
