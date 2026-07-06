import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useCurrentUserQuery } from "@/hooks/queries/use-auth.query"
import { groupRoleQueryKeys } from "@/hooks/queries/use-group-role.query"
import { useApiMutation } from "@/hooks/use-api-mutation"
import type { CreateGroupUserInput, UpdateGroupUserInput } from "@/schemas/group-user.schema"
import { groupUserService } from "@/services/group-user.service"
import type { ApiListParams } from "@/types/api/api-data.type"

export const groupUserQueryKeys = {
  all: ["group-users"] as const,
  byGroup: (groupId: string) => [...groupUserQueryKeys.all, groupId] as const,
  list: (groupId: string, request: ApiListParams<{ roleId?: string }>) => [...groupUserQueryKeys.byGroup(groupId), "list", request] as const,
  detail: (groupId: string, userId: string) => [...groupUserQueryKeys.byGroup(groupId), "detail", userId] as const,
  current: (groupId: string, userId: string) => [...groupUserQueryKeys.byGroup(groupId), "current", userId] as const,
}

export function useGroupUserListQuery(groupId: string, request: ApiListParams<{ roleId?: string }>, enabled = true) {
  return useQuery({ queryKey: groupUserQueryKeys.list(groupId, request), queryFn: ({ signal }) => groupUserService.list(groupId, request, signal), placeholderData: (previous) => previous, enabled: enabled && Boolean(groupId) })
}

export function useGroupUserDetailQuery(
  groupId: string,
  userId: string,
  enabled = true
) {
  return useQuery({
    queryKey: groupUserQueryKeys.detail(groupId, userId),
    queryFn: ({ signal }) => groupUserService.get(groupId, userId, signal),
    enabled: enabled && Boolean(groupId) && Boolean(userId),
  })
}

export function useCurrentGroupUserQuery(groupId: string, enabled = true) {
  const currentUserQuery = useCurrentUserQuery()
  const currentUserId = currentUserQuery.data?.id ?? ""

  return useQuery({
    queryKey: groupUserQueryKeys.current(groupId, currentUserId),
    queryFn: ({ signal }) =>
      groupUserService.getCurrent(groupId, currentUserId, signal),
    enabled:
      enabled &&
      Boolean(groupId) &&
      Boolean(currentUserId) &&
      !currentUserQuery.isPending,
  })
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
