import type { ReactNode } from "react"

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-start gap-2 border border-dashed border-border px-4 py-8">
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  )
}
