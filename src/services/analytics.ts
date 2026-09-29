import { api } from "@/lib/axios"
import type { AnalyticsFilters, AnalyticsSummary } from "@/types/analytics"

export async function getAnalytics(filters: AnalyticsFilters) {
  const { data } = await api.get<AnalyticsSummary>("/analytics", {
    params: filters,
  })
  return data
}
