import { api } from "@/lib/axios"
import type { Specification } from "@/types/catalog"

export type PublicProduct = {
  code: string
  name: string
  batch: string
  category: string
  description: string
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
  companyName: string
  verified: boolean
}

export async function getPublicProduct(code: string, recordScan = false) {
  const { data } = await api.get<PublicProduct>(
    `/public/products/${encodeURIComponent(code)}`,
    { params: recordScan ? { scan: "1" } : undefined }
  )
  return data
}
