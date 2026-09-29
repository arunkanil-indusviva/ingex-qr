import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-start justify-center gap-3 px-6">
      <h1 className="text-lg font-medium">Page not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        That address is not part of Ingex QR.
      </p>
      <Button asChild>
        <Link to="/">Go to the portal</Link>
      </Button>
    </div>
  )
}
