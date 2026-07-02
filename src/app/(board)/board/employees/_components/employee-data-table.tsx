import { format, parseISO } from "date-fns"
import {
  IconBriefcase,
  IconCalendar,
  IconHash,
  IconId,
  IconMail,
  IconSchool,
  IconSettings,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"

import { DepartmentLabel } from "@/app/(board)/board/employees/_components/department-label"
import { employees } from "@/app/(board)/board/employees/_components/employee-mock-data"
import { EmploymentStatusBadge } from "@/app/(board)/board/employees/_components/employment-status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function ColumnHeader({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; stroke?: number }>
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-3.5 text-neutral-400" stroke={1.75} />
      <span>{label}</span>
    </span>
  )
}

export function EmployeeDataTable() {
  return (
    <div className="px-6 pb-10">
      <div className="overflow-hidden rounded-lg border border-[#EDEDED]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#EDEDED] bg-neutral-50/80 hover:bg-neutral-50/80">
              <TableHead className="h-9 w-10 px-3">
                <span className="sr-only">Select</span>
              </TableHead>
              <TableHead className="h-9 px-3 text-[11px] font-medium text-neutral-500">
                <ColumnHeader icon={IconUsers} label="Employees" />
              </TableHead>
              <TableHead className="h-9 px-3 text-[11px] font-medium text-neutral-500">
                <ColumnHeader icon={IconId} label="Department" />
              </TableHead>
              <TableHead className="h-9 px-3 text-[11px] font-medium text-neutral-500">
                <ColumnHeader icon={IconMail} label="Email" />
              </TableHead>
              <TableHead className="h-9 px-3 text-[11px] font-medium text-neutral-500">
                <ColumnHeader icon={IconBriefcase} label="Employment" />
              </TableHead>
              <TableHead className="h-9 px-3 text-[11px] font-medium text-neutral-500">
                <ColumnHeader icon={IconHash} label="# Years" />
              </TableHead>
              <TableHead className="h-9 px-3 text-[11px] font-medium text-neutral-500">
                <ColumnHeader icon={IconUser} label="First Name" />
              </TableHead>
              <TableHead className="h-9 px-3 text-[11px] font-medium text-neutral-500">
                <ColumnHeader icon={IconUser} label="Last Name" />
              </TableHead>
              <TableHead className="h-9 px-3 text-[11px] font-medium text-neutral-500">
                <ColumnHeader icon={IconCalendar} label="Start Date" />
              </TableHead>
              <TableHead className="h-9 px-3 text-[11px] font-medium text-neutral-500">
                <ColumnHeader icon={IconSchool} label="Education" />
              </TableHead>
              <TableHead className="h-9 w-10 px-3">
                <IconSettings
                  className="size-3.5 text-neutral-400"
                  stroke={1.75}
                  aria-label="Settings"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow
                key={employee.id}
                className="border-[#EDEDED] hover:bg-neutral-50/60"
              >
                <TableCell className="px-3 py-2">
                  <span
                    className="inline-flex size-4 rounded-[4px] border border-neutral-300 bg-white"
                    aria-hidden
                  />
                </TableCell>
                <TableCell className="px-3 py-2 text-[13px] text-neutral-900">
                  {employee.id}
                </TableCell>
                <TableCell className="px-3 py-2">
                  <DepartmentLabel department={employee.department} />
                </TableCell>
                <TableCell className="max-w-[140px] truncate px-3 py-2 text-[13px] text-neutral-500">
                  {employee.email}
                </TableCell>
                <TableCell className="px-3 py-2">
                  <EmploymentStatusBadge status={employee.employment} />
                </TableCell>
                <TableCell className="px-3 py-2 text-[13px] text-neutral-900">
                  {employee.years}
                </TableCell>
                <TableCell className="px-3 py-2 text-[13px] text-neutral-900">
                  {employee.firstName}
                </TableCell>
                <TableCell className="px-3 py-2 text-[13px] text-neutral-900">
                  {employee.lastName}
                </TableCell>
                <TableCell className="px-3 py-2 text-[13px] text-neutral-900">
                  {format(parseISO(employee.startDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="px-3 py-2 text-[13px] text-neutral-900">
                  {employee.education}
                </TableCell>
                <TableCell className="px-3 py-2" />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
