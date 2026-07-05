import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useApiMutation } from "@/hooks/use-api-mutation"
import type { GroupPermissionInput } from "@/schemas/group-permission.schema"
import { groupPermissionService } from "@/services/group-permission.service"
import type { ApiListParams } from "@/types/api/api-data.type"

const keys = {
  all: ["group-configuration", "group-permissions"] as const,
  list: (request: ApiListParams) =>
    ["group-configuration", "group-permissions", "list", request] as const,
}

export function useGroupPermissionListQuery(
  request: ApiListParams,
  enabled = true
) {
  return useQuery({
    queryKey: keys.list(request),
    queryFn: ({ signal }) => groupPermissionService.list(request, signal),
    placeholderData: (previous) => previous,
    enabled,
  })
}

export function useCreateGroupPermissionMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: groupPermissionService.create,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Création de la permission de groupe…",
      success: "La permission de groupe a été créée.",
      error: "Impossible de créer la permission de groupe.",
    }
  )
}

export function useUpdateGroupPermissionMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: ({
        identifier,
        input,
      }: {
        identifier: string
        input: Partial<GroupPermissionInput>
      }) => groupPermissionService.update(identifier, input),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Mise à jour de la permission de groupe…",
      success: "La permission de groupe a été mise à jour.",
      error: "Impossible de mettre à jour la permission de groupe.",
    }
  )
}

export function useDeleteGroupPermissionMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: groupPermissionService.remove,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression de la permission de groupe…",
      success: "La permission de groupe a été supprimée.",
      error: "Impossible de supprimer la permission de groupe.",
    }
  )
}

export function useBulkDeleteGroupPermissionsMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (ids: string[]) =>
        Promise.all(ids.map(groupPermissionService.remove)),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression des permissions de groupe…",
      success: "Les permissions de groupe sélectionnées ont été supprimées.",
      error: "Impossible de supprimer les permissions de groupe sélectionnées.",
    }
  )
}
