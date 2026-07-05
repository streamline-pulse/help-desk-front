import { z } from "zod"

export const permissionSchema = z.object({
  name: z.string().trim().min(1, "Le code est requis.").max(120),
  label: z.string().trim().min(1, "Le libellé est requis.").max(120),
})

export type PermissionInput = z.infer<typeof permissionSchema>
