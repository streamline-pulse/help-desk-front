import type { Column, Table } from "@tanstack/react-table"

import type { DataTableColumnMeta } from "@/components/shared/core-table/table.types"

const NON_EXPORTABLE_COLUMN_IDS = new Set(["select", "actions"])

function escapeCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

function getNestedValue(row: unknown, key: string): unknown {
  if (typeof row !== "object" || row === null) return undefined
  return key.split(".").reduce<unknown>((current, part) => {
    if (typeof current !== "object" || current === null) return undefined
    return (current as Record<string, unknown>)[part]
  }, row)
}

function getColumnLabel<TRow>(column: Column<TRow, unknown>): string {
  const meta = column.columnDef.meta as DataTableColumnMeta | undefined
  if (meta?.label) return meta.label
  if (typeof column.columnDef.header === "string") return column.columnDef.header
  return column.id
}

function getColumnExportValue<TRow>(
  row: TRow,
  column: Column<TRow, unknown>
): string {
  const columnDef = column.columnDef as {
    exportValue?: (row: TRow) => string
    accessorFn?: (row: TRow, index: number) => unknown
    accessorKey?: string
  }
  const meta = column.columnDef.meta as
    | (DataTableColumnMeta & { exportValue?: (row: TRow) => string })
    | undefined

  if (columnDef.exportValue) return columnDef.exportValue(row)
  if (meta?.exportValue) return meta.exportValue(row)
  if (columnDef.accessorFn) return String(columnDef.accessorFn(row, 0) ?? "")
  if (columnDef.accessorKey) {
    return String(getNestedValue(row, String(columnDef.accessorKey)) ?? "")
  }
  return ""
}

export function getExportableColumns<TRow>(table: Table<TRow>) {
  return table
    .getVisibleLeafColumns()
    .filter((column) => {
      if (NON_EXPORTABLE_COLUMN_IDS.has(column.id)) return false
      const meta = column.columnDef.meta as DataTableColumnMeta | undefined
      return meta?.exportable !== false
    })
}

export function exportTableToCsv<TRow>({
  table,
  rows,
  filename,
}: {
  table: Table<TRow>
  rows: TRow[]
  filename: string
}) {
  if (rows.length === 0) return

  const columns = getExportableColumns(table)
  if (columns.length === 0) return

  const headers = columns.map((column) => escapeCsvValue(getColumnLabel(column)))
  const lines = rows.map((row) =>
    columns
      .map((column) => escapeCsvValue(getColumnExportValue(row, column)))
      .join(",")
  )
  const content = [`\uFEFF${headers.join(",")}`, ...lines].join("\n")
  const url = URL.createObjectURL(
    new Blob([content], { type: "text/csv;charset=utf-8" })
  )
  const link = document.createElement("a")
  link.href = url
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
