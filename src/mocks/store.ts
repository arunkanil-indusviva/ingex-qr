import type { Activity, ActivityKind } from "@/types/dashboard"
import type {
  CatalogOptions,
  Product,
  ProductFilters,
  ProductInput,
  ProductSummary,
  QrCode,
  QrDisplayStatus,
  QrFilters,
  QrSummary,
  ScanEvent,
} from "@/types/catalog"
import type { AnalyticsFilters, AnalyticsSummary } from "@/types/analytics"
import type { ReportFilters, ReportId, ReportResult } from "@/types/reports"
import type { Settings } from "@/types/settings"
import type { UserInput, UserRole, UserStatus } from "@/types/user"

import { db } from "@/mocks/db"
import { nextId } from "@/mocks/ids"
import { toPublicUser } from "@/mocks/http"

export class MockError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "MockError"
    this.status = status
  }
}

const reportTitles: Record<ReportId, string> = {
  products: "Product report",
  "qr-generation": "QR generation report",
  "qr-scans": "QR scan report",
  "product-scans": "Product-wise scan report",
  "country-scans": "Country-wise scan report",
}

function includes(value: string, query: string) {
  return value.toLowerCase().includes(query.trim().toLowerCase())
}

function blank(value: string | undefined) {
  return value === undefined || value === "" || value === "all"
}

function qrForProduct(productId: string) {
  return db.qrCodes.find((qrCode) => qrCode.productId === productId) ?? null
}

function scansFor(qrId: string) {
  return db.scans.filter((scan) => scan.qrId === qrId)
}

function displayStatus(qrCode: QrCode | null): QrDisplayStatus {
  if (!qrCode) {
    return "pending"
  }

  return qrCode.status === "active" ? "generated" : "inactive"
}

function productQrUrl(code: string) {
  const base = db.settings.qrBaseUrl.replace(/\/$/, "")
  return `${base}/product/${code}`
}

function pushActivity(
  kind: ActivityKind,
  summary: string,
  links: { productId?: string; qrId?: string }
) {
  const activity: Activity = {
    id: nextId("act"),
    kind,
    summary,
    occurredAt: new Date().toISOString(),
    ...links,
  }
  db.activity.unshift(activity)
}

function cleanSpecs(specifications: ProductInput["specifications"]) {
  return specifications
    .map((specification) => ({
      name: specification.name.trim(),
      value: specification.value.trim(),
    }))
    .filter((specification) => specification.name || specification.value)
    .map((specification) => ({
      id: nextId("spec"),
      ...specification,
    }))
}

function assertUniqueCode(code: string, ignoreId?: string) {
  const taken = db.products.some(
    (product) =>
      product.id !== ignoreId &&
      product.code.toLowerCase() === code.trim().toLowerCase()
  )

  if (taken) {
    throw new MockError(409, "That product code is already in use.")
  }
}

function applyProduct(product: Product, input: ProductInput) {
  assertUniqueCode(input.code, product.id)
  product.name = input.name.trim()
  product.code = input.code.trim()
  product.category = input.category.trim()
  product.description = input.description.trim()
  product.batch = input.batch.trim()
  product.manufacturedOn = input.manufacturedOn
  product.expiresOn = input.expiresOn
  product.colour = input.colour.trim()
  product.type = input.type.trim()
  product.imageUrl = input.imageUrl
  product.specifications = cleanSpecs(input.specifications)
  product.usageInstructions = input.usageInstructions.trim()
  product.storageInstructions = input.storageInstructions.trim()
  product.safetyInformation = input.safetyInformation.trim()
  product.otherInformation = input.otherInformation.trim()
  product.status = input.status

  const qrCode = qrForProduct(product.id)
  if (qrCode) {
    qrCode.url = productQrUrl(product.code)
  }
}

function toSummary(product: Product): ProductSummary {
  const qrCode = qrForProduct(product.id)
  return {
    id: product.id,
    name: product.name,
    code: product.code,
    batch: product.batch,
    category: product.category,
    status: product.status,
    qrStatus: displayStatus(qrCode),
    qrId: qrCode?.id ?? null,
  }
}

