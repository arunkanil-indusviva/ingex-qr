import type MockAdapter from "axios-mock-adapter"

import { db } from "@/mocks/db"
import { readJson, requireUser, toPublicUser } from "@/mocks/http"
import type { LoginInput } from "@/types/auth"

export function registerAuthHandlers(mock: MockAdapter) {
  mock.onPost("/auth/login").reply((config) => {
    const body = readJson<LoginInput>(config.data)
    const email = body.email.trim().toLowerCase()
    const user = db.users.find(
      (candidate) =>
        candidate.email === email && candidate.password === body.password
    )

    if (!user || user.status !== "active") {
      return [401, { message: "Those credentials are not recognized." }]
    }

    return [
      200,
      {
        token: `mock.${user.id}`,
        user: toPublicUser(user),
      },
    ]
  })

  mock.onGet("/auth/me").reply((config) => {
    const user = requireUser(config)

    if (!user) {
      return [401, { message: "Sign in to continue." }]
    }

    return [200, toPublicUser(user)]
  })

  mock.onPost("/auth/logout").reply(204)

  mock.onPost("/auth/forgot-password").reply(() => {
    return [200, { message: "If that email is registered, a reset link would be sent." }]
  })
}
