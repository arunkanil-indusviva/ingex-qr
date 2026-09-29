import {
  ChartColumnIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PackageIcon,
  QrCodeIcon,
  SettingsIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

export type AdminNavItem = {
  title: string
  to: string
  description: string
  icon: LucideIcon
  ready: boolean
}

export const adminNav: AdminNavItem[] = [
  {
    title: "Dashboard",
    to: "/dashboard",
    description: "A snapshot of products, QR codes, and scans.",
    icon: LayoutDashboardIcon,
    ready: true,
  },
  {
    title: "Products",
    to: "/products",
    description:
      "Register products, then search and open one to edit it or generate its QR.",
    icon: PackageIcon,
    ready: true,
  },
  {
    title: "QR codes",
    to: "/qr-codes",
    description:
      "Every generated QR, with scan counts and a way to open or deactivate it.",
    icon: QrCodeIcon,
    ready: true,
  },
  {
    title: "Analytics",
    to: "/analytics",
    description: "Scan volume, countries, and products over a chosen period.",
    icon: ChartColumnIcon,
    ready: true,
  },
  {
    title: "Reports",
    to: "/reports",
    description: "Product, generation, and scan reports, ready to export.",
    icon: FileTextIcon,
    ready: true,
  },
  {
    title: "Users",
    to: "/users",
    description: "People who can sign in, and the role each person has.",
    icon: UsersIcon,
    ready: true,
  },
  {
    title: "Settings",
    to: "/settings",
    description: "Company, QR, security, and notification settings.",
    icon: SettingsIcon,
    ready: true,
  },
]

export type RouteHandle = {
  title: string
  description?: string
}