function toQrSummary(qrCode: QrCode): QrSummary {
  const product = db.products.find((item) => item.id === qrCode.productId)
  return {
    id: qrCode.id,
    productId: qrCode.productId,
    productName: product?.name ?? "Unknown product",
    productCode: product?.code ?? "",
    batch: product?.batch ?? "",
    productStatus: product?.status ?? "inactive",
    url: qrCode.url,
    status: qrCode.status,
    totalScans: scansFor(qrCode.id).length,
    createdAt: qrCode.createdAt,
  }
}

function inDateRange(value: string, from?: string, to?: string) {
  const day = value.slice(0, 10)
  if (!blank(from) && day < (from ?? "")) {
    return false
  }
  if (!blank(to) && day > (to ?? "")) {
    return false
  }
  return true
}

export function listProducts(filters: ProductFilters) {
  return db.products
    .map(toSummary)
    .filter((product) => {
      if (!blank(filters.search)) {
        const query = filters.search ?? ""
        const matches =
          includes(product.name, query) ||
          includes(product.code, query) ||
          includes(product.batch, query)
        if (!matches) {
          return false
        }
      }
      if (!blank(filters.category) && product.category !== filters.category) {
        return false
      }
      if (!blank(filters.status) && product.status !== filters.status) {
        return false
      }
      if (!blank(filters.batch) && product.batch !== filters.batch) {
        return false
      }
      if (!blank(filters.qrStatus) && product.qrStatus !== filters.qrStatus) {
        return false
      }
      return true
    })
    .sort((left, right) => left.name.localeCompare(right.name))
}

export function getProduct(id: string) {
  const product = db.products.find((item) => item.id === id)
  if (!product) {
    throw new MockError(404, "That product was not found.")
  }
  const summary = toSummary(product)
  return { ...product, qrStatus: summary.qrStatus, qrId: summary.qrId }
}

export function createProduct(input: ProductInput) {
  assertUniqueCode(input.code)
  const product: Product = {
    id: nextId("prd"),
    name: "",
    code: "",
    category: "",
    description: "",
    batch: "",
    manufacturedOn: "",
    expiresOn: "",
    colour: "",
    type: "",
    imageUrl: null,
    specifications: [],
    usageInstructions: "",
    storageInstructions: "",
    safetyInformation: "",
    otherInformation: "",
    status: "active",
  }
  applyProduct(product, input)
  db.products.unshift(product)
  pushActivity(
    "product_added",
    `${product.name} (${product.code}) was added.`,
    { productId: product.id }
  )
  return getProduct(product.id)
}

export function updateProduct(id: string, input: ProductInput) {
  const product = db.products.find((item) => item.id === id)
  if (!product) {
    throw new MockError(404, "That product was not found.")
  }
  applyProduct(product, input)
  pushActivity(
    "product_updated",
    `${product.name} (${product.code}) was updated.`,
    { productId: product.id }
  )
  return getProduct(product.id)
}

