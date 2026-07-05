import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiMutation } from "@/hooks/use-api-mutation"
import type { RegionInput } from "@/schemas/region.schema"
import { regionService } from "@/services/region.service"
import type { ApiListParams } from "@/types/api/api-data.type"
import type { RegionFilters } from "@/types/api/region.type"

const keys = {
  all: ["configuration", "regions"] as const,
  list: (request: ApiListParams<RegionFilters>) =>
    ["configuration", "regions", "list", request] as const,
}

export function useRegionListQuery(
  request: ApiListParams<RegionFilters>,
  enabled = true
) {
  return useQuery({
    queryKey: keys.list(request),
    queryFn: ({ signal }) => regionService.list(request, signal),
    placeholderData: (previous) => previous,
    enabled,
  })
}
export function useCreateRegionMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: regionService.create,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Création de la région…",
      success: "La région a été créée.",
      error: "Impossible de créer la région.",
    }
  )
}
export function useUpdateRegionMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: ({
        identifier,
        input,
      }: {
        identifier: string
        input: Partial<RegionInput>
      }) => regionService.update(identifier, input),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Mise à jour de la région…",
      success: "La région a été mise à jour.",
      error: "Impossible de mettre à jour la région.",
    }
  )
}
export function useDeleteRegionMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: regionService.remove,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression de la région…",
      success: "La région a été supprimée.",
      error: "Impossible de supprimer la région.",
    }
  )
}
export function useBulkDeleteRegionsMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (slugs: string[]) =>
        Promise.all(slugs.map(regionService.remove)),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression des régions…",
      success: "Les régions sélectionnées ont été supprimées.",
      error: "Impossible de supprimer les régions sélectionnées.",
    }
  )
}
