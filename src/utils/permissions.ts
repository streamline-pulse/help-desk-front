import type { AuthUser } from "@/types/api/user.type"

export function hasPermission(
  user: AuthUser,
  moduleName: string,
  permission: string
): boolean {
  if (user.isSuperAdmin) {
    return true
  }

  return Boolean(
    user.role?.permissionsPerModule?.some(
      (modulePermission) =>
        modulePermission.moduleName === moduleName &&
        modulePermission.permissions.includes(permission)
    )
  )
}

export function hasAnyPermission(
  user: AuthUser,
  moduleName: string,
  permissions: readonly string[]
): boolean {
  return permissions.some((permission) =>
    hasPermission(user, moduleName, permission)
  )
}
