"use client"

import { flexRender } from "@tanstack/react-table"

import { cellSpacing } from "@/components/shared/core-table/table.header"
import { useDataTableContext } from "@/components/shared/core-table/table.provider"
import type { DataTableColumnMeta } from "@/components/shared/core-table/table.types"
import { DataTableEmpty } from "@/components/shared/core-table/states/table.empty"
import { DataTableError } from "@/components/shared/core-table/states/table.error"
import { DataTableLoading } from "@/components/shared/core-table/states/table.loading"
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

function isInteractiveTableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.closest(
      "[data-table-interactive='true'], [data-slot='checkbox'], [data-slot='button']"
    )
  )
}

export function DataTableBodyContent<TRow, TFilters>() {
  const controller = useDataTableContext<TRow, TFilters>()
  const { table, isInitialLoading, error, slots, hasActiveCriteria, state, rowInteraction } =
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

  const rowClickable = Boolean(
    rowInteraction?.onRowClick && rowInteraction.clickable !== false
  )

  return (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() ? "selected" : undefined}
          className={cn(
            "data-[state=selected]:bg-muted",
            rowClickable && "cursor-pointer hover:bg-muted/50"
          )}
          onClick={
            rowInteraction?.onRowClick
              ? (event) => {
                  if (isInteractiveTableTarget(event.target)) return
                  rowInteraction.onRowClick?.(row.original)
                }
              : undefined
          }
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
