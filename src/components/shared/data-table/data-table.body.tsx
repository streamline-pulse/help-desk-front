"use client"

import { flexRender } from "@tanstack/react-table"

import { cellSpacing } from "@/components/shared/data-table/data-table.header"
import { useDataTableContext } from "@/components/shared/data-table/data-table.provider"
import type { DataTableColumnMeta } from "@/components/shared/data-table/data-table.types"
import { DataTableEmpty } from "@/components/shared/data-table/states/data-table.empty"
import { DataTableError } from "@/components/shared/data-table/states/data-table.error"
import { DataTableLoading } from "@/components/shared/data-table/states/data-table.loading"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

function StateRow({
  columnCount,
  children,
}: {
  columnCount: number
  children: React.ReactNode
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columnCount} className="p-0">
        {children}
      </TableCell>
    </TableRow>
  )
}

export function DataTableBodyContent<TRow, TFilters>() {
  const controller = useDataTableContext<TRow, TFilters>()
  const { table, isInitialLoading, error, slots, hasActiveCriteria, state } =
    controller
  const columnCount = Math.max(table.getVisibleLeafColumns().length, 1)

  if (isInitialLoading) {
    return (
      <TableBody aria-busy="true">
        {slots?.loading ? (
          <StateRow columnCount={columnCount}>{slots.loading}</StateRow>
        ) : (
          <DataTableLoading
            columnCount={columnCount}
            rowCount={state.pageSize}
          />
        )}
      </TableBody>
    )
  }
  if (error) {
    return (
      <TableBody>
        <StateRow columnCount={columnCount}>
          {slots?.error ? (
            slots.error(error, controller.retry)
          ) : (
            <DataTableError error={error} retry={controller.retry} />
          )}
        </StateRow>
      </TableBody>
    )
  }
  if (table.getRowModel().rows.length === 0) {
    return (
      <TableBody>
        <StateRow columnCount={columnCount}>
          {hasActiveCriteria && slots?.noResults ? (
            slots.noResults
          ) : !hasActiveCriteria && slots?.empty ? (
            slots.empty
          ) : (
            <DataTableEmpty
              filtered={hasActiveCriteria}
              reset={() => {
                state.setSearch("")
                state.resetFilters()
              }}
            />
          )}
        </StateRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() ? "selected" : undefined}
          className="data-[state=selected]:bg-muted"
        >
          {row.getVisibleCells().map((cell) => {
            const meta = cell.column.columnDef.meta as
              | DataTableColumnMeta
              | undefined
            return (
              <TableCell
                key={cell.id}
                className={cn(
                  "text-sm",
                  cellSpacing(cell.column.id),
                  meta?.className
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            )
          })}
        </TableRow>
      ))}
    </TableBody>
  )
}
