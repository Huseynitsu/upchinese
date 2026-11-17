import { NextResponse } from "next/server"
import { searchDictionary } from "@/lib/dictionary/search"
import type { DictField, DictKind, DictMatch } from "@/lib/dictionary/types"
import type { HskLevel } from "@/lib/types"

export const runtime = "nodejs"

function asField(value: string | null): DictField {
  if (value === "hanzi" || value === "pinyin" || value === "english") return value
  return "all"
}

function asMatch(value: string | null): DictMatch {
  if (value === "starts" || value === "exact") return value
  return "contains"
}

function asType(value: string | null): DictKind {
  if (value === "words" || value === "characters") return value
  return "all"
}

function asHsk(value: string | null): "any" | "none" | `${HskLevel}` {
  if (value === "none" || value === "1" || value === "2" || value === "3" || value === "4" || value === "5" || value === "6") {
    return value
  }
  return "any"
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const q = url.searchParams.get("q")?.trim() ?? ""
  if (!q) return NextResponse.json({ results: [] })
  try {
    const results = searchDictionary({
      q,
      field: asField(url.searchParams.get("field")),
      match: asMatch(url.searchParams.get("match")),
      hsk: asHsk(url.searchParams.get("hsk")),
      type: asType(url.searchParams.get("type")),
      limit: Number(url.searchParams.get("limit") ?? 40),
    })
    return NextResponse.json({ results })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dictionary is not ready."
    return NextResponse.json({ error: message, results: [] }, { status: 500 })
  }
}
