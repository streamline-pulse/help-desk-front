import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useApiMutation } from "@/hooks/use-api-mutation"
import type { ModuleInput } from "@/schemas/module.schema"
import { moduleService } from "@/services/module.service"
import type { ApiListParams } from "@/types/api/api-data.type"

const keys = {
  all: ["configuration", "modules"] as const,
  list: (request: ApiListParams) =>
    ["configuration", "modules", "list", request] as const,
}

export function useModuleListQuery(request: ApiListParams, enabled = true) {
  return useQuery({
    queryKey: keys.list(request),
    queryFn: ({ signal }) => moduleService.list(request, signal),
    placeholderData: (previous) => previous,
    enabled,
  })
}
export function useCreateModuleMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: moduleService.create,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Création du module…",
      success: "Le module a été créé.",
      error: "Impossible de créer le module.",
    }
  )
}
export function useUpdateModuleMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: ({
        identifier,
        input,
      }: {
        identifier: string
        input: Partial<ModuleInput>
      }) => moduleService.update(identifier, input),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Mise à jour du module…",
      success: "Le module a été mis à jour.",
      error: "Impossible de mettre à jour le module.",
    }
  )
}
export function useDeleteModuleMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: moduleService.remove,
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression du module…",
      success: "Le module a été supprimé.",
      error: "Impossible de supprimer le module.",
    }
  )
}
export function useBulkDeleteModulesMutation() {
  const client = useQueryClient()
  return useApiMutation(
    {
      mutationFn: (ids: string[]) => Promise.all(ids.map(moduleService.remove)),
      onSuccess: () => client.invalidateQueries({ queryKey: keys.all }),
    },
    {
      loading: "Suppression des modules…",
      success: "Les modules sélectionnés ont été supprimés.",
      error: "Impossible de supprimer les modules sélectionnés.",
    }
  )
}
