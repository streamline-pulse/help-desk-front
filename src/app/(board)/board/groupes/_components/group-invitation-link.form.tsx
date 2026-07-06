"use client"

import { useState } from "react"
import { IconCopy } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
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

async function copyInvitationLink(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    toast.success("Lien d’invitation copié")
  } catch {
    toast.error("Impossible de copier le lien d’invitation")
  }
}

export function GroupInvitationLinkForm({
  groupId,
  roles,
  onClose,
}: {
  groupId: string
  roles: GroupRole[]
  onClose: () => void
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
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="invitation-link-role">
          Rôle attribué via le lien
        </label>
        <Select
          value={generateRoleId}
          onValueChange={(value) => setGenerateRoleId(String(value ?? ""))}
        >
          <SelectTrigger id="invitation-link-role" className="w-full">
            <SelectValue placeholder="Sélectionner un rôle">
              {selectedRole?.name ?? "Sélectionner un rôle"}
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
      {generatedLink ? (
        <div className="flex gap-2">
          <Input
            readOnly
            value={generatedLink}
            aria-label="Lien d’invitation généré"
          />
          <IconButton
            type="button"
            variant="outline"
            tooltip="Copier le lien d’invitation"
            onClick={() => void copyInvitationLink(generatedLink)}
          >
            <IconCopy className="size-3.5" stroke={1.75} aria-hidden="true" />
          </IconButton>
        </div>
      ) : null}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Fermer
        </Button>
        <Button
          type="button"
          disabled={!generateRoleId || generateMutation.isPending}
          onClick={() => void generate()}
        >
          {generateMutation.isPending ? "Génération…" : "Générer le lien"}
        </Button>
      </DialogFooter>
    </div>
  )
}
