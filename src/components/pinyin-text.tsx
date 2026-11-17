import { cn } from "@/lib/utils"
import { showPinyin, toPinyinHtml } from "@/lib/pinyin-text"
import type { HskLevel } from "@/lib/types"

export function PinyinText({
  text,
  level,
  force,
  ruby = true,
  className,
}: {
  text?: string | null
  level?: HskLevel
  force?: boolean
  ruby?: boolean
  className?: string
}) {
  if (!text) return null
  if (!ruby || !showPinyin(level, force)) {
    return <span className={cn("font-cjk", className)}>{text}</span>
  }
  return (
    <span
      className={cn("pinyin-ruby font-cjk", className)}
      dangerouslySetInnerHTML={{ __html: toPinyinHtml(text) }}
    />
  )
}
