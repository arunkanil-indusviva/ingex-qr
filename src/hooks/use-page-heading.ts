import { useMatches } from "react-router-dom"

import type { RouteHandle } from "@/config/navigation"

function isRouteHandle(handle: unknown): handle is RouteHandle {
  return (
    typeof handle === "object" &&
    handle !== null &&
    "title" in handle &&
    typeof handle.title === "string"
  )
}

export function usePageHeading() {
  const matches = useMatches()

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const handle = matches[index]?.handle

    if (isRouteHandle(handle)) {
      return handle
    }
  }

  return { title: "Ingex QR" }
}