export function listQrCodes(filters: QrFilters) {
  return db.qrCodes
    .map(toQrSummary)
    .filter((qrCode) => {
      if (!blank(filters.search)) {
        const query = filters.search ?? ""
        const matches =
          includes(qrCode.id, query) ||
          includes(qrCode.productCode, query) ||
          includes(qrCode.productName, query) ||
          includes(qrCode.batch, query)
        if (!matches) {
          return false
        }
      }
      if (!blank(filters.productId) && qrCode.productId !== filters.productId) {
        return false
      }
      if (!inDateRange(qrCode.createdAt, filters.from, filters.to)) {
        return false
      }
      return true
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
}

export function getQrCode(id: string) {
  const qrCode = db.qrCodes.find((item) => item.id === id)
  if (!qrCode) {
    throw new MockError(404, "That QR code was not found.")
  }
  return toQrSummary(qrCode)
}

export function generateQr(productId: string) {
  const product = db.products.find((item) => item.id === productId)
  if (!product) {
    throw new MockError(404, "That product was not found.")
  }

  const existing = qrForProduct(product.id)
  if (existing) {
    if (existing.status === "inactive") {
      existing.status = "active"
      existing.url = productQrUrl(product.code)
      pushActivity("qr_generated", `A QR was generated for ${product.code}.`, {
        productId: product.id,
        qrId: existing.id,
      })
    }
    return getQrCode(existing.id)
  }

  const created: QrCode = {
    id: nextId("qr"),
    productId: product.id,
    url: productQrUrl(product.code),
    status: "active",
    createdAt: new Date().toISOString(),
  }
  db.qrCodes.unshift(created)
  pushActivity("qr_generated", `A QR was generated for ${product.code}.`, {
    productId: product.id,
    qrId: created.id,
  })
  return getQrCode(created.id)
}

export function deactivateQr(id: string) {
  const qrCode = db.qrCodes.find((item) => item.id === id)
  if (!qrCode) {
    throw new MockError(404, "That QR code was not found.")
  }
  qrCode.status = "inactive"
  const product = db.products.find((item) => item.id === qrCode.productId)
  pushActivity("qr_deactivated", `The QR for ${product?.code ?? "a product"} was deactivated.`, {
    productId: qrCode.productId,
    qrId: qrCode.id,
  })
  return getQrCode(qrCode.id)
}

function recordScan(qrCode: QrCode) {
  const latest = [...scansFor(qrCode.id)].sort((left, right) =>
    right.occurredAt.localeCompare(left.occurredAt)
  )[0]
  if (latest) {
    const elapsed = Date.now() - new Date(latest.occurredAt).getTime()
    if (elapsed < 2000) {
      return
    }
  }

  const country = "India"
  const recentVisitor = scansFor(qrCode.id).some(
    (scan) =>
      scan.country === country &&
      Date.now() - new Date(scan.occurredAt).getTime() < 60 * 60 * 1000
  )
  const scan: ScanEvent = {
    id: nextId("scan"),
    qrId: qrCode.id,
    occurredAt: new Date().toISOString(),
    country,
    unique: !recentVisitor,
  }
  db.scans.push(scan)
  const product = db.products.find((item) => item.id === qrCode.productId)
  pushActivity("qr_scanned", `${product?.code ?? "A product"} was scanned.`, {
    productId: qrCode.productId,
    qrId: qrCode.id,
  })
}

export function getPublicProduct(code: string, record = false) {
  const product = db.products.find(
    (item) => item.code.toLowerCase() === code.toLowerCase()
  )
  if (!product) {
    throw new MockError(404, "That product was not found.")
  }

  const qrCode = qrForProduct(product.id)
  const verified = product.status === "active" && qrCode?.status === "active"
  if (record && qrCode && verified) {
    recordScan(qrCode)
  }

  return {
    code: product.code,
    name: product.name,
    batch: product.batch,
    category: product.category,
    description: product.description,
    manufacturedOn: product.manufacturedOn,
    expiresOn: product.expiresOn,
    colour: product.colour,
    type: product.type,
    imageUrl: product.imageUrl,
    specifications: product.specifications,
    usageInstructions: product.usageInstructions,
    storageInstructions: product.storageInstructions,
    safetyInformation: product.safetyInformation,
    otherInformation: product.otherInformation,
    companyName: db.settings.companyName,
    verified,
  }
}

function matchingScans(filters: AnalyticsFilters | ReportFilters) {
  return db.scans.filter((scan) => {
    const qrCode = db.qrCodes.find((item) => item.id === scan.qrId)
    const product = db.products.find((item) => item.id === qrCode?.productId)
    if (!qrCode || !product) {
      return false
    }
    if (!blank(filters.productId) && product.id !== filters.productId) {
      return false
    }
    if (!blank(filters.batch) && product.batch !== filters.batch) {
      return false
    }
    if ("country" in filters && !blank(filters.country) && scan.country !== filters.country) {
      return false
    }
    if (!inDateRange(scan.occurredAt, filters.from, filters.to)) {
      return false
    }
    return true
  })
}

export function getAnalytics(filters: AnalyticsFilters): AnalyticsSummary {
  const scans = matchingScans(filters)
  const overTime = new Map<string, number>()
  const byCountry = new Map<string, number>()
  const byProduct = new Map<string, number>()

  for (const scan of scans) {
    const day = scan.occurredAt.slice(0, 10)
    overTime.set(day, (overTime.get(day) ?? 0) + 1)
    byCountry.set(scan.country, (byCountry.get(scan.country) ?? 0) + 1)
    const qrCode = db.qrCodes.find((item) => item.id === scan.qrId)
    const product = db.products.find((item) => item.id === qrCode?.productId)
    const label = product ? `${product.name}` : "Unknown"
    byProduct.set(label, (byProduct.get(label) ?? 0) + 1)
  }

  const activeQrCodes = db.qrCodes.filter((qrCode) => {
    if (qrCode.status !== "active") {
      return false
    }
    const product = db.products.find((item) => item.id === qrCode.productId)
    if (!product) {
      return false
    }
    if (!blank(filters.productId) && product.id !== filters.productId) {
      return false
    }
    if (!blank(filters.batch) && product.batch !== filters.batch) {
      return false
    }
    return true
  }).length

  return {
    totalScans: scans.length,
    uniqueScans: scans.filter((scan) => scan.unique).length,
    activeQrCodes,
    countries: byCountry.size,
    overTime: [...overTime.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([date, count]) => ({ date, scans: count })),
    byCountry: [...byCountry.entries()]
      .sort((left, right) => right[1] - left[1])
      .map(([country, count]) => ({ country, scans: count })),
    byProduct: [...byProduct.entries()]
      .sort((left, right) => right[1] - left[1])
      .map(([product, count]) => ({ product, scans: count })),
  }
}

function productRows(filters: ReportFilters) {
  return db.products.filter((product) => {
    if (!blank(filters.productId) && product.id !== filters.productId) {
      return false
    }
    if (!blank(filters.batch) && product.batch !== filters.batch) {
      return false
    }
    return true
  })
}

export function getReport(id: ReportId, filters: ReportFilters): ReportResult {
  if (id === "products") {
    return {
      id,
      title: reportTitles[id],
      columns: [
        { key: "name", label: "Product" },
        { key: "code", label: "Code" },
        { key: "batch", label: "Batch" },
        { key: "status", label: "Status" },
        { key: "qrStatus", label: "QR status" },
      ],
      rows: productRows(filters).map((product) => {
        const summary = toSummary(product)
        return {
          name: product.name,
          code: product.code,
          batch: product.batch,
          status: product.status,
          qrStatus: summary.qrStatus,
        }
      }),
    }
  }

  if (id === "qr-generation") {
    return {
      id,
      title: reportTitles[id],
      columns: [
        { key: "id", label: "QR ID" },
        { key: "product", label: "Product" },
        { key: "code", label: "Code" },
        { key: "batch", label: "Batch" },
        { key: "created", label: "Created" },
        { key: "status", label: "Status" },
      ],
      rows: listQrCodes({
        productId: filters.productId,
        from: filters.from,
        to: filters.to,
      })
        .filter((qrCode) => blank(filters.batch) || qrCode.batch === filters.batch)
        .map((qrCode) => ({
          id: qrCode.id,
          product: qrCode.productName,
          code: qrCode.productCode,
          batch: qrCode.batch,
          created: qrCode.createdAt,
          status: qrCode.status,
        })),
    }
  }

  const scans = matchingScans(filters).sort((left, right) =>
    right.occurredAt.localeCompare(left.occurredAt)
  )

  if (id === "qr-scans") {
    return {
      id,
      title: reportTitles[id],
      columns: [
        { key: "when", label: "When" },
        { key: "product", label: "Product" },
        { key: "code", label: "Code" },
        { key: "country", label: "Country" },
        { key: "unique", label: "Unique" },
      ],
      rows: scans.map((scan) => {
        const qrCode = db.qrCodes.find((item) => item.id === scan.qrId)
        const product = db.products.find((item) => item.id === qrCode?.productId)
        return {
          when: scan.occurredAt,
          product: product?.name ?? "",
          code: product?.code ?? "",
          country: scan.country,
          unique: scan.unique ? "Yes" : "No",
        }
      }),
    }
  }

  if (id === "product-scans") {
    const grouped = new Map<string, { product: string; code: string; scans: number; unique: number }>()
    for (const scan of scans) {
      const qrCode = db.qrCodes.find((item) => item.id === scan.qrId)
      const product = db.products.find((item) => item.id === qrCode?.productId)
      const key = product?.id ?? "unknown"
      const current = grouped.get(key) ?? {
        product: product?.name ?? "Unknown",
        code: product?.code ?? "",
        scans: 0,
        unique: 0,
      }
      current.scans += 1
      if (scan.unique) {
        current.unique += 1
      }
      grouped.set(key, current)
    }
    return {
      id,
      title: reportTitles[id],
      columns: [
        { key: "product", label: "Product" },
        { key: "code", label: "Code" },
        { key: "scans", label: "Scans" },
        { key: "unique", label: "Unique scans" },
      ],
      rows: [...grouped.values()].map((row) => ({
        product: row.product,
        code: row.code,
        scans: String(row.scans),
        unique: String(row.unique),
      })),
    }
  }

  const countries = new Map<string, { scans: number; unique: number }>()
  for (const scan of scans) {
    const current = countries.get(scan.country) ?? { scans: 0, unique: 0 }
    current.scans += 1
    if (scan.unique) {
      current.unique += 1
    }
    countries.set(scan.country, current)
  }

  return {
    id,
    title: reportTitles["country-scans"],
    columns: [
      { key: "country", label: "Country" },
      { key: "scans", label: "Scans" },
      { key: "unique", label: "Unique scans" },
    ],
    rows: [...countries.entries()].map(([country, counts]) => ({
      country,
      scans: String(counts.scans),
      unique: String(counts.unique),
    })),
  }
}

export function catalogOptions(): CatalogOptions {
  return {
    categories: [...new Set(db.products.map((product) => product.category))].sort(),
    batches: [...new Set(db.products.map((product) => product.batch))].sort(),
    countries: [
      ...new Set(db.scans.map((scan) => scan.country)),
    ].sort(),
    products: db.products
      .map((product) => ({
        id: product.id,
        name: product.name,
        code: product.code,
      }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  }
}

export function listUsers() {
  return db.users.map(toPublicUser)
}

export function getUser(id: string) {
  const user = db.users.find((item) => item.id === id)
  if (!user) {
    throw new MockError(404, "That user was not found.")
  }
  return toPublicUser(user)
}

function assertUniqueEmail(email: string, ignoreId?: string) {
  const taken = db.users.some(
    (user) =>
      user.id !== ignoreId && user.email.toLowerCase() === email.trim().toLowerCase()
  )
  if (taken) {
    throw new MockError(409, "That email is already in use.")
  }
}

function assertRole(role: string): UserRole {
  if (role === "administrator" || role === "manager" || role === "viewer") {
    return role
  }
  throw new MockError(400, "Choose a valid role.")
}

function assertStatus(status: string): UserStatus {
  if (status === "active" || status === "inactive") {
    return status
  }
  throw new MockError(400, "Choose a valid status.")
}

export function createUser(input: UserInput) {
  assertUniqueEmail(input.email)
  if (!input.password.trim()) {
    throw new MockError(400, "Enter a password.")
  }
  const user = {
    id: nextId("usr"),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
    role: assertRole(input.role),
    status: assertStatus(input.status),
    createdAt: new Date().toISOString(),
  }
  db.users.push(user)
  return toPublicUser(user)
}

export function updateUser(id: string, input: UserInput) {
  const user = db.users.find((item) => item.id === id)
  if (!user) {
    throw new MockError(404, "That user was not found.")
  }
  assertUniqueEmail(input.email, id)
  user.name = input.name.trim()
  user.email = input.email.trim().toLowerCase()
  user.role = assertRole(input.role)
  user.status = assertStatus(input.status)
  if (input.password.trim()) {
    user.password = input.password
  }
  return toPublicUser(user)
}

export function deactivateUser(id: string) {
  const user = db.users.find((item) => item.id === id)
  if (!user) {
    throw new MockError(404, "That user was not found.")
  }
  user.status = "inactive"
  return toPublicUser(user)
}

export function getSettings(): Settings {
  return { ...db.settings }
}

export function updateSettings(input: Settings) {
  if (!input.companyName.trim()) {
    throw new MockError(400, "Enter a company name.")
  }
  if (!input.qrBaseUrl.trim()) {
    throw new MockError(400, "Enter the QR base URL.")
  }
  db.settings = {
    companyName: input.companyName.trim(),
    qrBaseUrl: input.qrBaseUrl.trim().replace(/\/$/, ""),
    requireStrongPasswords: input.requireStrongPasswords,
    sessionTimeoutMinutes: input.sessionTimeoutMinutes,
    emailOnScan: input.emailOnScan,
    emailOnQrGenerated: input.emailOnQrGenerated,
  }
  for (const qrCode of db.qrCodes) {
    const product = db.products.find((item) => item.id === qrCode.productId)
    if (product) {
      qrCode.url = productQrUrl(product.code)
    }
  }
  return getSettings()
}

export function isReportId(value: string): value is ReportId {
  return (
    value === "products" ||
    value === "qr-generation" ||
    value === "qr-scans" ||
    value === "product-scans" ||
    value === "country-scans"
  )
}
