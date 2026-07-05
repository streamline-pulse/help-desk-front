"use client"

import { ResourceDataTable } from "@/components/shared/configuration/resource-data-table"
import type { ResourceDataHooks } from "@/components/shared/configuration/resource-data.types"
import {
  useBulkDeleteCountriesMutation,
  useCountryListQuery,
  useCreateCountryMutation,
  useDeleteCountryMutation,
  useUpdateCountryMutation,
} from "@/hooks/queries/use-country.query"

const hooks = {
  useList: useCountryListQuery,
  useCreate: useCreateCountryMutation,
  useUpdate: useUpdateCountryMutation,
  useDelete: useDeleteCountryMutation,
  useBulkDelete: useBulkDeleteCountriesMutation,
} as unknown as ResourceDataHooks

export function CountryTable() {
  return <ResourceDataTable resource="countries" hooks={hooks} />
}
