"use client"

import { ResourceDataTable } from "@/components/shared/configuration/resource-data-table"
import type { ResourceDataHooks } from "@/components/shared/configuration/resource-data.types"
import {
  useBulkDeleteLanguagesMutation,
  useCreateLanguageMutation,
  useDeleteLanguageMutation,
  useLanguageListQuery,
  useUpdateLanguageMutation,
} from "@/hooks/queries/use-language.query"

const hooks = {
  useList: useLanguageListQuery,
  useCreate: useCreateLanguageMutation,
  useUpdate: useUpdateLanguageMutation,
  useDelete: useDeleteLanguageMutation,
  useBulkDelete: useBulkDeleteLanguagesMutation,
} as unknown as ResourceDataHooks

export function LanguageTable() {
  return <ResourceDataTable resource="languages" hooks={hooks} />
}
