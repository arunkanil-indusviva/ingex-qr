import { QueryClient } from "@tanstack/react-query"

import { isApiError } from "@/lib/api-error"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (
          isApiError(error) &&
          (error.status === 401 || error.status === 404)
        ) {
          return false
        }

        return failureCount < 1
      },
    },
  },
})
