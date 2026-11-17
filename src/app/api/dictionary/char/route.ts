import { NextResponse } from "next/server"
import { explainWord } from "@/lib/dictionary/search"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const word = new URL(request.url).searchParams.get("word")?.trim() ?? ""
  if (!word) return NextResponse.json({ error: "Missing word." }, { status: 400 })
  try {
    return NextResponse.json(explainWord(word))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dictionary is not ready."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
