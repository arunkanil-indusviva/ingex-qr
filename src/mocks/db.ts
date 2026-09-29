import { prototypeAdmin } from "@/config/prototype"
import type { Activity } from "@/types/dashboard"
import type { Product, QrCode } from "@/types/catalog"
import type { User } from "@/types/user"

export type MockUser = User & {
  password: string
}

export const db: {
  users: MockUser[]
  products: Product[]
  qrCodes: QrCode[]
  activity: Activity[]
} = {
  users: [
    {
      id: "usr_admin",
      name: prototypeAdmin.name,
      email: prototypeAdmin.email,
      password: prototypeAdmin.password,
      role: "administrator",
      status: "active",
      createdAt: "2026-01-08T09:00:00.000Z",
    },
    {
      id: "usr_manager",
      name: "Plant Manager",
      email: "manager@ingexlabs.com",
      password: prototypeAdmin.password,
      role: "manager",
      status: "active",
      createdAt: "2026-03-02T09:00:00.000Z",
    },
    {
      id: "usr_viewer",
      name: "Floor Viewer",
      email: "viewer@ingexlabs.com",
      password: prototypeAdmin.password,
      role: "viewer",
      status: "inactive",
      createdAt: "2026-06-18T09:00:00.000Z",
    },
  ],
  products: [
    {
      id: "prd_001",
      name: "Industrial adhesive",
      code: "ING-001",
      category: "Adhesives",
      batch: "B2026-014",
      status: "active",
      description: "Sample catalogue item for the prototype.",
      manufacturedOn: "2026-02-12",
      expiresOn: "2028-02-12",
    },
    {
      id: "prd_014",
      name: "Protective coating",
      code: "ING-014",
      category: "Coatings",
      batch: "B2026-021",
      status: "active",
      description: "Sample catalogue item for the prototype.",
      manufacturedOn: "2026-03-04",
      expiresOn: "2027-09-04",
    },
    {
      id: "prd_108",
      name: "Packing film",
      code: "ING-108",
      category: "Packaging",
      batch: "B2026-033",
      status: "active",
      description: "Sample catalogue item for the prototype.",
      manufacturedOn: "2026-05-19",
      expiresOn: "2029-05-19",
    },
    {
      id: "prd_220",
      name: "Carton label stock",
      code: "ING-220",
      category: "Packaging",
      batch: "B2026-040",
      status: "active",
      description: "Sample product that does not have a QR yet.",
      manufacturedOn: "2026-08-01",
      expiresOn: "2028-08-01",
    },
    {
      id: "prd_305",
      name: "Retired sealant",
      code: "ING-305",
      category: "Adhesives",
      batch: "B2025-118",
      status: "inactive",
      description: "Sample product kept so inactive status is visible.",
      manufacturedOn: "2025-11-02",
      expiresOn: "2026-11-02",
    },
  ],
  qrCodes: [
    {
      id: "qr_001",
      productId: "prd_001",
      url: "https://qr.ingexlabs.com/product/ING-001",
      status: "active",
      totalScans: 186,
      createdAt: "2026-02-13T10:15:00.000Z",
    },
    {
      id: "qr_014",
      productId: "prd_014",
      url: "https://qr.ingexlabs.com/product/ING-014",
      status: "active",
      totalScans: 94,
      createdAt: "2026-03-05T11:40:00.000Z",
    },
    {
      id: "qr_108",
      productId: "prd_108",
      url: "https://qr.ingexlabs.com/product/ING-108",
      status: "active",
      totalScans: 41,
      createdAt: "2026-05-20T08:05:00.000Z",
    },
    {
      id: "qr_305",
      productId: "prd_305",
      url: "https://qr.ingexlabs.com/product/ING-305",
      status: "inactive",
      totalScans: 12,
      createdAt: "2025-11-03T14:20:00.000Z",
    },
  ],
  activity: [
    {
      id: "act_001",
      kind: "qr_scanned",
      summary: "ING-001 was scanned.",
      occurredAt: "2026-09-29T04:10:00.000Z",
    },
    {
      id: "act_002",
      kind: "product_added",
      summary: "Carton label stock (ING-220) was added.",
      occurredAt: "2026-09-28T11:25:00.000Z",
    },
    {
      id: "act_003",
      kind: "qr_generated",
      summary: "A QR was generated for ING-108.",
      occurredAt: "2026-09-27T09:05:00.000Z",
    },
    {
      id: "act_004",
      kind: "product_updated",
      summary: "Protective coating (ING-014) was updated.",
      occurredAt: "2026-09-26T16:40:00.000Z",
    },
    {
      id: "act_005",
      kind: "qr_scanned",
      summary: "ING-014 was scanned.",
      occurredAt: "2026-09-26T08:15:00.000Z",
    },
  ],
}
