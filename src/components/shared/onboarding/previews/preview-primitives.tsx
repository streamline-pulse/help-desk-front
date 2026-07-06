import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function PreviewHighlight({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <span
        aria-hidden="true"
        className="absolute -inset-0.5 animate-pulse rounded-[inherit] bg-primary/20 dark:bg-primary/30"
      />
      <div
        className={cn(
          "relative rounded-[inherit] ring-2 ring-primary ring-offset-1",
          "ring-offset-background dark:ring-offset-transparent"
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function MiniSkeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn("rounded-sm bg-muted dark:bg-white/15", className)}
    />
  )
}

export function MiniPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-md border",
        "border-border bg-muted/40",
        "dark:border-white/10 dark:bg-black/20",
        className
      )}
    >
      {children}
    </div>
  )
}
