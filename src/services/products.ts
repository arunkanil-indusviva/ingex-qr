import { api } from "@/lib/axios"
import type {
  CatalogOptions,
  Product,
  ProductFilters,
  ProductInput,
  ProductSummary,
  QrDisplayStatus,
} from "@/types/catalog"

export type ProductDetail = Product & {
  qrStatus: QrDisplayStatus
  qrId: string | null
}

export async function listProducts(filters: ProductFilters) {
  const { data } = await api.get<ProductSummary[]>("/products", { params: filters })
  return data
}

export async function getCatalogOptions() {
  const { data } = await api.get<CatalogOptions>("/catalog/options")
  return data
}

export async function getProduct(id: string) {
  const { data } = await api.get<ProductDetail>(`/products/${id}`)
  return data
}

export async function createProduct(input: ProductInput) {
  const { data } = await api.post<ProductDetail>("/products", input)
  return data
}

export async function updateProduct(id: string, input: ProductInput) {
  const { data } = await api.put<ProductDetail>(`/products/${id}`, input)
  return data
}
