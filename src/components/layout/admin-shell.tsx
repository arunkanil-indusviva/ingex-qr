import { Outlet } from "react-router-dom"

import { AdminHeader } from "@/components/layout/admin-header"
import { AdminSidebar } from "@/components/layout/admin-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function AdminShell() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="flex flex-1 flex-col px-4 py-5 md:px-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
