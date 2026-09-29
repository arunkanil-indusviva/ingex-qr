import { api } from "@/lib/axios"
import type { ReportFilters, ReportId, ReportResult } from "@/types/reports"

export async function getReport(id: ReportId, filters: ReportFilters) {
  const { data } = await api.get<ReportResult>(`/reports/${id}`, {
    params: filters,
  })
  return data
}
