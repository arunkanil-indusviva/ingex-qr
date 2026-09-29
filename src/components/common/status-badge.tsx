import { Badge } from "@/components/ui/badge"

const labels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  generated: "Generated",
  pending: "Pending",
}

export function StatusBadge({ value }: { value: string }) {
  const variant =
    value === "inactive"
      ? "destructive"
      : value === "pending"
        ? "outline"
        : "secondary"

  return <Badge variant={variant}>{labels[value] ?? value}</Badge>
}
