import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useApiMutation } from "@/hooks/use-api-mutation"
import type { GroupTypeInput } from "@/schemas/group-type.schema"
import { groupTypeService } from "@/services/group-type.service"
import type { ApiListParams } from "@/types/api/api-data.type"

const keys = {
  all: ["group-configuration", "group-types"] as const,
  list: (request: ApiListParams) =>
    ["group-configuration", "group-types", "list", request] as const,
}

export function useGroupTypeListQuery(request: ApiListParams, enabled = true) {
  return useQuery({
    queryKey: keys.list(request),
    queryFn: ({ signal }) => groupTypeService.list(request, signal),
    placeholderData: (previous) => previous,
    enabled,
  })
}

export function useCreateGroupTypeMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: groupTypeService.create,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Création du type de groupe…",
      success: "Le type de groupe a été créé.",
      error: "Impossible de créer le type de groupe.",
    }
  )
}

export function useUpdateGroupTypeMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: ({
        identifier,
        input,
      }: {
        identifier: string
        input: Partial<GroupTypeInput>
      }) => groupTypeService.update(identifier, input),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Mise à jour du type de groupe…",
      success: "Le type de groupe a été mis à jour.",
      error: "Impossible de mettre à jour le type de groupe.",
    }
  )
}

export function useDeleteGroupTypeMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: groupTypeService.remove,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression du type de groupe…",
      success: "Le type de groupe a été supprimé.",
      error: "Impossible de supprimer le type de groupe.",
    }
  )
}

export function useBulkDeleteGroupTypesMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (ids: string[]) => Promise.all(ids.map(groupTypeService.remove)),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression des types de groupe…",
      success: "Les types de groupe sélectionnés ont été supprimés.",
      error: "Impossible de supprimer les types de groupe sélectionnés.",
    }
  )
}
