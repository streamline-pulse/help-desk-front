"use client"

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

import { useDataTableContext } from "@/components/shared/data-table/data-table.provider"
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function paginationItems(pageCount: number, pageIndex: number) {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index)
  const items: Array<number | "ellipsis-start" | "ellipsis-end"> = [0]
  if (pageIndex > 2) items.push("ellipsis-start")
  for (
    let index = Math.max(1, pageIndex - 1);
    index <= Math.min(pageCount - 2, pageIndex + 1);
    index += 1
  ) {
    items.push(index)
  }
  if (pageIndex < pageCount - 3) items.push("ellipsis-end")
  items.push(pageCount - 1)
  return items
}

export function DataTablePagination<TRow, TFilters>() {
  const { total, pageCount, state, pageSizeOptions } =
    useDataTableContext<TRow, TFilters>()
  if (total === 0) return null
  const pageIndex = state.page - 1
  const safePageCount = Math.max(pageCount, 1)
  const items = paginationItems(safePageCount, pageIndex)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <p className="text-sm text-muted-foreground tabular-nums">
        {total} résultat{total > 1 ? "s" : ""}
      </p>
      <div className="flex items-center">
        <div className="flex items-center gap-2 pr-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Lignes par page
          </span>
          <Select
            value={String(state.pageSize)}
            onValueChange={(value) => {
              if (value) state.setPageSize(Number(value))
            }}
          >
            <SelectTrigger size="sm" aria-label="Lignes par page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Separator orientation="vertical" className="h-5 shrink-0" />
        <Pagination className="mx-0 w-auto pl-3">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground"
                disabled={pageIndex <= 0}
                onClick={() => state.setPage(state.page - 1)}
                aria-label="Page précédente"
              >
                <IconChevronLeft />
              </Button>
            </PaginationItem>
            {items.map((item) =>
              typeof item === "string" ? (
                <PaginationItem key={item}>
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
                    onClick={() => state.setPage(item + 1)}
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
                disabled={pageIndex >= safePageCount - 1}
                onClick={() => state.setPage(state.page + 1)}
                aria-label="Page suivante"
              >
                <IconChevronRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
