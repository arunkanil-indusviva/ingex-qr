import { api } from "@/lib/axios"
import type { DashboardSummary } from "@/types/dashboard"

export async function getDashboard() {
  const { data } = await api.get<DashboardSummary>("/dashboard")
  return data
}
