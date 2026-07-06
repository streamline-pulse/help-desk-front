import { useQuery, useQueryClient } from "@tanstack/react-query"

import { groupUserQueryKeys } from "@/hooks/queries/use-group-user.query"
import { useApiMutation } from "@/hooks/use-api-mutation"
import type { AcceptGroupInvitationInput, GenerateGroupInvitationInput, GroupInvitationInput } from "@/schemas/group-invitation.schema"
import { groupInvitationService } from "@/services/group-invitation.service"
import type { ApiListParams } from "@/types/api/api-data.type"
import type { GroupInvitationStatus } from "@/types/api/group-invitation.type"

export const groupInvitationQueryKeys = {
  all: ["group-invitations"] as const,
  byGroup: (groupId: string) => [...groupInvitationQueryKeys.all, groupId] as const,
  list: (groupId: string, status: GroupInvitationStatus, request: ApiListParams) => [...groupInvitationQueryKeys.byGroup(groupId), status, request] as const,
}

export function useGroupInvitationListQuery(groupId: string, status: GroupInvitationStatus, request: ApiListParams, enabled = true) {
  return useQuery({ queryKey: groupInvitationQueryKeys.list(groupId, status, request), queryFn: ({ signal }) => groupInvitationService.list(groupId, status, request, signal), placeholderData: (previous) => previous, enabled: enabled && Boolean(groupId) })
}

export function useCreateGroupInvitationMutation(groupId: string) {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: (input: GroupInvitationInput) => groupInvitationService.create(groupId, input), onSuccess: () => client.invalidateQueries({ queryKey: groupInvitationQueryKeys.byGroup(groupId) }) }, { loading: "Envoi de l’invitation…", success: "L’invitation a été créée.", error: "Impossible de créer l’invitation." })
}

export function useGenerateGroupInvitationMutation(groupId: string) {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: (input: GenerateGroupInvitationInput) => groupInvitationService.generate(groupId, input), onSuccess: () => client.invalidateQueries({ queryKey: groupInvitationQueryKeys.byGroup(groupId) }) }, { loading: "Génération du lien…", success: "Le lien d’invitation a été généré.", error: "Impossible de générer le lien." })
}

export function useAcceptGroupInvitationMutation() {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: (input: AcceptGroupInvitationInput) => groupInvitationService.accept(input), onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: groupInvitationQueryKeys.all }), client.invalidateQueries({ queryKey: groupUserQueryKeys.all })]) }, { loading: "Acceptation de l’invitation…", success: "L’invitation a été acceptée.", error: "Impossible d’accepter l’invitation." })
}

export function useDeleteGroupInvitationMutation(groupId: string) {
  const client = useQueryClient()
  return useApiMutation({ mutationFn: (id: string) => groupInvitationService.remove(groupId, id), onSuccess: () => client.invalidateQueries({ queryKey: groupInvitationQueryKeys.byGroup(groupId) }) }, { loading: "Suppression de l’invitation…", success: "L’invitation a été supprimée.", error: "Impossible de supprimer l’invitation." })
}
