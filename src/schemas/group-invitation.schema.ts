import { z } from "zod"

export const groupInvitationSchema = z.object({
  email: z.email("Adresse e-mail invalide."),
  roleId: z.string().min(1, "Le rôle est requis."),
})

export const generateGroupInvitationSchema = z.object({
  roleId: z.string().min(1, "Le rôle est requis."),
})

export const acceptGroupInvitationSchema = z.object({
  invitationToken: z.string().trim().min(1, "Le jeton d’invitation est requis."),
})

export type GroupInvitationInput = z.infer<typeof groupInvitationSchema>
export type GenerateGroupInvitationInput = z.infer<typeof generateGroupInvitationSchema>
export type AcceptGroupInvitationInput = z.infer<typeof acceptGroupInvitationSchema>
