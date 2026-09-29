import type MockAdapter from "axios-mock-adapter"

import { buildDashboardSummary } from "@/mocks/dashboard"
import { requireUser } from "@/mocks/http"

export function registerDashboardHandlers(mock: MockAdapter) {
  mock.onGet("/dashboard").reply((config) => {
    const user = requireUser(config)

    if (!user) {
      return [401, { message: "Sign in to continue." }]
    }

    return [200, buildDashboardSummary()]
  })
}
