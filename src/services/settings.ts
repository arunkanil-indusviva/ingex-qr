import { api } from "@/lib/axios"
import type { Settings } from "@/types/settings"

export async function getSettings() {
  const { data } = await api.get<Settings>("/settings")
  return data
}

export async function updateSettings(input: Settings) {
  const { data } = await api.put<Settings>("/settings", input)
  return data
}
