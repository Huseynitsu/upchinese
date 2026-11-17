import { isSupabaseConfigured } from "@/lib/supabase/env"
import { savePracticeResult, upsertSrsReview } from "@/lib/store"
import type { HskLevel, ToolId } from "@/lib/types"

export function queueCardProgress(input: {
  userId: string
  vocabId: string
  quality: number
  enroll?: boolean
  practice?: {
    hskLevel: HskLevel
    tool: ToolId
    score: number
    total: number
  }
}) {
  if (!isSupabaseConfigured()) {
    void (async () => {
      await upsertSrsReview({
        userId: input.userId,
        vocabId: input.vocabId,
        quality: input.quality,
        enroll: input.enroll,
      })
      if (input.practice) {
        await savePracticeResult({
          userId: input.userId,
          ...input.practice,
        })
      }
    })()
    return
  }

  void fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      vocabId: input.vocabId,
      quality: input.quality,
      enroll: input.enroll ?? false,
      practice: input.practice ?? null,
    }),
  })
}
