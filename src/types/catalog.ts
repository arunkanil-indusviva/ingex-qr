export type ProductStatus = "active" | "inactive"

export type QrCodeStatus = "active" | "inactive"

export type QrDisplayStatus = "generated" | "pending" | "inactive"

export type Specification = {
  id: string
  name: string
  value: string
}

export type Product = {
  id: string
  name: string
  code: string
  category: string
  description: string
  batch: string
  manufacturedOn: string
  expiresOn: string
  colour: string
  type: string
  imageUrl: string | null
  specifications: Specification[]
  usageInstructions: string
  storageInstructions: string
  safetyInformation: string
  otherInformation: string
  status: ProductStatus
}

export type ProductInput = Omit<Product, "id" | "specifications"> & {
  specifications: { name: string; value: string }[]
}

export type ProductSummary = {
  id: string
  name: string
  code: string
  batch: string
  category: string
  status: ProductStatus
  qrStatus: QrDisplayStatus
  qrId: string | null
}

export type ProductFilters = {
  search?: string
  category?: string
  status?: string
  batch?: string
  qrStatus?: string
}

export type QrCode = {
  id: string
  productId: string
  url: string
  status: QrCodeStatus
  createdAt: string
}

export type QrSummary = {
  id: string
  productId: string
  productName: string
  productCode: string
  batch: string
  productStatus: ProductStatus
  url: string
  status: QrCodeStatus
  totalScans: number
  createdAt: string
}

export type QrFilters = {
  search?: string
  productId?: string
  from?: string
  to?: string
}

export type ScanEvent = {
  id: string
  qrId: string
  occurredAt: string
  country: string
  unique: boolean
}

export type CatalogOptions = {
  categories: string[]
  batches: string[]
  countries: string[]
  products: { id: string; name: string; code: string }[]
}
