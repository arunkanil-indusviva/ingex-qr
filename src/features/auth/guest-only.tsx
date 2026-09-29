import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import { FullScreenStatus } from "@/components/common/full-screen-status"
import { useSession } from "@/features/auth/use-session"

export function GuestOnly({ children }: { children: ReactNode }) {
  const session = useSession()

  if (session.isPending) {
    return <FullScreenStatus label="Checking access" />
  }

  if (session.data) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
