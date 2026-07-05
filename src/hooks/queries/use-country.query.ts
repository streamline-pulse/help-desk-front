import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiMutation } from "@/hooks/use-api-mutation"
import type { CountryInput } from "@/schemas/country.schema"
import { countryService } from "@/services/country.service"
import type { ApiListParams } from "@/types/api/api-data.type"

const keys = {
  all: ["configuration", "countries"] as const,
  list: (request: ApiListParams) =>
    ["configuration", "countries", "list", request] as const,
}

export function useCountryListQuery(request: ApiListParams, enabled = true) {
  return useQuery({
    queryKey: keys.list(request),
    queryFn: ({ signal }) => countryService.list(request, signal),
    placeholderData: (previous) => previous,
    enabled,
  })
}
export function useCreateCountryMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: countryService.create,
      onSuccess: () =>
        client.invalidateQueries({ queryKey: ["configuration"] }),
    },
    {
      loading: "Création du pays…",
      success: "Le pays a été créé.",
      error: "Impossible de créer le pays.",
    }
  )
}
export function useUpdateCountryMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: ({
        identifier,
        input,
      }: {
        identifier: string
        input: Partial<CountryInput>
      }) => countryService.update(identifier, input),
      onSuccess: () =>
        client.invalidateQueries({ queryKey: ["configuration"] }),
    },
    {
      loading: "Mise à jour du pays…",
      success: "Le pays a été mis à jour.",
      error: "Impossible de mettre à jour le pays.",
    }
  )
}
export function useDeleteCountryMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: countryService.remove,
      onSuccess: () =>
        client.invalidateQueries({ queryKey: ["configuration"] }),
    },
    {
      loading: "Suppression du pays…",
      success: "Le pays a été supprimé.",
      error: "Impossible de supprimer le pays.",
    }
  )
}
export function useBulkDeleteCountriesMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (slugs: string[]) =>
        Promise.all(slugs.map(countryService.remove)),
      onSuccess: () =>
        client.invalidateQueries({ queryKey: ["configuration"] }),
    },
    {
      loading: "Suppression des pays…",
      success: "Les pays sélectionnés ont été supprimés.",
      error: "Impossible de supprimer les pays sélectionnés.",
    }
  )
}
