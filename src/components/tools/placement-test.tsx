"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/require-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { questionsBySkill } from "@/lib/content"
import { shuffle } from "@/lib/shuffle"
import type { HskLevel, Question } from "@/lib/types"

function pickPlacement(): Question[] {
  const pool = ([1, 2, 3, 4, 5, 6] as HskLevel[]).flatMap((level) =>
    questionsBySkill(level, "reading").filter((item) => item.choices?.length)
  )
  return shuffle(pool).slice(0, 12)
}

function levelFromScore(score: number): HskLevel {
  if (score <= 2) return 1
  if (score <= 5) return 2
  if (score <= 8) return 3
  if (score <= 10) return 4
  if (score <= 11) return 5
  return 6
}

export function PlacementTest() {
  return (
    <RequireAuth>
      <PlacementInner />
    </RequireAuth>
  )
}

function PlacementInner() {
  const { setLevel } = useAuth()
  const router = useRouter()
  const items = useMemo(() => pickPlacement(), [])
  const [index, setIndex] = useState(0)
  const scoreRef = useRef(0)
  const [done, setDone] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [saveNote, setSaveNote] = useState<string | null>(null)
  const question = items[index]

  function choose(key: string) {
    if (picked || !question) return
    setPicked(key)
    const nextScore = scoreRef.current + (key === question.correctKey ? 1 : 0)
    scoreRef.current = nextScore
  }

  function next() {
    if (index + 1 >= items.length) {
      const finalScore = scoreRef.current
      const level = levelFromScore(finalScore)
      setDone(true)
      void setLevel(level).catch(() => {
        setSaveNote("Result is ready. Sign in again later if the HSK goal did not save.")
      })
      return
    }
    setIndex((value) => value + 1)
    setPicked(null)
  }

  if (!items.length) return <p>Could not build a placement test.</p>
  if (done) {
    const finalScore = scoreRef.current
    const level = levelFromScore(finalScore)
    return (
      <Card>
        <CardContent className="space-y-3 pt-6">
          <p className="text-lg font-medium">Suggested start: HSK {level}</p>
          <p className="text-sm text-muted-foreground">
            You got {finalScore}/{items.length}
            {saveNote ? "." : ". Your HSK goal is saved."}
          </p>
          {saveNote ? <p className="text-sm text-muted-foreground">{saveNote}</p> : null}
          <Button onClick={() => router.push(`/hsk/${level}`)}>Open HSK {level}</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Placement test</h1>
      <p className="text-sm text-muted-foreground">
        12 mixed reading items. This sets your HSK goal. Everyone can take it.
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="text-base leading-snug">
            {index + 1}/{items.length} · {question.prompt}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.promptZh ? <p className="font-cjk text-xl break-words">{question.promptZh}</p> : null}
          <div className="grid gap-2">
            {(question.choices ?? []).map((choice) => (
              <Button
                key={choice.key}
                variant={picked === choice.key ? "secondary" : "outline"}
                className="h-auto min-h-9 justify-start whitespace-normal text-left"
                disabled={Boolean(picked)}
                onClick={() => choose(choice.key)}
              >
                {choice.key}. {choice.text}
              </Button>
            ))}
          </div>
          {picked ? (
            <Button onClick={next}>{index + 1 >= items.length ? "Finish" : "Next"}</Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
