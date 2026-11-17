import { cn } from "@/lib/utils"

export function PageLoader({
  label = "Loading…",
  className,
  compact = false,
}: {
  label?: string
  className?: string
  compact?: boolean
}) {
  if (compact) {
    return (
      <span
        className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)}
        role="status"
        aria-live="polite"
      >
        <Mark size="sm" />
        {label ? <span>{label}</span> : <span className="sr-only">Loading…</span>}
      </span>
    )
  }

  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-4 py-16", className)}
      role="status"
      aria-live="polite"
    >
      <Mark size="lg" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function Mark({ size }: { size: "sm" | "lg" }) {
  const box = size === "sm" ? "size-7 text-sm" : "size-14 text-2xl"
  const ping = size === "sm" ? "size-7" : "size-14"
  return (
    <span className={cn("relative inline-flex items-center justify-center", ping)}>
      <span className={cn("absolute rounded-xl bg-primary/25 animate-ping", ping)} />
      <span
        className={cn(
          "font-cjk relative flex items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground animate-[loader-spin_1.6s_ease-in-out_infinite]",
          box
        )}
      >
        中
      </span>
    </span>
  )
}

export function PageLoading() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-6xl flex-1 items-center justify-center px-4">
      <PageLoader />
    </div>
  )
}
