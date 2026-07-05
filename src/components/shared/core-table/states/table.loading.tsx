import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export function DataTableLoading({
  columnCount,
  rowCount,
}: {
  columnCount: number
  rowCount: number
}) {
  return Array.from({ length: Math.min(Math.max(rowCount, 3), 10) }, (_, row) => (
    <TableRow key={row} aria-hidden="true">
      {Array.from({ length: columnCount }, (_, column) => (
        <TableCell key={column} className="px-3 py-2">
          <Skeleton className="h-4 w-full max-w-32" />
        </TableCell>
      ))}
    </TableRow>
  ))
}
