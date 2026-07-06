import { IconSearch } from "@tabler/icons-react"

import { PreviewFrame } from "@/components/shared/onboarding/previews/preview-frame"
import {
  MiniSkeleton,
  PreviewHighlight,
} from "@/components/shared/onboarding/previews/preview-primitives"

export function PreviewFilter() {
  return (
    <PreviewFrame>
      <div className="flex h-full flex-col justify-center gap-2">
        <div className="flex items-center gap-1.5">
          <PreviewHighlight className="flex-1">
            <div className="flex h-7 items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 dark:border-white/20 dark:bg-white/10">
              <IconSearch
                className="size-3 text-muted-foreground dark:text-white/70"
                stroke={1.75}
              />
              <span className="text-[8px] text-muted-foreground dark:text-white/60">
                Rechercher un utilisateur…
              </span>
            </div>
          </PreviewHighlight>
          <MiniSkeleton className="size-7 rounded-md" />
        </div>
        <div className="flex gap-1">
          <div className="inline-flex h-4 items-center rounded-full bg-primary/15 px-2 ring-1 ring-primary/30 dark:bg-primary/30">
            <span className="text-[7px] text-foreground dark:text-white/80">
              Rôle · Admin
            </span>
          </div>
          <MiniSkeleton className="h-4 w-10 rounded-full" />
        </div>
      </div>
    </PreviewFrame>
  )
}
