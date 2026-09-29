import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/query-keys"
import { getCatalogOptions } from "@/services/products"

export function useCatalogOptions() {
  return useQuery({
    queryKey: queryKeys.options,
    queryFn: getCatalogOptions,
  })
}
