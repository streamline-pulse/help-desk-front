"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { isAppApiError } from "@/lib/api-error"
import { createGroupUserSchema, updateGroupUserSchema, type CreateGroupUserInput, type UpdateGroupUserInput } from "@/schemas/group-user.schema"
import type { GroupRole } from "@/types/api/group-role.type"
import type { GroupUser } from "@/types/api/group-user.type"
import type { User } from "@/types/api/user.type"
import { getZodFormErrors, type FormErrors } from "@/utils/form-validation"

type CreateMutation = { mutateAsync: (input: CreateGroupUserInput) => Promise<unknown>; isPending: boolean; reset: () => void }
type UpdateMutation = { mutateAsync: (input: { id: string; input: UpdateGroupUserInput }) => Promise<unknown>; isPending: boolean; reset: () => void }

export function GroupMemberForm({ member, users, roles, createMutation, updateMutation, onClose }: { member: GroupUser | null; users: User[]; roles: GroupRole[]; createMutation: CreateMutation; updateMutation: UpdateMutation; onClose: () => void }) {
  const [errors, setErrors] = useState<FormErrors>({})
  const form = useForm({ defaultValues: { userId: member?.userId ?? "", roleId: member?.roleId ?? "" }, onSubmit: async ({ value }) => {
    const parsed = (member ? updateGroupUserSchema : createGroupUserSchema).safeParse(value)
    if (!parsed.success) return setErrors(getZodFormErrors(parsed.error))
    try {
      if (member) await updateMutation.mutateAsync({ id: member.id, input: parsed.data as UpdateGroupUserInput })
      else await createMutation.mutateAsync(parsed.data as CreateGroupUserInput)
      close()
    } catch (error) {
      const fieldErrors = isAppApiError(error) ? error.fieldErrors : undefined
      setErrors(Object.fromEntries(Object.entries(fieldErrors ?? {}).map(([key, messages]) => [key, messages[0]])))
    }
  } })
  const pending = createMutation.isPending || updateMutation.isPending
  function close() { form.reset(); setErrors({}); createMutation.reset(); updateMutation.reset(); onClose() }
  return <form className="contents" noValidate onSubmit={(event) => { event.preventDefault(); void form.handleSubmit() }}><FieldGroup>
    {!member ? <form.Field name="userId">{(field) => <Field data-invalid={Boolean(errors.userId)}><FieldLabel>Utilisateur</FieldLabel><Select value={field.state.value} onValueChange={(value) => field.handleChange(String(value ?? ""))}><SelectTrigger className="w-full" aria-invalid={Boolean(errors.userId)}><SelectValue placeholder="Sélectionner un utilisateur">{users.find((user) => user.id === field.state.value) ? `${users.find((user) => user.id === field.state.value)?.firstName} ${users.find((user) => user.id === field.state.value)?.lastName}`.trim() : "Sélectionner un utilisateur"}</SelectValue></SelectTrigger><SelectContent>{users.map((user) => <SelectItem key={user.id} value={user.id}>{`${user.firstName} ${user.lastName}`.trim()} — {user.email}</SelectItem>)}</SelectContent></Select><FieldError errors={errors.userId ? [{ message: errors.userId }] : undefined} /></Field>}</form.Field> : null}
    <form.Field name="roleId">{(field) => <Field data-invalid={Boolean(errors.roleId)}><FieldLabel>Rôle dans le groupe</FieldLabel><Select value={field.state.value} onValueChange={(value) => field.handleChange(String(value ?? ""))}><SelectTrigger className="w-full" aria-invalid={Boolean(errors.roleId)}><SelectValue placeholder="Sélectionner un rôle">{roles.find((role) => role.id === field.state.value)?.name ?? "Sélectionner un rôle"}</SelectValue></SelectTrigger><SelectContent>{roles.map((role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}</SelectContent></Select><FieldError errors={errors.roleId ? [{ message: errors.roleId }] : undefined} /></Field>}</form.Field>
  </FieldGroup><DialogFooter><Button type="button" variant="outline" disabled={pending} onClick={close}>Annuler</Button><Button type="submit" disabled={pending}>{pending ? <Spinner /> : null}{member ? "Enregistrer" : "Ajouter le membre"}</Button></DialogFooter></form>
}
