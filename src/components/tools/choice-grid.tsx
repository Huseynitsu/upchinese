import { ExamPicture } from "@/components/exam-picture"
import { PinyinText } from "@/components/pinyin-text"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Choice, HskLevel } from "@/lib/types"

export function ChoiceGrid({
  choices,
  selected,
  correctKey,
  layout = "list",
  level,
  ruby = true,
  onChoose,
}: {
  choices: Choice[]
  selected: string | null
  correctKey?: string
  layout?: "list" | "pictures"
  level?: HskLevel
  ruby?: boolean
  onChoose: (key: string) => void
}) {
  if (layout === "pictures") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {choices.map((choice) => {
          const state = tone(choice.key, selected, correctKey)
          return (
            <button
              key={choice.key}
              type="button"
              onClick={() => onChoose(choice.key)}
              className={cn(
                "flex min-h-32 flex-col items-center justify-center gap-2 rounded-sm border border-neutral-800 bg-card p-3 text-center transition-colors",
                state
              )}
            >
              <ExamPicture token={choice.emoji ?? choice.text} className="text-neutral-900" />
              <span className="text-xs text-muted-foreground">{choice.key}</span>
              <PinyinText text={choice.text} level={level} ruby={ruby} className="text-sm" />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      {choices.map((choice) => (
        <Button
          key={choice.key}
          type="button"
          variant="outline"
          className={cn("h-auto justify-start whitespace-normal py-3", tone(choice.key, selected, correctKey))}
          onClick={() => onChoose(choice.key)}
        >
          <span className="mr-2 text-muted-foreground">{choice.key}.</span>
          <PinyinText text={choice.text} level={level} ruby={ruby} />
        </Button>
      ))}
    </div>
  )
}

function tone(key: string, selected: string | null, correctKey?: string) {
  if (!selected) return ""
  if (!correctKey) {
    return key === selected ? "border-primary bg-primary/10" : ""
  }
  if (key === correctKey) return "border-emerald-500/60 bg-emerald-500/10"
  if (key === selected) return "border-destructive/60 bg-destructive/10"
  return "opacity-70"
}
