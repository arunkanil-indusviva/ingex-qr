export const reportIds = [
  "products",
  "qr-generation",
  "qr-scans",
  "product-scans",
  "country-scans",
] as const

export type ReportId = (typeof reportIds)[number]

export type ReportFilters = {
  from?: string
  to?: string
  productId?: string
  batch?: string
  country?: string
}

export type ReportColumn = {
  key: string
  label: string
}

export type ReportResult = {
  id: ReportId
  title: string
  columns: ReportColumn[]
  rows: Record<string, string>[]
}
