import logo from "@/assets/logo.avif"
import { cn } from "cn"

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className="inline-flex w-fit rounded-md bg-white px-2 py-1">
      <img
        src={logo}
        alt="Ingex Botanicals"
        className={cn("h-8 w-auto max-w-full object-contain", className)}
      />
    </span>
  )
}
