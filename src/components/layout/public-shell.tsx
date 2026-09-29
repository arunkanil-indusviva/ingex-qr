import { Outlet } from "react-router-dom"

export function PublicShell() {
  return (
    <div className="min-h-svh bg-background">
      <header className="flex h-12 items-center border-b px-4">
        <span className="text-sm font-medium">Ingex</span>
      </header>
      <main className="mx-auto w-full max-w-lg px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
