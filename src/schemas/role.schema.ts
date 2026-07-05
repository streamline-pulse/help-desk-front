import { z } from "zod"

export const roleSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(120),
  permissionsPerModule: z
    .array(
      z.object({
        moduleId: z.string().min(1),
        permissionId: z.string().min(1),
      })
    )
    .default([]),
})

export type RoleInput = z.infer<typeof roleSchema>
