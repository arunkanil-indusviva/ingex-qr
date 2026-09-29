import MockAdapter from "axios-mock-adapter"

import { env } from "@/config/env"
import { api } from "@/lib/axios"
import { registerAuthHandlers } from "@/mocks/handlers/auth"
import { registerDashboardHandlers } from "@/mocks/handlers/dashboard"

export function installMocks() {
  if (!env.useMocks) {
    return
  }

  const mock = new MockAdapter(api, {
    delayResponse: 350,
    onNoMatch: "throwException",
  })

  registerAuthHandlers(mock)
  registerDashboardHandlers(mock)
}
