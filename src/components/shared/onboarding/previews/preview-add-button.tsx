import { IconPlus } from "@tabler/icons-react"

import { PreviewFrame } from "@/components/shared/onboarding/previews/preview-frame"
import {
  MiniPanel,
  MiniSkeleton,
  PreviewHighlight,
} from "@/components/shared/onboarding/previews/preview-primitives"

export function PreviewAddButton() {
  return (
    <PreviewFrame>
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <MiniSkeleton className="h-6 w-28 rounded-md" />
          <PreviewHighlight>
            <div className="flex h-6 items-center gap-0.5 rounded-md bg-primary px-2 text-primary-foreground">
              <IconPlus className="size-3" stroke={2} />
              <span className="text-[8px] font-medium">Ajouter</span>
            </div>
          </PreviewHighlight>
        </div>
        <MiniPanel className="space-y-1 p-1.5">
          <div className="flex gap-2 border-b border-border pb-1 dark:border-white/10">
            <MiniSkeleton className="h-1.5 w-10" />
            <MiniSkeleton className="h-1.5 w-14" />
            <MiniSkeleton className="h-1.5 w-8" />
          </div>
          <MiniSkeleton className="h-1.5 w-full" />
          <MiniSkeleton className="h-1.5 w-[92%]" />
          <div className="h-1.5 w-[84%] rounded-sm bg-primary/20 ring-1 ring-primary/30 dark:bg-primary/25" />
        </MiniPanel>
      </div>
    </PreviewFrame>
  )
}
