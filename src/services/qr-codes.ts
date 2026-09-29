import { api } from "@/lib/axios"
import type { QrFilters, QrSummary } from "@/types/catalog"

export async function listQrCodes(filters: QrFilters) {
  const { data } = await api.get<QrSummary[]>("/qr-codes", { params: filters })
  return data
}

export async function getQrCode(id: string) {
  const { data } = await api.get<QrSummary>(`/qr-codes/${id}`)
  return data
}

export async function generateQr(productId: string) {
  const { data } = await api.post<QrSummary>(`/products/${productId}/qr`)
  return data
}

export async function deactivateQr(id: string) {
  const { data } = await api.post<QrSummary>(`/qr-codes/${id}/deactivate`)
  return data
}
