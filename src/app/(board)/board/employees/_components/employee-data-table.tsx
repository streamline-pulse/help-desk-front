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
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconHash,
  IconId,
  IconMail,
  IconSchool,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"

import { DepartmentLabel } from "@/app/(board)/board/employees/_components/department-label"
import {
  employees,
  type Employee,
} from "@/app/(board)/board/employees/_components/employee-mock-data"
import { EmploymentStatusBadge } from "@/app/(board)/board/employees/_components/employment-status-badge"
import { TableToolbar } from "@/app/(board)/board/employees/_components/table.toolbar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  sorted,
}: {
  icon: React.ComponentType<{ className?: string; stroke?: number }>
  label: string
  sorted: false | "asc" | "desc"
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-3.5 text-muted-foreground" stroke={1.75} />
      <span>{label}</span>
      {sorted === "asc" ? (
        <IconChevronUp className="size-3.5 text-muted-foreground" />
      ) : null}
      {sorted === "desc" ? (
        <IconChevronDown className="size-3.5 text-muted-foreground" />
      ) : null}
    </span>
  )
}

const columns: ColumnDef<Employee>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
      <ColumnHeader icon={IconUsers} label="Matricule" sorted={column.getIsSorted()} />
    ),
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <ColumnHeader icon={IconId} label="Département" sorted={column.getIsSorted()} />
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
      <ColumnHeader icon={IconHash} label="Ancienneté" sorted={column.getIsSorted()} />
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
      <ColumnHeader icon={IconCalendar} label="Date d’entrée" sorted={column.getIsSorted()} />
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
      <ColumnHeader icon={IconSchool} label="Formation" sorted={column.getIsSorted()} />
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
  const totalCount = table.getCoreRowModel().rows.length

  return (
    <div className="pb-10">
      <TableToolbar table={table} />
      <div className="px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-10 px-3 text-xs font-medium">
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          className="flex h-full w-full cursor-pointer items-center text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                      <TableCell key={cell.id} className="px-3 py-2 text-sm">
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

        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <p className="text-sm text-muted-foreground tabular-nums">
            {filteredCount} résultat{filteredCount > 1 ? "s" : ""} sur {totalCount}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground sm:inline">
                Lignes par page
              </span>
              <Select
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" aria-label="Lignes par page">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20].map((pageSize) => (
                    <SelectItem key={pageSize} value={String(pageSize)}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-sm tabular-nums">
              Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount() || 1}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label="Page précédente"
              >
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label="Page suivante"
              >
                <IconChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
