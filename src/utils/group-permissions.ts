import type {
  GroupCurrentUser,
  GroupUserRolePermissionSummary,
} from "@/types/api/group-user.type"

function normalizePermissions(user: GroupCurrentUser | null | undefined) {
  return user?.role.permissionsPerModule ?? []
}

export function hasGroupPermission(
  user: GroupCurrentUser | null | undefined,
  moduleName: string,
  permission: string
) {
  return normalizePermissions(user).some(
    (entry: GroupUserRolePermissionSummary) =>
      entry.moduleName === moduleName &&
      entry.permissions.includes(permission)
  )
}
