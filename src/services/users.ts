import { api } from "@/lib/axios"
import type { User, UserInput } from "@/types/user"

export async function listUsers() {
  const { data } = await api.get<User[]>("/users")
  return data
}

export async function getUser(id: string) {
  const { data } = await api.get<User>(`/users/${id}`)
  return data
}

export async function createUser(input: UserInput) {
  const { data } = await api.post<User>("/users", input)
  return data
}

export async function updateUser(id: string, input: UserInput) {
  const { data } = await api.put<User>(`/users/${id}`, input)
  return data
}

export async function deactivateUser(id: string) {
  const { data } = await api.post<User>(`/users/${id}/deactivate`)
  return data
}
