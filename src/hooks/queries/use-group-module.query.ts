import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useApiMutation } from "@/hooks/use-api-mutation"
import type { GroupModuleInput } from "@/schemas/group-module.schema"
import { groupModuleService } from "@/services/group-module.service"
import type { ApiListParams } from "@/types/api/api-data.type"

const keys = {
  all: ["group-configuration", "group-modules"] as const,
  list: (request: ApiListParams) =>
    ["group-configuration", "group-modules", "list", request] as const,
}

export function useGroupModuleListQuery(
  request: ApiListParams,
  enabled = true
) {
  return useQuery({
    queryKey: keys.list(request),
    queryFn: ({ signal }) => groupModuleService.list(request, signal),
    placeholderData: (previous) => previous,
    enabled,
  })
}

export function useCreateGroupModuleMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: groupModuleService.create,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Création du module de groupe…",
      success: "Le module de groupe a été créé.",
      error: "Impossible de créer le module de groupe.",
    }
  )
}

export function useUpdateGroupModuleMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: ({
        identifier,
        input,
      }: {
        identifier: string
        input: Partial<GroupModuleInput>
      }) => groupModuleService.update(identifier, input),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Mise à jour du module de groupe…",
      success: "Le module de groupe a été mis à jour.",
      error: "Impossible de mettre à jour le module de groupe.",
    }
  )
}

export function useDeleteGroupModuleMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: groupModuleService.remove,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression du module de groupe…",
      success: "Le module de groupe a été supprimé.",
      error: "Impossible de supprimer le module de groupe.",
    }
  )
}

export function useBulkDeleteGroupModulesMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (ids: string[]) =>
        Promise.all(ids.map(groupModuleService.remove)),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression des modules de groupe…",
      success: "Les modules de groupe sélectionnés ont été supprimés.",
      error: "Impossible de supprimer les modules de groupe sélectionnés.",
    }
  )
}
