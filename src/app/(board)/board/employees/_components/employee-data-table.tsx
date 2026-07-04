"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  IconBriefcase,
  IconBuilding,
  IconCalendarEvent,
  IconCertificate,
  IconChevronDown,
  IconChevronUp,
  IconClock,
  IconMail,
  IconUser,
} from "@tabler/icons-react"

import { DepartmentLabel } from "@/app/(board)/board/employees/_components/department-label"
import {
  employees,
  type Employee,
} from "@/app/(board)/board/employees/_components/employee-mock-data"
import { EmploymentStatusBadge } from "@/app/(board)/board/employees/_components/employment-status-badge"
import { TablePagination } from "@/app/(board)/board/employees/_components/table.pagination"
import { TableToolbar } from "@/app/(board)/board/employees/_components/table.toolbar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

function getColumnCellClassName(columnId: string) {
  if (columnId === "select") {
    return "w-8 py-2 pl-3 pr-1"
  }

  if (columnId === "id") {
    return "py-2 pl-2 pr-3"
  }

  return "px-3 py-2"
}

function ColumnHeader({
  icon: Icon,
  label,
  sorted,
}: {
  icon?: React.ComponentType<{ className?: string; stroke?: number }>
  label: string
  sorted: false | "asc" | "desc"
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-sm">
      {Icon ? (
        <Icon
          className="size-3.5 shrink-0 text-foreground"
          stroke={1.75}
          aria-hidden
        />
      ) : null}
      <span className="truncate font-medium text-foreground">{label}</span>
      {sorted === "asc" ? (
        <IconChevronUp className="size-3.5 shrink-0 text-foreground" />
      ) : null}
      {sorted === "desc" ? (
        <IconChevronDown className="size-3.5 shrink-0 text-foreground" />
      ) : null}
    </span>
  )
}

const columns: ColumnDef<Employee>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(Boolean(checked))
        }
        aria-label="Sélectionner tous les employés de cette page"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
        aria-label={`Sélectionner ${row.original.firstName} ${row.original.lastName}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <ColumnHeader label="Matricule" sorted={column.getIsSorted()} />
    ),
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <ColumnHeader
        icon={IconBuilding}
        label="Département"
        sorted={column.getIsSorted()}
      />
    ),
    cell: ({ row }) => <DepartmentLabel department={row.original.department} />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <ColumnHeader icon={IconMail} label="E-mail" sorted={column.getIsSorted()} />
    ),
  },
  {
    accessorKey: "employment",
    header: ({ column }) => (
      <ColumnHeader icon={IconBriefcase} label="Statut" sorted={column.getIsSorted()} />
    ),
    cell: ({ row }) => (
      <EmploymentStatusBadge status={row.original.employment} />
    ),
  },
  {
    accessorKey: "years",
    header: ({ column }) => (
      <ColumnHeader icon={IconClock} label="Ancienneté" sorted={column.getIsSorted()} />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.years} ans</span>
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <ColumnHeader icon={IconUser} label="Prénom" sorted={column.getIsSorted()} />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <ColumnHeader icon={IconUser} label="Nom" sorted={column.getIsSorted()} />
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <ColumnHeader
        icon={IconCalendarEvent}
        label="Date d’entrée"
        sorted={column.getIsSorted()}
      />
    ),
    cell: ({ row }) => (
      <span className="tabular-nums">
        {format(parseISO(row.original.startDate), "dd/MM/yyyy")}
      </span>
    ),
  },
  {
    accessorKey: "education",
    header: ({ column }) => (
      <ColumnHeader
        icon={IconCertificate}
        label="Formation"
        sorted={column.getIsSorted()}
      />
    ),
  },
]

export function EmployeeDataTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState("")
  // TanStack Table exposes stateful callbacks that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: employees,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })
  const filteredCount = table.getFilteredRowModel().rows.length

  return (
    <div className="pb-10">
      <TableToolbar table={table} />
      <div className="px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table className="[&_td:not(:first-child)]:border-r [&_td:not(:first-child)]:border-border [&_td:last-child]:border-r-0 [&_th:not(:first-child)]:border-r [&_th:not(:first-child)]:border-border [&_th:last-child]:border-r-0">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/30 hover:bg-muted/30">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-10 border-b text-sm",
                        getColumnCellClassName(header.column.id)
                      )}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          className="flex h-full w-full cursor-pointer items-center text-left text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className="data-[state=selected]:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn("text-sm", getColumnCellClassName(cell.column.id))}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="h-28 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span>Aucun employé ne correspond aux filtres.</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          table.resetColumnFilters()
                          table.setGlobalFilter("")
                        }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredCount > 0 ? <TablePagination table={table} /> : null}
      </div>
    </div>
  )
}
