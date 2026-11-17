import { NextResponse } from "next/server"
import { saveOwnPracticeResult, upsertOwnSrsReview } from "@/app/actions/user-data"
import type { HskLevel, ToolId } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      vocabId?: string
      quality?: number
      enroll?: boolean
      practice?: {
        hskLevel: HskLevel
        tool: ToolId
        score: number
        total: number
      } | null
    }

    const vocabId = String(body.vocabId ?? "")
    const quality = Number(body.quality)
    if (!vocabId || Number.isNaN(quality)) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 })
    }

    await upsertOwnSrsReview({ vocabId, quality, enroll: Boolean(body.enroll) })
    if (body.practice) {
      await saveOwnPracticeResult({
        hskLevel: body.practice.hskLevel,
        tool: body.practice.tool,
        score: body.practice.score,
        total: body.practice.total,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save."
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
