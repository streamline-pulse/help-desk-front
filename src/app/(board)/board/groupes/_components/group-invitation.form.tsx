"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { groupInvitationSchema, type GroupInvitationInput } from "@/schemas/group-invitation.schema"
import type { GroupRole } from "@/types/api/group-role.type"
import { getZodFormErrors, type FormErrors } from "@/utils/form-validation"

type Mutation = { mutateAsync: (input: GroupInvitationInput) => Promise<unknown>; isPending: boolean; reset: () => void }

export function GroupInvitationForm({ roles, mutation, onClose }: { roles: GroupRole[]; mutation: Mutation; onClose: () => void }) {
  const [errors, setErrors] = useState<FormErrors>({})
  const form = useForm({ defaultValues: { email: "", roleId: "" }, onSubmit: async ({ value }) => { const parsed = groupInvitationSchema.safeParse(value); if (!parsed.success) return setErrors(getZodFormErrors(parsed.error)); try { await mutation.mutateAsync(parsed.data); close() } catch {} } })
  function close() { form.reset(); setErrors({}); mutation.reset(); onClose() }
  return <form className="contents" noValidate onSubmit={(event) => { event.preventDefault(); void form.handleSubmit() }}><FieldGroup>
    <form.Field name="email">{(field) => <Field data-invalid={Boolean(errors.email)}><FieldLabel htmlFor="invitation-email">Adresse e-mail</FieldLabel><Input id="invitation-email" type="email" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} placeholder="membre@example.com" aria-invalid={Boolean(errors.email)} /><FieldError errors={errors.email ? [{ message: errors.email }] : undefined} /></Field>}</form.Field>
    <form.Field name="roleId">{(field) => <Field data-invalid={Boolean(errors.roleId)}><FieldLabel>Rôle proposé</FieldLabel><Select value={field.state.value} onValueChange={(value) => field.handleChange(String(value ?? ""))}><SelectTrigger className="w-full"><SelectValue placeholder="Sélectionner un rôle">{roles.find((role) => role.id === field.state.value)?.name ?? "Sélectionner un rôle"}</SelectValue></SelectTrigger><SelectContent>{roles.map((role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}</SelectContent></Select><FieldError errors={errors.roleId ? [{ message: errors.roleId }] : undefined} /></Field>}</form.Field>
  </FieldGroup><DialogFooter><Button type="button" variant="outline" disabled={mutation.isPending} onClick={close}>Annuler</Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? <Spinner /> : null}Envoyer l’invitation</Button></DialogFooter></form>
}
