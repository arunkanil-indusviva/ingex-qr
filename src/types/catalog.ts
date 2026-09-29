export type ProductStatus = "active" | "inactive"

export type Product = {
  id: string
  name: string
  code: string
  category: string
  batch: string
  status: ProductStatus
  description: string
  manufacturedOn: string
  expiresOn: string
}

export type QrCodeStatus = "active" | "inactive"

export type QrCode = {
  id: string
  productId: string
  url: string
  status: QrCodeStatus
  totalScans: number
  createdAt: string
}
