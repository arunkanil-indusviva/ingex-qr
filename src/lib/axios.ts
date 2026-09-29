import axios from "axios"

import { env } from "@/config/env"
import { toApiError } from "@/lib/api-error"
import { getAccessToken } from "@/lib/session-storage"

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error))
)
