import type { AxiosRequestConfig } from "axios"
import type MockAdapter from "axios-mock-adapter"

import { requireUser } from "@/mocks/http"
import { readJson } from "@/mocks/http"
import {
  MockError,
  catalogOptions,
  createProduct,
  createUser,
  deactivateQr,
  deactivateUser,
  generateQr,
  getAnalytics,
  getProduct,
  getPublicProduct,
  getQrCode,
  getReport,
  getSettings,
  getUser,
  isReportId,
  listProducts,
  listQrCodes,
  listUsers,
  updateProduct,
  updateSettings,
  updateUser,
} from "@/mocks/store"
import type { AnalyticsFilters } from "@/types/analytics"
import type { ProductFilters, ProductInput, QrFilters } from "@/types/catalog"
import type { ReportFilters } from "@/types/reports"
import type { Settings } from "@/types/settings"
import type { UserInput } from "@/types/user"

type Reply = [number, unknown]

function params(config: AxiosRequestConfig) {
  return (config.params ?? {}) as Record<string, string | undefined>
}

function pathId(url: string | undefined, pattern: RegExp) {
  if (!url) {
    return null
  }
  return url.split("?")[0]?.match(pattern)?.[1] ?? null
}

function run(config: AxiosRequestConfig, work: () => unknown): Reply {
  if (!requireUser(config)) {
    return [401, { message: "Sign in to continue." }]
  }

  try {
    return [200, work()]
  } catch (error) {
    if (error instanceof MockError) {
      return [error.status, { message: error.message }]
    }
    throw error
  }
}

export function registerCatalogHandlers(mock: MockAdapter) {
  mock.onGet("/catalog/options").reply((config) =>
    run(config, () => catalogOptions())
  )

  mock.onGet("/products").reply((config) =>
    run(config, () => listProducts(params(config) as ProductFilters))
  )

  mock.onPost("/products").reply((config) =>
    run(config, () => createProduct(readJson<ProductInput>(config.data)))
  )

  mock.onGet(/^(?:\/api)?\/products\/[^/]+$/).reply((config) => {
    const id = pathId(config.url, /\/products\/([^/]+)$/)
    return run(config, () => getProduct(id ?? ""))
  })

  mock.onPut(/^(?:\/api)?\/products\/[^/]+$/).reply((config) => {
    const id = pathId(config.url, /\/products\/([^/]+)$/)
    return run(config, () =>
      updateProduct(id ?? "", readJson<ProductInput>(config.data))
    )
  })

  mock.onPost(/^(?:\/api)?\/products\/[^/]+\/qr$/).reply((config) => {
    const id = pathId(config.url, /\/products\/([^/]+)\/qr$/)
    return run(config, () => generateQr(id ?? ""))
  })

  mock.onGet("/qr-codes").reply((config) =>
    run(config, () => listQrCodes(params(config) as QrFilters))
  )

  mock.onGet(/^(?:\/api)?\/qr-codes\/[^/]+$/).reply((config) => {
    const id = pathId(config.url, /\/qr-codes\/([^/]+)$/)
    return run(config, () => getQrCode(id ?? ""))
  })

  mock.onPost(/^(?:\/api)?\/qr-codes\/[^/]+\/deactivate$/).reply((config) => {
    const id = pathId(config.url, /\/qr-codes\/([^/]+)\/deactivate$/)
    return run(config, () => deactivateQr(id ?? ""))
  })

  mock.onGet(/^(?:\/api)?\/public\/products\/[^/]+$/).reply((config) => {
    const code = pathId(config.url, /\/public\/products\/([^/]+)$/)
    const record = params(config).scan === "1"
    try {
      return [200, getPublicProduct(decodeURIComponent(code ?? ""), record)]
    } catch (error) {
      if (error instanceof MockError) {
        return [error.status, { message: error.message }]
      }
      throw error
    }
  })

  mock.onGet("/analytics").reply((config) =>
    run(config, () => getAnalytics(params(config) as AnalyticsFilters))
  )

  mock.onGet(/^(?:\/api)?\/reports\/[^/]+$/).reply((config) => {
    const id = pathId(config.url, /\/reports\/([^/]+)$/) ?? ""
    return run(config, () => {
      if (!isReportId(id)) {
        throw new MockError(404, "That report was not found.")
      }
      return getReport(id, params(config) as ReportFilters)
    })
  })

  mock.onGet("/users").reply((config) => run(config, () => listUsers()))

  mock.onPost("/users").reply((config) =>
    run(config, () => createUser(readJson<UserInput>(config.data)))
  )

  mock.onGet(/^(?:\/api)?\/users\/[^/]+$/).reply((config) => {
    const id = pathId(config.url, /\/users\/([^/]+)$/)
    return run(config, () => getUser(id ?? ""))
  })

  mock.onPut(/^(?:\/api)?\/users\/[^/]+$/).reply((config) => {
    const id = pathId(config.url, /\/users\/([^/]+)$/)
    return run(config, () => updateUser(id ?? "", readJson<UserInput>(config.data)))
  })

  mock.onPost(/^(?:\/api)?\/users\/[^/]+\/deactivate$/).reply((config) => {
    const id = pathId(config.url, /\/users\/([^/]+)\/deactivate$/)
    return run(config, () => deactivateUser(id ?? ""))
  })

  mock.onGet("/settings").reply((config) => run(config, () => getSettings()))

  mock.onPut("/settings").reply((config) =>
    run(config, () => updateSettings(readJson<Settings>(config.data)))
  )
}
