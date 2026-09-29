import { ThemeToggle } from "@/components/common/theme-toggle"
import { usePageHeading } from "@/hooks/use-page-heading"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AdminHeader() {
  const heading = usePageHeading()

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-4" />
      <p className="truncate text-sm">{heading.title}</p>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  )
}
