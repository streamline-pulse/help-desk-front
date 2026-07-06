import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PreviewFrameProps = {
  children: ReactNode
  className?: string
}

export function PreviewFrame({ children, className }: PreviewFrameProps) {
  return (
    <div
      className={cn(
        "relative h-[100px] w-full overflow-hidden rounded-lg border p-2.5 shadow-inner",
        "border-border bg-background text-foreground",
        "dark:border-white/15 dark:bg-linear-to-b dark:from-white/10 dark:to-white/4 dark:text-background",
        className
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset",
          "ring-border/60 dark:ring-white/10"
        )}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
