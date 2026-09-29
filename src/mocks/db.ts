import { prototypeAdmin } from "@/config/prototype"
import type { Activity } from "@/types/dashboard"
import type { Product, QrCode, ScanEvent } from "@/types/catalog"
import type { Settings } from "@/types/settings"
import type { User } from "@/types/user"

export type MockUser = User & {
  password: string
}

const countries = [
  "India",
  "United Arab Emirates",
  "Singapore",
  "Germany",
  "United States",
]

function seedScans(qrId: string, total: number, offset: number): ScanEvent[] {
  const events: ScanEvent[] = []
  const seen = new Set<string>()

  for (let index = 0; index < total; index += 1) {
    const country = countries[(index + offset) % countries.length] ?? "India"
    const day = 1 + ((index + offset) % 28)
    const occurredAt = new Date(
      Date.UTC(2026, 8, day, 4 + (index % 12), index % 60)
    ).toISOString()
    const visitor = `${qrId}:${country}:${index % 5}`
    const unique = !seen.has(visitor)
    seen.add(visitor)
    events.push({
      id: `${qrId}_scan_${index}`,
      qrId,
      occurredAt,
      country,
      unique,
    })
  }

  return events
}

export const db: {
  users: MockUser[]
  products: Product[]
  qrCodes: QrCode[]
  scans: ScanEvent[]
  activity: Activity[]
  settings: Settings
} = {
  settings: {
    companyName: "Ingex",
    qrBaseUrl: "https://qr.ingexlabs.com",
    requireStrongPasswords: true,
    sessionTimeoutMinutes: 30,
    emailOnScan: false,
    emailOnQrGenerated: true,
  },
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
      description: "A general purpose adhesive for carton and label work.",
      batch: "B2026-014",
      manufacturedOn: "2026-02-12",
      expiresOn: "2028-02-12",
      colour: "Clear",
      type: "Cartridge",
      imageUrl: null,
      specifications: [
        { id: "spec_001", name: "Weight", value: "500g" },
        { id: "spec_002", name: "Material", value: "Polymer" },
      ],
      usageInstructions: "Apply to a clean, dry surface and press the parts together.",
      storageInstructions: "Store below 30°C, away from direct sunlight.",
      safetyInformation: "Avoid contact with eyes. Keep out of reach of children.",
      otherInformation: "Certificate of analysis is available for this batch.",
      status: "active",
    },
    {
      id: "prd_014",
      name: "Protective coating",
      code: "ING-014",
      category: "Coatings",
      description: "A coating used to protect packed goods in transit.",
      batch: "B2026-021",
      manufacturedOn: "2026-03-04",
      expiresOn: "2027-09-04",
      colour: "Grey",
      type: "Liquid",
      imageUrl: null,
      specifications: [{ id: "spec_014", name: "Volume", value: "1L" }],
      usageInstructions: "Stir before use and apply a thin, even coat.",
      storageInstructions: "Keep the container sealed.",
      safetyInformation: "Use in a ventilated area.",
      otherInformation: "",
      status: "active",
    },
    {
      id: "prd_108",
      name: "Packing film",
      code: "ING-108",
      category: "Packaging",
      description: "Film used to wrap finished cartons.",
      batch: "B2026-033",
      manufacturedOn: "2026-05-19",
      expiresOn: "2029-05-19",
      colour: "Clear",
      type: "Roll",
      imageUrl: null,
      specifications: [{ id: "spec_108", name: "Width", value: "500mm" }],
      usageInstructions: "Wrap the carton with two overlapping turns.",
      storageInstructions: "Store the roll upright.",
      safetyInformation: "",
      otherInformation: "",
      status: "active",
    },
    {
      id: "prd_220",
      name: "Carton label stock",
      code: "ING-220",
      category: "Packaging",
      description: "Label stock waiting for a QR code.",
      batch: "B2026-040",
      manufacturedOn: "2026-08-01",
      expiresOn: "2028-08-01",
      colour: "White",
      type: "Sheet",
      imageUrl: null,
      specifications: [],
      usageInstructions: "Print and apply to the outer carton.",
      storageInstructions: "Keep flat and dry.",
      safetyInformation: "",
      otherInformation: "",
      status: "active",
    },
    {
      id: "prd_305",
      name: "Retired sealant",
      code: "ING-305",
      category: "Adhesives",
      description: "An inactive product kept so that status is visible.",
      batch: "B2025-118",
      manufacturedOn: "2025-11-02",
      expiresOn: "2026-11-02",
      colour: "White",
      type: "Tube",
      imageUrl: null,
      specifications: [],
      usageInstructions: "",
      storageInstructions: "",
      safetyInformation: "",
      otherInformation: "",
      status: "inactive",
    },
  ],
  qrCodes: [
    {
      id: "qr_001",
      productId: "prd_001",
      url: "https://qr.ingexlabs.com/product/ING-001",
      status: "active",
      createdAt: "2026-02-13T10:15:00.000Z",
    },
    {
      id: "qr_014",
      productId: "prd_014",
      url: "https://qr.ingexlabs.com/product/ING-014",
      status: "active",
      createdAt: "2026-03-05T11:40:00.000Z",
    },
    {
      id: "qr_108",
      productId: "prd_108",
      url: "https://qr.ingexlabs.com/product/ING-108",
      status: "active",
      createdAt: "2026-05-20T08:05:00.000Z",
    },
    {
      id: "qr_305",
      productId: "prd_305",
      url: "https://qr.ingexlabs.com/product/ING-305",
      status: "inactive",
      createdAt: "2025-11-03T14:20:00.000Z",
    },
  ],
  scans: [
    ...seedScans("qr_001", 186, 0),
    ...seedScans("qr_014", 94, 2),
    ...seedScans("qr_108", 41, 4),
    ...seedScans("qr_305", 12, 1),
  ],
  activity: [
    {
      id: "act_001",
      kind: "qr_scanned",
      summary: "ING-001 was scanned.",
      occurredAt: "2026-09-29T04:10:00.000Z",
      productId: "prd_001",
      qrId: "qr_001",
    },
    {
      id: "act_002",
      kind: "product_added",
      summary: "Carton label stock (ING-220) was added.",
      occurredAt: "2026-09-28T11:25:00.000Z",
      productId: "prd_220",
    },
    {
      id: "act_003",
      kind: "qr_generated",
      summary: "A QR was generated for ING-108.",
      occurredAt: "2026-09-27T09:05:00.000Z",
      productId: "prd_108",
      qrId: "qr_108",
    },
    {
      id: "act_004",
      kind: "product_updated",
      summary: "Protective coating (ING-014) was updated.",
      occurredAt: "2026-09-26T16:40:00.000Z",
      productId: "prd_014",
    },
    {
      id: "act_005",
      kind: "qr_scanned",
      summary: "ING-014 was scanned.",
      occurredAt: "2026-09-26T08:15:00.000Z",
      productId: "prd_014",
      qrId: "qr_014",
    },
  ],
}
