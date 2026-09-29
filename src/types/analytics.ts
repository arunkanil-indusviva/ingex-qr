export type AnalyticsFilters = {
  from?: string
  to?: string
  productId?: string
  country?: string
  batch?: string
}

export type AnalyticsSummary = {
  totalScans: number
  uniqueScans: number
  activeQrCodes: number
  countries: number
  overTime: { date: string; scans: number }[]
  byCountry: { country: string; scans: number }[]
  byProduct: { product: string; scans: number }[]
}
