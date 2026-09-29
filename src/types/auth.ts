import type { User } from "@/types/user"

export type LoginInput = {
  email: string
  password: string
}

export type LoginResult = {
  token: string
  user: User
}
