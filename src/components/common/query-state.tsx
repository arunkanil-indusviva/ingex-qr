import type { ReactNode } from "react"
import type { UseQueryResult } from "@tanstack/react-query"

import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { getErrorMessage } from "@/lib/api-error"

export function QueryState<T>({
  query,
  skeleton,
  emptyTitle,
  emptyDescription,
  isEmpty,
  children,
}: {
  query: UseQueryResult<T>
  skeleton: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  isEmpty?: (data: T) => boolean
  children: (data: T) => ReactNode
}) {
  if (query.isPending) {
    return skeleton
  }

  if (query.isError) {
    return (
      <ErrorState
        message={getErrorMessage(query.error)}
        onRetry={() => {
          void query.refetch()
        }}
      />
    )
  }

  if (query.data === undefined) {
    return skeleton
  }

  if (isEmpty?.(query.data) && emptyTitle && emptyDescription) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return children(query.data)
}
