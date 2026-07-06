import { IconDownload, IconFilter } from "@tabler/icons-react"

import { PreviewFrame } from "@/components/shared/onboarding/previews/preview-frame"
import {
  MiniPanel,
  MiniSkeleton,
  PreviewHighlight,
} from "@/components/shared/onboarding/previews/preview-primitives"

export function PreviewExport() {
  return (
    <PreviewFrame>
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-end gap-1">
          <div className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground dark:bg-white/10 dark:text-white/50">
            <IconFilter className="size-3" stroke={1.75} />
          </div>
          <PreviewHighlight>
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <IconDownload className="size-3" stroke={1.75} />
            </div>
          </PreviewHighlight>
        </div>
        <MiniPanel className="space-y-1 p-1.5">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-primary/70" />
            <MiniSkeleton className="h-1.5 flex-1" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm bg-primary/70" />
            <MiniSkeleton className="h-1.5 flex-1" />
          </div>
          <MiniSkeleton className="h-1.5 w-2/3" />
        </MiniPanel>
      </div>
    </PreviewFrame>
  )
}
