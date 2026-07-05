import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiMutation } from "@/hooks/use-api-mutation"
import type { TownInput } from "@/schemas/town.schema"
import { townService } from "@/services/town.service"
import type { ApiListParams } from "@/types/api/api-data.type"
import type { TownFilters } from "@/types/api/town.type"

const keys = {
  all: ["configuration", "towns"] as const,
  list: (request: ApiListParams<TownFilters>) =>
    ["configuration", "towns", "list", request] as const,
}

export function useTownListQuery(
  request: ApiListParams<TownFilters>,
  enabled = true
) {
  return useQuery({
    queryKey: keys.list(request),
    queryFn: ({ signal }) => townService.list(request, signal),
    placeholderData: (previous) => previous,
    enabled,
  })
}
export function useCreateTownMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: townService.create,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Création de la ville…",
      success: "La ville a été créée.",
      error: "Impossible de créer la ville.",
    }
  )
}
export function useUpdateTownMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: ({
        identifier,
        input,
      }: {
        identifier: string
        input: Partial<TownInput>
      }) => townService.update(identifier, input),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Mise à jour de la ville…",
      success: "La ville a été mise à jour.",
      error: "Impossible de mettre à jour la ville.",
    }
  )
}
export function useDeleteTownMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: townService.remove,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression de la ville…",
      success: "La ville a été supprimée.",
      error: "Impossible de supprimer la ville.",
    }
  )
}
export function useBulkDeleteTownsMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (slugs: string[]) =>
        Promise.all(slugs.map(townService.remove)),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression des villes…",
      success: "Les villes sélectionnées ont été supprimées.",
      error: "Impossible de supprimer les villes sélectionnées.",
    }
  )
}
