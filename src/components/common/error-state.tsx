import { Button } from "@/components/ui/button"

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-start gap-3 border border-destructive/30 bg-destructive/5 px-4 py-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">Could not load this page</h2>
        <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
