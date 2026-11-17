import { cn } from "@/lib/utils"

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("page-enter mx-auto w-full max-w-6xl flex-1 px-3 py-6 sm:px-4 sm:py-10", className)}>
      {children}
    </div>
  )
}
