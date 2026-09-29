export function FullScreenStatus({ label }: { label: string }) {
  return (
    <div className="flex min-h-svh items-center justify-center px-6">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
