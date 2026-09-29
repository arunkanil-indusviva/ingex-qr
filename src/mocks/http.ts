import type { AxiosRequestConfig } from "axios"

import { db, type MockUser } from "@/mocks/db"
import type { User } from "@/types/user"

export function toPublicUser(user: MockUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  }
}

export function readJson<T>(data: unknown): T {
  if (typeof data === "string") {
    return JSON.parse(data) as T
  }

  return data as T
}

function readAuthorization(config: AxiosRequestConfig) {
  const headers = config.headers

  if (!headers) {
    return null
  }

  const raw =
    typeof headers.get === "function"
      ? headers.get("Authorization")
      : headers.Authorization
  const header = Array.isArray(raw) ? raw[0] : raw

  if (typeof header !== "string") {
    return null
  }

  return header.replace(/^Bearer\s+/i, "")
}

export function requireUser(config: AxiosRequestConfig) {
  const token = readAuthorization(config)

  if (!token?.startsWith("mock.")) {
    return null
  }

  const id = token.slice("mock.".length)
  return db.users.find((user) => user.id === id) ?? null
}
