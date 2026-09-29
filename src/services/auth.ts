import { api } from "@/lib/axios"
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/session-storage"
import { isApiError } from "@/lib/api-error"
import type { LoginInput, LoginResult } from "@/types/auth"
import type { User } from "@/types/user"

export async function login(input: LoginInput) {
  const { data } = await api.post<LoginResult>("/auth/login", input)
  setAccessToken(data.token)
  return data
}

export async function getSession(): Promise<User | null> {
  if (!getAccessToken()) {
    return null
  }

  try {
    const { data } = await api.get<User>("/auth/me")
    return data
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      clearAccessToken()
      return null
    }

    throw error
  }
}

export async function logout() {
  try {
    await api.post("/auth/logout")
  } finally {
    clearAccessToken()
  }
}
