export const activityKinds = [
  "product_added",
  "product_updated",
  "qr_generated",
  "qr_deactivated",
  "qr_scanned",
] as const

export type ActivityKind = (typeof activityKinds)[number]

export type Activity = {
  id: string
  kind: ActivityKind
  summary: string
  occurredAt: string
  productId?: string
  qrId?: string
}

export type DashboardSummary = {
  totalProducts: number
  totalQrCodes: number
  activeProducts: number
  totalScans: number
  recentActivity: Activity[]
}
