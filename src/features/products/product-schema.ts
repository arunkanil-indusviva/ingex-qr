import { z } from "zod"

import type { ProductInput } from "@/types/catalog"

export const productSchema = z.object({
  name: z.string().trim().min(1, { error: "Enter a product name." }),
  code: z.string().trim().min(1, { error: "Enter a product code." }),
  category: z.string().trim().min(1, { error: "Enter a category." }),
  description: z.string(),
  batch: z.string().trim().min(1, { error: "Enter a batch number." }),
  manufacturedOn: z.string().min(1, { error: "Enter a manufacturing date." }),
  expiresOn: z.string().min(1, { error: "Enter an expiry date." }),
  colour: z.string(),
  type: z.string(),
  usageInstructions: z.string(),
  storageInstructions: z.string(),
  safetyInformation: z.string(),
  otherInformation: z.string(),
  status: z.enum(["active", "inactive"]),
  specifications: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ),
})

export type ProductFormValues = z.infer<typeof productSchema>

export const emptyProductForm: ProductFormValues = {
  name: "",
  code: "",
  category: "",
  description: "",
  batch: "",
  manufacturedOn: "",
  expiresOn: "",
  colour: "",
  type: "",
  usageInstructions: "",
  storageInstructions: "",
  safetyInformation: "",
  otherInformation: "",
  status: "active",
  specifications: [{ name: "", value: "" }],
}

export function toProductInput(
  values: ProductFormValues,
  imageUrl: string | null
): ProductInput {
  return { ...values, imageUrl }
}
