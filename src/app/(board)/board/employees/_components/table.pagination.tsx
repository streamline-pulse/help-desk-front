"use client"

import type { Table } from "@tanstack/react-table"
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import type { Employee } from "@/app/(board)/board/employees/_components/employee-mock-data"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type TablePaginationProps = {
  table: Table<Employee>
}

function getPaginationItems(
  pageCount: number,
  pageIndex: number
): Array<number | "ellipsis"> {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index)
  }

  const items: Array<number | "ellipsis"> = [0]

  if (pageIndex > 2) {
    items.push("ellipsis")
  }

  const rangeStart = Math.max(1, pageIndex - 1)
  const rangeEnd = Math.min(pageCount - 2, pageIndex + 1)

  for (let index = rangeStart; index <= rangeEnd; index += 1) {
    items.push(index)
  }

  if (pageIndex < pageCount - 3) {
    items.push("ellipsis")
  }

  items.push(pageCount - 1)

  return items
}

function PageControls({ table }: { table: Table<Employee> }) {
  const pageCount = Math.max(table.getPageCount(), 1)
  const pageIndex = table.getState().pagination.pageIndex
  const items = getPaginationItems(pageCount, pageIndex)

  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent className="gap-1">
        <PaginationItem>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            aria-label="Page précédente"
          >
            <IconChevronLeft />
          </Button>
        </PaginationItem>

        {items.map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis className="size-8 text-muted-foreground" />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <Button
                variant={pageIndex === item ? "outline" : "ghost"}
                size="icon-sm"
                className={cn(
                  "min-w-8 font-normal tabular-nums",
                  pageIndex === item
                    ? "border-border bg-transparent shadow-none"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => table.setPageIndex(item)}
                aria-label={`Page ${item + 1}`}
                aria-current={pageIndex === item ? "page" : undefined}
              >
                {item + 1}
              </Button>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            aria-label="Page suivante"
          >
            <IconChevronRight />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function TablePagination({ table }: TablePaginationProps) {
  const filteredCount = table.getFilteredRowModel().rows.length
  const totalCount = table.getCoreRowModel().rows.length

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <p className="text-sm text-muted-foreground tabular-nums">
        {filteredCount} résultat{filteredCount > 1 ? "s" : ""} sur {totalCount}
      </p>

      <div className="flex items-center">
        <div className="flex items-center gap-2 pr-3">
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

        <Separator orientation="vertical" className="h-5 shrink-0" />

        <div className="pl-3">
          <PageControls table={table} />
        </div>
      </div>
    </div>
  )
}
