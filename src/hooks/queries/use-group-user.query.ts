import { useQuery, useQueryClient } from "@tanstack/react-query"

import { groupRoleQueryKeys } from "@/hooks/queries/use-group-role.query"
import { useApiMutation } from "@/hooks/use-api-mutation"
import type { CreateGroupUserInput, UpdateGroupUserInput } from "@/schemas/group-user.schema"
import { groupUserService } from "@/services/group-user.service"
import type { ApiListParams } from "@/types/api/api-data.type"

export const groupUserQueryKeys = {
  all: ["group-users"] as const,
  byGroup: (groupId: string) => [...groupUserQueryKeys.all, groupId] as const,
  list: (groupId: string, request: ApiListParams) => [...groupUserQueryKeys.byGroup(groupId), "list", request] as const,
}

export function useGroupUserListQuery(groupId: string, request: ApiListParams, enabled = true) {
  return useQuery({ queryKey: groupUserQueryKeys.list(groupId, request), queryFn: ({ signal }) => groupUserService.list(groupId, request, signal), placeholderData: (previous) => previous, enabled: enabled && Boolean(groupId) })
}

export function useCreateGroupUserMutation(groupId: string) {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: (input: CreateGroupUserInput) => groupUserService.create(groupId, input), onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: groupUserQueryKeys.byGroup(groupId) }), client.invalidateQueries({ queryKey: groupRoleQueryKeys.byGroup(groupId) })]) }, { loading: "Ajout du membre…", success: "Le membre a été ajouté.", error: "Impossible d’ajouter le membre." })
}

export function useUpdateGroupUserMutation(groupId: string) {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: ({ id, input }: { id: string; input: UpdateGroupUserInput }) => groupUserService.update(groupId, id, input), onSuccess: () => client.invalidateQueries({ queryKey: groupUserQueryKeys.byGroup(groupId) }) }, { loading: "Mise à jour du membre…", success: "Le rôle du membre a été mis à jour.", error: "Impossible de modifier le membre." })
}

export function useDeleteGroupUserMutation(groupId: string) {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: (id: string) => groupUserService.remove(groupId, id), onSuccess: () => client.invalidateQueries({ queryKey: groupUserQueryKeys.byGroup(groupId) }) }, { loading: "Retrait du membre…", success: "Le membre a été retiré.", error: "Impossible de retirer le membre." })
}
