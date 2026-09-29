import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/lib/query-keys"
import { getSession } from "@/services/auth"

export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: getSession,
    staleTime: Infinity,
  })
}
