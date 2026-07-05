"use client"

import { flexRender } from "@tanstack/react-table"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"

import { useDataTableContext } from "@/components/shared/core-table/table.provider"
import type { DataTableColumnMeta } from "@/components/shared/core-table/table.types"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

function cellSpacing(columnId: string) {
  if (columnId === "select") return "w-8 py-2 pr-1 pl-3"
  if (columnId === "actions") return "w-10 px-2 py-2"
  return "px-3 py-2"
}

export function DataTableHeader<TRow, TFilters>() {
  const { table } = useDataTableContext<TRow, TFilters>()
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="bg-muted/30 hover:bg-muted/30">
          {headerGroup.headers.map((header) => {
            const sorted = header.column.getIsSorted()
            const meta = header.column.columnDef.meta as
              | DataTableColumnMeta
              | undefined
            return (
              <TableHead
                key={header.id}
                aria-sort={
                  sorted === "asc"
                    ? "ascending"
                    : sorted === "desc"
                      ? "descending"
                      : undefined
                }
                className={cn(
                  "h-10 border-b text-sm",
                  cellSpacing(header.column.id),
                  meta?.headerClassName
                )}
              >
                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                  <button
                    type="button"
                    className="flex h-full w-full items-center gap-1 text-left text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                    {sorted === "asc" ? (
                      <IconChevronUp
                        className="size-3 shrink-0 text-muted-foreground"
                        stroke={2}
                        aria-hidden="true"
                      />
                    ) : null}
                    {sorted === "desc" ? (
                      <IconChevronDown
                        className="size-3 shrink-0 text-muted-foreground"
                        stroke={2}
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                ) : (
                  flexRender(header.column.columnDef.header, header.getContext())
                )}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}

export { cellSpacing }
