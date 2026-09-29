import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"

import { AdminShell } from "@/components/layout/admin-shell"
import { PublicShell } from "@/components/layout/public-shell"
import { adminNav } from "@/config/navigation"
import { GuestOnly } from "@/features/auth/guest-only"
import { LoginPage } from "@/features/auth/login-page"
import { RequireAuth } from "@/features/auth/require-auth"
import { DashboardPage } from "@/features/dashboard/dashboard-page"
import { NotFoundPage } from "@/features/not-found-page"
import { PublicProductPage } from "@/features/public/public-product-page"
import { ScreenPlaceholder } from "@/features/screens/screen-placeholder"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <GuestOnly>
        <LoginPage />
      </GuestOnly>
    ),
  },
  {
    path: "/p/:code",
    element: <PublicShell />,
    children: [{ index: true, element: <PublicProductPage /> }],
  },
  {
    element: (
      <RequireAuth>
        <Outlet />
      </RequireAuth>
    ),
    children: [
      {
        path: "/",
        element: <AdminShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          ...adminNav.map((item) => ({
            path: item.to.slice(1),
            handle: {
              title: item.title,
              description: item.description,
            },
            element:
              item.to === "/dashboard" ? (
                <DashboardPage />
              ) : (
                <ScreenPlaceholder />
              ),
          })),
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
])
