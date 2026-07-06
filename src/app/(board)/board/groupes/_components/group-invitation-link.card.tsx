"use client"

import { useState } from "react"
import { IconCopy } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconButton } from "@/components/ui/icon-button"
import { routes } from "@/config/routes"
import { useGenerateGroupInvitationMutation } from "@/hooks/queries/use-group-invitation.query"
import type { GroupRole } from "@/types/api/group-role.type"

export function GroupInvitationLinkCard({
  groupId,
  roles,
}: {
  groupId: string
  roles: GroupRole[]
}) {
  const [generateRoleId, setGenerateRoleId] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const generateMutation = useGenerateGroupInvitationMutation(groupId)

  async function generate() {
    if (!generateRoleId) return
    const response = await generateMutation.mutateAsync({
      roleId: generateRoleId,
    })
    setGeneratedLink(
      `${window.location.origin}${routes.auth.acceptInvitation}?token=${encodeURIComponent(response.token)}`
    )
  }

  const selectedRole = roles.find((role) => role.id === generateRoleId)

  return (
    <div className="grid gap-3 rounded-lg border bg-muted/20 p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="invitation-link-role">
          Lien d’invitation
        </label>
        <Select
          value={generateRoleId}
          onValueChange={(value) => setGenerateRoleId(String(value ?? ""))}
        >
          <SelectTrigger
            id="invitation-link-role"
            className="w-full bg-background"
          >
            <SelectValue placeholder="Sélectionner le rôle du lien">
              {selectedRole?.name ?? "Sélectionner le rôle du lien"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        className="self-end"
        variant="outline"
        disabled={!generateRoleId || generateMutation.isPending}
        onClick={() => void generate()}
      >
        {generateMutation.isPending ? "Génération…" : "Générer"}
      </Button>
      {generatedLink ? (
        <div className="flex gap-2 sm:col-span-2">
          <Input
            readOnly
            value={generatedLink}
            aria-label="Lien d’invitation généré"
          />
          <IconButton
            type="button"
            variant="outline"
            tooltip="Copier le lien d’invitation"
            onClick={() => void navigator.clipboard.writeText(generatedLink)}
          >
            <IconCopy className="size-3.5" stroke={1.75} aria-hidden="true" />
          </IconButton>
        </div>
      ) : null}
    </div>
  )
}
