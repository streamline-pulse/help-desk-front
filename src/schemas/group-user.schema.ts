import { z } from "zod"

export const createGroupUserSchema = z.object({
  userId: z.string().min(1, "L’utilisateur est requis."),
  roleId: z.string().min(1, "Le rôle est requis."),
})

export const updateGroupUserSchema = z.object({
  roleId: z.string().min(1, "Le rôle est requis."),
})

export type CreateGroupUserInput = z.infer<typeof createGroupUserSchema>
export type UpdateGroupUserInput = z.infer<typeof updateGroupUserSchema>
