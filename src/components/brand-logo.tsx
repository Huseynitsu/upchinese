import { cn } from "@/lib/utils"

export function BrandLogo({
  className,
  markClassName,
  wordmark = true,
  size = "md",
}: {
  className?: string
  markClassName?: string
  wordmark?: boolean
  size?: "sm" | "md"
}) {
  const mark = size === "sm" ? "size-8 text-base" : "size-9 text-lg"
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "font-cjk flex shrink-0 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground",
          mark,
          markClassName
        )}
      >
        中
      </span>
      {wordmark ? (
        <span className={cn("font-semibold tracking-tight", size === "sm" ? "text-sm" : "text-base")}>
          UpChinese
        </span>
      ) : null}
    </span>
  )
}
