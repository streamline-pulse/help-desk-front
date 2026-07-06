import { IconSearch } from "@tabler/icons-react"

import { PreviewFrame } from "@/components/shared/onboarding/previews/preview-frame"
import {
  MiniPanel,
  MiniSkeleton,
  PreviewHighlight,
} from "@/components/shared/onboarding/previews/preview-primitives"

export function PreviewSearch() {
  return (
    <PreviewFrame>
      <div className="flex h-full flex-col justify-center gap-2">
        <PreviewHighlight>
          <div className="flex h-7 items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 dark:border-white/20 dark:bg-white/10">
            <IconSearch
              className="size-3 shrink-0 text-muted-foreground dark:text-white/70"
              stroke={1.75}
            />
            <span className="text-[8px] text-muted-foreground dark:text-white/50">
              Rechercher…
            </span>
            <span className="ml-auto rounded border border-border bg-background px-1 text-[7px] text-muted-foreground dark:border-white/15 dark:bg-black/30 dark:text-white/40">
              ⌘K
            </span>
          </div>
        </PreviewHighlight>
        <MiniPanel className="space-y-1 p-1.5">
          <div className="flex items-center gap-1.5">
            <MiniSkeleton className="size-2.5 rounded-full" />
            <MiniSkeleton className="h-1.5 w-2/3" />
          </div>
          <div className="flex items-center gap-1.5">
            <MiniSkeleton className="size-2.5 rounded-full" />
            <MiniSkeleton className="h-1.5 w-1/2" />
          </div>
        </MiniPanel>
      </div>
    </PreviewFrame>
  )
}
