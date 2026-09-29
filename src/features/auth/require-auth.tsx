import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

import { FullScreenStatus } from "@/components/common/full-screen-status"
import { useSession } from "@/features/auth/use-session"

export function RequireAuth({ children }: { children?: ReactNode }) {
  const session = useSession()
  const location = useLocation()

  if (session.isPending) {
    return <FullScreenStatus label="Checking access" />
  }

  if (!session.data) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children ?? null
}
