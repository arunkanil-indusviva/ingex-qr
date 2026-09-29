import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"

import { AdminShell } from "@/components/layout/admin-shell"
import { PublicShell } from "@/components/layout/public-shell"
import { ForgotPasswordPage } from "@/features/auth/forgot-password-page"
import { GuestOnly } from "@/features/auth/guest-only"
import { LoginPage } from "@/features/auth/login-page"
import { RequireAuth } from "@/features/auth/require-auth"
import { AnalyticsPage } from "@/features/analytics/analytics-page"
import { DashboardPage } from "@/features/dashboard/dashboard-page"
import { NotFoundPage } from "@/features/not-found-page"
import { ProductDetailsPage } from "@/features/products/product-details-page"
import { ProductFormPage } from "@/features/products/product-form"
import { ProductsPage } from "@/features/products/products-page"
import { PublicInfoPage } from "@/features/public/public-info-page"
import { PublicProductPage } from "@/features/public/public-product-page"
import { QrDetailsPage } from "@/features/qr/qr-details-page"
import { QrGeneratePage } from "@/features/qr/qr-generate-page"
import { QrListPage } from "@/features/qr/qr-list-page"
import { ReportPreviewPage } from "@/features/reports/report-preview-page"
import { ReportsPage } from "@/features/reports/reports-page"
import { SettingsPage } from "@/features/settings/settings-page"
import { UserFormPage } from "@/features/users/user-form-page"
import { UsersPage } from "@/features/users/users-page"

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
    path: "/forgot-password",
    element: (
      <GuestOnly>
        <ForgotPasswordPage />
      </GuestOnly>
    ),
  },
  {
    path: "/p/:code",
    element: <PublicShell />,
    children: [
      { index: true, element: <PublicProductPage /> },
      {
        path: "certificate",
        element: <PublicInfoPage section="certificate" />,
      },
      { path: "manual", element: <PublicInfoPage section="manual" /> },
      { path: "more", element: <PublicInfoPage section="more" /> },
    ],
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
          {
            path: "dashboard",
            handle: { title: "Dashboard" },
            element: <DashboardPage />,
          },
          {
            path: "products",
            handle: { title: "Products" },
            element: <ProductsPage />,
          },
          {
            path: "products/new",
            handle: { title: "Add product" },
            element: <ProductFormPage />,
          },
          {
            path: "products/:productId/edit",
            handle: { title: "Edit product" },
            element: <ProductFormPage />,
          },
          {
            path: "products/:productId/qr",
            handle: { title: "Generate QR" },
            element: <QrGeneratePage />,
          },
          {
            path: "products/:productId",
            handle: { title: "Product" },
            element: <ProductDetailsPage />,
          },
          {
            path: "qr-codes",
            handle: { title: "QR codes" },
            element: <QrListPage />,
          },
          {
            path: "qr-codes/:qrId",
            handle: { title: "QR code" },
            element: <QrDetailsPage />,
          },
          {
            path: "analytics",
            handle: { title: "Analytics" },
            element: <AnalyticsPage />,
          },
          {
            path: "reports",
            handle: { title: "Reports" },
            element: <ReportsPage />,
          },
          {
            path: "reports/:reportId",
            handle: { title: "Report" },
            element: <ReportPreviewPage />,
          },
          {
            path: "users",
            handle: { title: "Users" },
            element: <UsersPage />,
          },
          {
            path: "users/new",
            handle: { title: "Add user" },
            element: <UserFormPage />,
          },
          {
            path: "users/:userId/edit",
            handle: { title: "Edit user" },
            element: <UserFormPage />,
          },
          {
            path: "settings",
            handle: { title: "Settings" },
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
])
