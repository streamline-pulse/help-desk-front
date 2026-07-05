export type PermissionPerModule = {
  moduleName: string
  permissions: string[]
}

export type UserRole = {
  id: string
  name: string
  permissionsPerModule?: PermissionPerModule[]
  createdAt?: string | number
  updatedAt?: string | number
}

export type AuthUser = {
  id: string
  email: string | null
  phone: string | null
  indicatif: string | null
  lastName: string
  firstName: string
  active: boolean
  isSuperAdmin: boolean
  emailVerified: boolean
  phoneVerified: boolean
  firstLogin: boolean
  roleId: string
  role?: UserRole
  createdAt?: string | number
  updatedAt?: string | number
}

export type CurrentUserResponse = {
  data: AuthUser
}

export type User = AuthUser
