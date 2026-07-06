import {
  IconLayoutDashboard,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react"

import { PreviewFrame } from "@/components/shared/onboarding/previews/preview-frame"
import {
  MiniPanel,
  MiniSkeleton,
  PreviewHighlight,
} from "@/components/shared/onboarding/previews/preview-primitives"

export function PreviewSidebar() {
  return (
    <PreviewFrame>
      <div className="flex h-full gap-2">
        <MiniPanel className="flex w-[58px] shrink-0 flex-col gap-1 p-1">
          <div className="mb-0.5 px-1 text-[7px] font-medium tracking-wide text-muted-foreground uppercase dark:text-white/40">
            Modules
          </div>
          <div className="flex items-center gap-1 rounded-sm px-1 py-0.5 text-muted-foreground dark:text-white/50">
            <IconLayoutDashboard className="size-2.5 shrink-0" stroke={1.75} />
            <MiniSkeleton className="h-1.5 flex-1" />
          </div>
          <PreviewHighlight>
            <div className="flex items-center gap-1 rounded-sm bg-primary px-1 py-1 text-primary-foreground">
              <IconUsers className="size-2.5 shrink-0" stroke={1.75} />
              <span className="text-[7px] font-medium">Utilisateurs</span>
            </div>
          </PreviewHighlight>
          <div className="flex items-center gap-1 rounded-sm px-1 py-0.5 text-muted-foreground dark:text-white/50">
            <IconUsersGroup className="size-2.5 shrink-0" stroke={1.75} />
            <MiniSkeleton className="h-1.5 flex-1" />
          </div>
        </MiniPanel>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-2">
          <MiniSkeleton className="h-2 w-3/5" />
          <MiniSkeleton className="h-1.5 w-full" />
          <MiniSkeleton className="h-1.5 w-[92%]" />
          <MiniSkeleton className="h-1.5 w-[80%]" />
        </div>
      </div>
    </PreviewFrame>
  )
}
