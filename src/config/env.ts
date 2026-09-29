function readFlag(value: string | undefined, fallback: boolean) {
  if (value === undefined || value === "") {
    return fallback
  }

  return value === "true"
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
  useMocks: readFlag(import.meta.env.VITE_USE_MOCKS, true),
}
