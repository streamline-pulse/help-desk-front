"use client"

import type { ComponentType } from "react"
import {
  IconBriefcase,
  IconBuilding,
  IconCalendarEvent,
  IconCertificate,
  IconClock,
  IconDownload,
  IconMail,
  IconPlus,
  IconUser,
} from "@tabler/icons-react"

import { DepartmentLabel } from "@/app/(board)/board/employees/_components/department-label"
import {
  employees,
  type Department,
  type Employee,
  type EmploymentStatus,
} from "@/app/(board)/board/employees/_components/employee-mock-data"
import { EmploymentStatusBadge } from "@/app/(board)/board/employees/_components/employment-status-badge"
import { departments } from "@/app/(board)/board/employees/_components/table.constants"
import { DateCell } from "@/components/shared/core-table/cells/date.cell"
import { DataTable } from "@/components/shared/core-table/core.table"
import type {
  DataTableColumn,
  DataTableFilter,
} from "@/components/shared/core-table/table.types"
import { Button } from "@/components/ui/button"

type EmployeeFilters = {
  department?: Department
  employment?: EmploymentStatus
}

function ColumnLabel({
  icon: Icon,
  children,
}: {
  icon?: ComponentType<{ className?: string; stroke?: number }>
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-sm">
      {Icon ? (
        <Icon
          className="size-3.5 shrink-0 text-foreground"
          stroke={1.75}
          aria-hidden="true"
        />
      ) : null}
      <span className="truncate font-medium text-foreground">{children}</span>
    </span>
  )
}

const columns: DataTableColumn<Employee>[] = [
  {
    accessorKey: "id",
    label: "Matricule",
    header: () => <ColumnLabel>Matricule</ColumnLabel>,
    sortable: true,
  },
  {
    accessorKey: "department",
    label: "Département",
    header: () => <ColumnLabel icon={IconBuilding}>Département</ColumnLabel>,
    cell: ({ row }) => <DepartmentLabel department={row.original.department} />,
    sortable: true,
  },
  {
    accessorKey: "email",
    label: "E-mail",
    header: () => <ColumnLabel icon={IconMail}>E-mail</ColumnLabel>,
    sortable: true,
  },
  {
    accessorKey: "employment",
    label: "Statut",
    header: () => <ColumnLabel icon={IconBriefcase}>Statut</ColumnLabel>,
    cell: ({ row }) => <EmploymentStatusBadge status={row.original.employment} />,
    sortable: true,
  },
  {
    accessorKey: "years",
    label: "Ancienneté",
    header: () => <ColumnLabel icon={IconClock}>Ancienneté</ColumnLabel>,
    cell: ({ row }) => <span className="tabular-nums">{row.original.years} ans</span>,
    sortable: true,
  },
  {
    accessorKey: "firstName",
    label: "Prénom",
    header: () => <ColumnLabel icon={IconUser}>Prénom</ColumnLabel>,
    sortable: true,
  },
  {
    accessorKey: "lastName",
    label: "Nom",
    header: () => <ColumnLabel icon={IconUser}>Nom</ColumnLabel>,
    sortable: true,
  },
  {
    accessorKey: "startDate",
    label: "Date d’entrée",
    header: () => <ColumnLabel icon={IconCalendarEvent}>Date d’entrée</ColumnLabel>,
    cell: ({ row }) => <DateCell value={row.original.startDate} />,
    sortable: true,
  },
  {
    accessorKey: "education",
    label: "Formation",
    header: () => <ColumnLabel icon={IconCertificate}>Formation</ColumnLabel>,
    sortable: true,
  },
]

const filters: DataTableFilter<EmployeeFilters>[] = [
  {
    key: "department",
    type: "select",
    label: "Département",
    placeholder: "Tous les départements",
    options: departments.map((department) => ({
      value: department,
      label: department,
    })),
  },
  {
    key: "employment",
    type: "select",
    label: "Statut",
    placeholder: "Tous les statuts",
    options: [
      { value: "Active", label: "Actifs" },
      { value: "Inactive", label: "Inactifs" },
    ],
  },
]

function exportEmployees(rows: Employee[]) {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0]) as Array<keyof Employee>
  const content = [
    headers.join(","),
    ...rows.map((employee) =>
      headers
        .map((header) => `"${String(employee[header]).replaceAll('"', '""')}"`)
        .join(",")
    ),
  ].join("\n")
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/csv;charset=utf-8" })
  )
  const link = document.createElement("a")
  link.href = url
  link.download = "employes.csv"
  link.click()
  URL.revokeObjectURL(url)
}

export function EmployeeDataTable() {
  return (
    <DataTable<Employee, Employee, EmployeeFilters>
      id="employees"
      mode="client"
      data={employees}
      columns={columns}
      filters={filters}
      getRowId={(employee) => employee.id}
      defaultPageSize={5}
      pageSizeOptions={[5, 10, 20]}
      search={{
        enabled: true,
        placeholder: "Rechercher un employé…",
      }}
      selectable
      toolbarActions={
        <Button size="sm" className="ml-1.5 h-7 px-2.5 text-[13px]">
          Ajouter
          <IconPlus data-icon="inline-end" />
        </Button>
      }
      bulkActions={({ selectedRows }) => (
        <Button variant="ghost" size="sm" onClick={() => exportEmployees(selectedRows)}>
          <IconDownload data-icon="inline-start" />
          Exporter
        </Button>
      )}
      export={{
        enabled: true,
        handler: ({ selectedRows, visibleRows }) =>
          exportEmployees(selectedRows.length > 0 ? selectedRows : visibleRows),
      }}
      ariaLabel="Liste des employés"
    />
  )
}
