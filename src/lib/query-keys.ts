import type { QueryClient } from "@tanstack/react-query"

import type { AnalyticsFilters } from "@/types/analytics"
import type { ProductFilters, QrFilters } from "@/types/catalog"
import type { ReportFilters, ReportId } from "@/types/reports"

export const queryKeys = {
  session: ["session"] as const,
  dashboard: ["dashboard"] as const,
  options: ["catalog-options"] as const,
  products: (filters: ProductFilters) => ["products", filters] as const,
  product: (id: string) => ["products", "detail", id] as const,
  qrCodes: (filters: QrFilters) => ["qr-codes", filters] as const,
  qrCode: (id: string) => ["qr-codes", "detail", id] as const,
  publicProduct: (code: string) => ["public-product", code] as const,
  analytics: (filters: AnalyticsFilters) => ["analytics", filters] as const,
  report: (id: ReportId, filters: ReportFilters) =>
    ["reports", id, filters] as const,
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
  settings: ["settings"] as const,
}

export function invalidateCatalog(client: QueryClient) {
  void client.invalidateQueries({ queryKey: ["dashboard"] })
  void client.invalidateQueries({ queryKey: ["catalog-options"] })
  void client.invalidateQueries({ queryKey: ["products"] })
  void client.invalidateQueries({ queryKey: ["qr-codes"] })
  void client.invalidateQueries({ queryKey: ["analytics"] })
  void client.invalidateQueries({ queryKey: ["reports"] })
  void client.invalidateQueries({ queryKey: ["public-product"] })
}
