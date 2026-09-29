import { Outlet } from "react-router-dom"

import { BrandLogo } from "@/components/common/brand-logo"

export function PublicShell() {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center px-4">
          <BrandLogo />
        </div>
      </header>
      <main className="mx-auto w-full max-w-lg px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
