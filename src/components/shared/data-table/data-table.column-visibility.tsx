"use client"

import { IconColumns3 } from "@tabler/icons-react"

import type { DataTableColumnMeta } from "@/components/shared/data-table/data-table.types"
import { useDataTableContext } from "@/components/shared/data-table/data-table.provider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DataTableColumnVisibility<TRow, TFilters>() {
  const { table } = useDataTableContext<TRow, TFilters>()
  const columns = table.getAllLeafColumns().filter((column) => column.getCanHide())
  if (columns.length === 0) return null

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Colonnes visibles"
          >
            <IconColumns3 />
          </Button>
        }
      />
      <PopoverContent align="end" className="w-52 gap-2 p-2">
        <PopoverHeader className="px-1">
          <PopoverTitle className="text-xs font-medium text-muted-foreground">
            Colonnes visibles
          </PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col gap-0.5">
          {columns.map((column) => {
            const meta = column.columnDef.meta as DataTableColumnMeta | undefined
            return (
              <label
                key={column.id}
                className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm hover:bg-muted"
              >
                <Checkbox
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked) =>
                    column.toggleVisibility(checked === true)
                  }
                />
                <span>{meta?.label ?? column.id}</span>
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
