"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { isAppApiError } from "@/lib/api-error"
import { groupSchema, type GroupInput } from "@/schemas/group.schema"
import type { Group } from "@/types/api/group.type"
import type { GroupType } from "@/types/api/group-type.type"
import type { Town } from "@/types/api/town.type"
import { getZodFormErrors, type FormErrors } from "@/utils/form-validation"

type Mutation<T> = { mutateAsync: (input: T) => Promise<unknown>; isPending: boolean; reset: () => void }
const NONE = "__none__"

export function GroupForm({ group, groups, groupTypes, towns, createMutation, updateMutation, onClose }: {
  group: Group | null
  groups: Group[]
  groupTypes: GroupType[]
  towns: Town[]
  createMutation: Mutation<GroupInput>
  updateMutation: Mutation<{ id: string; input: Partial<GroupInput> }>
  onClose: () => void
}) {
  const [errors, setErrors] = useState<FormErrors>({})
  const form = useForm({
    defaultValues: {
      name: group?.name ?? "",
      description: group?.description ?? "",
      email: group?.email ?? "",
      website: group?.website ?? "",
      parentId: group?.parentId ?? "",
      typeId: group?.typeId ?? "",
      location: {
        placeId: group?.location?.placeId ?? "",
        name: group?.location?.name ?? "",
        lat: group?.location?.lat == null ? "" : String(group.location.lat),
        long: group?.location?.long == null ? "" : String(group.location.long),
        townSlug: group?.location?.town?.slug ?? "",
      },
    },
    onSubmit: async ({ value }) => {
      const parsed = groupSchema.safeParse(value)
      if (!parsed.success) return setErrors(getZodFormErrors(parsed.error))
      const input = {
        ...parsed.data,
        description: parsed.data.description || undefined,
        email: parsed.data.email || undefined,
        website: parsed.data.website || undefined,
        parentId: parsed.data.parentId || undefined,
        typeId: parsed.data.typeId || undefined,
        location: Object.values(parsed.data.location ?? {}).some(Boolean) ? parsed.data.location : undefined,
      }
      try {
        if (group) await updateMutation.mutateAsync({ id: group.id, input })
        else await createMutation.mutateAsync(input)
        close()
      } catch (error) {
        const fieldErrors = isAppApiError(error) ? error.fieldErrors : undefined
        setErrors(Object.fromEntries(Object.entries(fieldErrors ?? {}).map(([key, messages]) => [key, messages[0]])))
      }
    },
  })
  const pending = createMutation.isPending || updateMutation.isPending
  function close() { form.reset(); setErrors({}); createMutation.reset(); updateMutation.reset(); onClose() }

  return (
    <form className="contents" noValidate onSubmit={(event) => { event.preventDefault(); void form.handleSubmit() }}>
      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <form.Field name="name">{(field) => <Field className="sm:col-span-2" data-invalid={Boolean(errors.name)}><FieldLabel htmlFor="group-name">Nom</FieldLabel><Input id="group-name" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} placeholder="Support Lomé" aria-invalid={Boolean(errors.name)} /><FieldError errors={errors.name ? [{ message: errors.name }] : undefined} /></Field>}</form.Field>
        <form.Field name="typeId">{(field) => <Field><FieldLabel>Type</FieldLabel><Select value={field.state.value || NONE} onValueChange={(value) => field.handleChange(value === NONE ? "" : String(value))}><SelectTrigger className="w-full"><SelectValue>{groupTypes.find((item) => item.id === field.state.value)?.name ?? "Aucun type"}</SelectValue></SelectTrigger><SelectContent><SelectItem value={NONE}>Aucun type</SelectItem>{groupTypes.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></Field>}</form.Field>
        <form.Field name="parentId">{(field) => <Field><FieldLabel>Groupe parent</FieldLabel><Select value={field.state.value || NONE} onValueChange={(value) => field.handleChange(value === NONE ? "" : String(value))}><SelectTrigger className="w-full"><SelectValue>{groups.find((item) => item.id === field.state.value)?.name ?? "Aucun parent"}</SelectValue></SelectTrigger><SelectContent><SelectItem value={NONE}>Aucun parent</SelectItem>{groups.filter((item) => item.id !== group?.id).map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></Field>}</form.Field>
        <form.Field name="email">{(field) => <Field data-invalid={Boolean(errors.email)}><FieldLabel htmlFor="group-email">Adresse e-mail</FieldLabel><Input id="group-email" type="email" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} placeholder="support@example.com" aria-invalid={Boolean(errors.email)} /><FieldError errors={errors.email ? [{ message: errors.email }] : undefined} /></Field>}</form.Field>
        <form.Field name="website">{(field) => <Field data-invalid={Boolean(errors.website)}><FieldLabel htmlFor="group-website">Site web</FieldLabel><Input id="group-website" type="url" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} placeholder="https://example.com" aria-invalid={Boolean(errors.website)} /><FieldError errors={errors.website ? [{ message: errors.website }] : undefined} /></Field>}</form.Field>
        <form.Field name="description">{(field) => <Field className="sm:col-span-2"><FieldLabel htmlFor="group-description">Description</FieldLabel><Textarea id="group-description" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} placeholder="Mission et périmètre du groupe" /></Field>}</form.Field>
        <form.Field name="location.townSlug">{(field) => <Field><FieldLabel>Ville</FieldLabel><Select value={field.state.value || NONE} onValueChange={(value) => field.handleChange(value === NONE ? "" : String(value))}><SelectTrigger className="w-full"><SelectValue>{towns.find((item) => item.slug === field.state.value)?.name ?? "Aucune ville"}</SelectValue></SelectTrigger><SelectContent><SelectItem value={NONE}>Aucune ville</SelectItem>{towns.map((item) => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}</SelectContent></Select></Field>}</form.Field>
        <form.Field name="location.name">{(field) => <Field><FieldLabel htmlFor="group-address">Adresse</FieldLabel><Input id="group-address" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} placeholder="Boulevard du 13 Janvier" /></Field>}</form.Field>
        <form.Field name="location.lat">{(field) => <Field><FieldLabel htmlFor="group-lat">Latitude</FieldLabel><Input id="group-lat" inputMode="decimal" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} placeholder="6.1256" /></Field>}</form.Field>
        <form.Field name="location.long">{(field) => <Field><FieldLabel htmlFor="group-long">Longitude</FieldLabel><Input id="group-long" inputMode="decimal" value={field.state.value} onChange={(event) => field.handleChange(event.target.value)} placeholder="1.2254" /></Field>}</form.Field>
      </FieldGroup>
      <DialogFooter><Button type="button" variant="outline" disabled={pending} onClick={close}>Annuler</Button><Button type="submit" disabled={pending}>{pending ? <Spinner /> : null}{group ? "Enregistrer" : "Créer le groupe"}</Button></DialogFooter>
    </form>
  )
}
