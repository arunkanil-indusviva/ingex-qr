import type { ActivityKind } from "@/types/dashboard"
import type { UserRole } from "@/types/user"

const roleLabels: Record<UserRole, string> = {
  administrator: "Administrator",
  manager: "Manager",
  viewer: "Viewer",
}

const activityLabels: Record<ActivityKind, string> = {
  product_added: "Product added",
  product_updated: "Product updated",
  qr_generated: "QR generated",
  qr_deactivated: "QR deactivated",
  qr_scanned: "QR scanned",
}

export function formatRole(role: UserRole) {
  return roleLabels[role]
}

export function formatActivityKind(kind: ActivityKind) {
  return activityLabels[kind]
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value)
}

export function formatDate(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number)
  if (!year || !month || !day) {
    return value
  }

  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
    new Date(year, month - 1, day)
  )
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}
