import type { DashboardSummary } from "@/types/dashboard"

import { db } from "@/mocks/db"

export function buildDashboardSummary(): DashboardSummary {
  const recentActivity = [...db.activity].sort((left, right) =>
    right.occurredAt.localeCompare(left.occurredAt)
  )

  return {
    totalProducts: db.products.length,
    totalQrCodes: db.qrCodes.length,
    activeProducts: db.products.filter((product) => product.status === "active")
      .length,
    totalScans: db.scans.length,
    recentActivity: recentActivity.slice(0, 6),
  }
}
