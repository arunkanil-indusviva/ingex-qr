import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "react-router-dom"

import { router } from "@/app/router"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { queryClient } from "@/lib/query-client"

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="ingex-qr-theme">
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
