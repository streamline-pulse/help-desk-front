import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useApiMutation } from "@/hooks/use-api-mutation"
import type { GroupInput } from "@/schemas/group.schema"
import { groupService } from "@/services/group.service"
import type { ApiListParams } from "@/types/api/api-data.type"

export const groupQueryKeys = {
  all: ["groups"] as const,
  lists: () => [...groupQueryKeys.all, "list"] as const,
  list: (request: ApiListParams) => [...groupQueryKeys.lists(), request] as const,
  mine: (request: ApiListParams) => [...groupQueryKeys.all, "mine", request] as const,
  detail: (id: string) => [...groupQueryKeys.all, "detail", id] as const,
}

export function useGroupListQuery(request: ApiListParams, enabled = true) {
  return useQuery({ queryKey: groupQueryKeys.list(request), queryFn: ({ signal }) => groupService.list(request, signal), placeholderData: (previous) => previous, enabled })
}

export function useMyGroupListQuery(request: ApiListParams, enabled = true) {
  return useQuery({ queryKey: groupQueryKeys.mine(request), queryFn: ({ signal }) => groupService.listMine(request, signal), placeholderData: (previous) => previous, enabled })
}

export function useGroupQuery(id: string) {
  return useQuery({ queryKey: groupQueryKeys.detail(id), queryFn: ({ signal }) => groupService.get(id, signal), enabled: Boolean(id) })
}

export function useCreateGroupMutation() {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: groupService.create, onSuccess: () => client.invalidateQueries({ queryKey: groupQueryKeys.all }) }, { loading: "Création du groupe…", success: "Le groupe a été créé.", error: "Impossible de créer le groupe." })
}

export function useUpdateGroupMutation() {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<GroupInput> }) => groupService.update(id, input), onSuccess: (_, variables) => Promise.all([client.invalidateQueries({ queryKey: groupQueryKeys.lists() }), client.invalidateQueries({ queryKey: groupQueryKeys.detail(variables.id) })]) }, { loading: "Mise à jour du groupe…", success: "Le groupe a été mis à jour.", error: "Impossible de mettre à jour le groupe." })
}

export function useDeleteGroupMutation() {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: groupService.remove, onSuccess: () => client.invalidateQueries({ queryKey: groupQueryKeys.all }) }, { loading: "Suppression du groupe…", success: "Le groupe a été supprimé.", error: "Impossible de supprimer le groupe." })
}
