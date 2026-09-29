export const userRoles = ["administrator", "manager", "viewer"] as const

export type UserRole = (typeof userRoles)[number]

export type UserStatus = "active" | "inactive"

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export type UserInput = {
  name: string
  email: string
  role: UserRole
  status: UserStatus
  password: string
}
