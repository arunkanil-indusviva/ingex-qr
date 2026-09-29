import { useState } from "react"
import { Link, useMatch, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { LogOutIcon } from "lucide-react"

import { BrandLogo } from "@/components/common/brand-logo"
import { adminNav, type AdminNavItem } from "@/config/navigation"
import { useSession } from "@/features/auth/use-session"
import { formatRole, initials } from "@/lib/format"
import { queryKeys } from "@/lib/query-keys"
import { logout } from "@/services/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

function AdminNavLink({ item }: { item: AdminNavItem }) {
  const match = useMatch({ path: item.to, end: true })
  const Icon = item.icon

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={Boolean(match)} tooltip={item.title}>
        <Link to={item.to}>
          <Icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AdminSidebar() {
  const session = useSession()
  const user = session.data
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function confirmLogout() {
    setPending(true)

    try {
      await logout()
      queryClient.removeQueries({ queryKey: queryKeys.session })
      setConfirmOpen(false)
      navigate("/login", { replace: true })
    } finally {
      setPending(false)
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-3">
        <div className="flex flex-col gap-2 group-data-[collapsible=icon]:hidden">
          <BrandLogo />
          <span className="text-xs text-muted-foreground">QR admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <AdminNavLink key={item.to} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
            <Avatar size="sm">
              <AvatarFallback>
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-xs font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {formatRole(user.role)}
              </p>
            </div>
          </div>
        ) : null}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              onClick={() => setConfirmOpen(true)}
            >
              <LogOutIcon />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                void confirmLogout()
              }}
              disabled={pending}
            >
              {pending ? "Logging out" : "Log out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
