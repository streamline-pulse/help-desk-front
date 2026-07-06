import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useApiMutation } from "@/hooks/use-api-mutation"
import type { GroupRoleInput } from "@/schemas/group-role.schema"
import { groupRoleService } from "@/services/group-role.service"
import type { ApiListParams } from "@/types/api/api-data.type"

export const groupRoleQueryKeys = {
  all: ["group-roles"] as const,
  byGroup: (groupId: string) => [...groupRoleQueryKeys.all, groupId] as const,
  list: (groupId: string, request: ApiListParams) => [...groupRoleQueryKeys.byGroup(groupId), "list", request] as const,
}

export function useGroupRoleListQuery(groupId: string, request: ApiListParams, enabled = true) {
  return useQuery({ queryKey: groupRoleQueryKeys.list(groupId, request), queryFn: ({ signal }) => groupRoleService.list(groupId, request, signal), placeholderData: (previous) => previous, enabled: enabled && Boolean(groupId) })
}

export function useCreateGroupRoleMutation(groupId: string) {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: (input: GroupRoleInput) => groupRoleService.create(groupId, input), onSuccess: () => client.invalidateQueries({ queryKey: groupRoleQueryKeys.byGroup(groupId) }) }, { loading: "Création du rôle…", success: "Le rôle de groupe a été créé.", error: "Impossible de créer le rôle." })
}

export function useUpdateGroupRoleMutation(groupId: string) {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<GroupRoleInput> }) => groupRoleService.update(groupId, id, input), onSuccess: () => client.invalidateQueries({ queryKey: groupRoleQueryKeys.byGroup(groupId) }) }, { loading: "Mise à jour du rôle…", success: "Le rôle a été mis à jour.", error: "Impossible de mettre à jour le rôle." })
}

export function useDeleteGroupRoleMutation(groupId: string) {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: (id: string) => groupRoleService.remove(groupId, id), onSuccess: () => client.invalidateQueries({ queryKey: groupRoleQueryKeys.byGroup(groupId) }) }, { loading: "Suppression du rôle…", success: "Le rôle a été supprimé.", error: "Impossible de supprimer le rôle." })
}
