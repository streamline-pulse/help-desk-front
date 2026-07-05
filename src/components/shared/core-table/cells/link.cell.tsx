"use client"

import { IconCopy } from "@tabler/icons-react"
import { toast } from "sonner"

import { CellShell, CellTruncate, isEmptyValue } from "@/components/shared/core-table/cells/cell.utils"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    toast.success("Copié dans le presse-papiers")
  } catch {
    toast.error("Impossible de copier")
  }
}

export function LinkCell({
  href,
  value,
  fallback = "—",
  className,
}: {
  href?: string | null
  value?: string | null
  fallback?: string
  className?: string
}) {
  if (isEmptyValue(value)) {
    return (
      <CellShell>
        <CellTruncate className="text-sm text-muted-foreground">{fallback}</CellTruncate>
      </CellShell>
    )
  }

  const displayValue = String(value)
  const canNavigate = Boolean(href)

  return (
    <CellShell title={displayValue}>
      <div className="group/link flex min-w-0 items-center gap-0.5">
        {canNavigate ? (
          <a
            href={href ?? undefined}
            className={cn(
              "min-w-0 truncate text-sm text-primary underline-offset-4 hover:underline",
              className
            )}
            data-table-interactive="true"
          >
            {displayValue}
          </a>
        ) : (
          <CellTruncate className={cn("text-sm text-foreground", className)}>
            {displayValue}
          </CellTruncate>
        )}
        <IconButton
          type="button"
          variant="ghost"
          size="icon-xs"
          className="size-5 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100 focus-visible:opacity-100"
          tooltip={`Copier ${displayValue}`}
          data-table-interactive="true"
          onClick={() => void copyToClipboard(displayValue)}
        >
          <IconCopy className="size-3" stroke={1.75} />
        </IconButton>
      </div>
    </CellShell>
  )
}
