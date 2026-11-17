"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function FlipCard({
  flipped,
  onFlip,
  front,
  back,
  className,
}: {
  flipped: boolean
  onFlip: () => void
  front: ReactNode
  back: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onFlip}
      aria-pressed={flipped}
      className={cn("block w-full text-left [perspective:1400px]", className)}
    >
      <div
        className={cn(
          "relative min-h-72 w-full transition-transform duration-300 ease-out [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        <div
          aria-hidden={flipped}
          className="absolute inset-0 flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl bg-card/85 p-8 text-center ring-1 ring-foreground/10 backdrop-blur-sm [backface-visibility:hidden]"
        >
          {front}
        </div>
        <div
          aria-hidden={!flipped}
          className="absolute inset-0 flex min-h-72 flex-col items-center justify-center gap-3 rounded-xl bg-card/85 p-8 text-center ring-1 ring-foreground/10 backdrop-blur-sm [backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          {back}
        </div>
      </div>
    </button>
  )
}
