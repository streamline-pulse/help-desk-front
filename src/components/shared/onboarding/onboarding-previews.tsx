import type { ComponentType } from "react"

import type { OnboardingStepId } from "@/config/onboarding-steps"
import { PreviewAddButton } from "@/components/shared/onboarding/previews/preview-add-button"
import { PreviewExport } from "@/components/shared/onboarding/previews/preview-export"
import { PreviewFilter } from "@/components/shared/onboarding/previews/preview-filter"
import { PreviewSearch } from "@/components/shared/onboarding/previews/preview-search"
import { PreviewSidebar } from "@/components/shared/onboarding/previews/preview-sidebar"

export const onboardingPreviews: Record<OnboardingStepId, ComponentType> = {
  "explore-navigation": PreviewSidebar,
  "global-search": PreviewSearch,
  "create-user": PreviewAddButton,
  "table-search": PreviewFilter,
  "export-data": PreviewExport,
}
