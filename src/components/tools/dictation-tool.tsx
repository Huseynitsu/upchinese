"use client"

import { useState } from "react"
import { ListenButton } from "@/components/listen-button"
import { useAuth } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/require-auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useShuffledSession } from "@/hooks/use-shuffled-session"
import { questionsBySkill } from "@/lib/content"
import { PRACTICE_SIZE } from "@/lib/shuffle"
import { errorMessage } from "@/lib/errors"
import { savePracticeResult, recordMistake } from "@/lib/store"
import type { HskLevel } from "@/lib/types"

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "").replace(/[āáǎà]/g, "a").replace(/[ēéěè]/g, "e").replace(/[īíǐì]/g, "i").replace(/[ōóǒò]/g, "o").replace(/[ūúǔù]/g, "u").replace(/[ǖǘǚǜü]/g, "u")
}

export function DictationTool({ level }: { level: HskLevel }) {
  return (
    <RequireAuth>
      <DictationInner level={level} />
    </RequireAuth>
  )
}

function DictationInner({ level }: { level: HskLevel }) {
  const { user } = useAuth()
  const pool = questionsBySkill(level, "dictation")
  const { items, poolSize, reshuffle } = useShuffledSession(pool, PRACTICE_SIZE.dictation)
  const [index, setIndex] = useState(0)
  const [value, setValue] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const question = items[index]

  async function check() {
    if (!question) return
    const accepted = question.acceptedAnswers ?? []
    const ok = accepted.some((answer) => normalize(answer) === normalize(value))
    const nextScore = score + (ok ? 1 : 0)
    setScore(nextScore)
    if (!ok && user) {
      void recordMistake({
        userId: user.id,
        vocabId: question.vocabId || question.id,
        skill: "dictation",
        prompt: question.audioText || question.prompt,
      })
    }
    setFeedback(
      ok
        ? `Correct. ${question.explanation ?? ""}`
        : `Answer: ${question.audioText}${question.explanation ? ` — ${question.explanation}` : ""}`
    )
    if (index + 1 >= items.length) {
      if (user) {
        try {
          await savePracticeResult({
            userId: user.id,
            hskLevel: level,
            tool: "dictation",
            score: nextScore,
            total: items.length,
          })
          setSaveError(null)
        } catch (err) {
          setSaveError(errorMessage(err, "Could not save this session to your account."))
        }
      }
      setDone(true)
    }
  }

  function next() {
    setIndex((value) => value + 1)
    setValue("")
    setFeedback(null)
  }

  if (!items.length) return <p>No dictation items for this level.</p>
  if (done) {
    return (
      <Card>
        <CardContent className="space-y-3 pt-6">
          <p>Dictation score: {score}/{items.length}</p>
          {saveError ? <p className="text-sm text-destructive">{saveError}</p> : null}
          <p className="text-sm text-muted-foreground">{poolSize} items in the bank.</p>
          <Button
            onClick={() => {
              reshuffle()
              setIndex(0)
              setScore(0)
              setValue("")
              setFeedback(null)
              setDone(false)
              setSaveError(null)
            }}
          >
            New random set
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">HSK {level} dictation</h1>
        <Badge variant="outline">
          {index + 1}/{items.length} · pool {poolSize}
        </Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{question.prompt}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.audioText && <ListenButton text={question.audioText} />}
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Type hanzi or pinyin"
            className="font-cjk"
          />
          {feedback && <p className="text-sm text-muted-foreground">{feedback}</p>}
          {!feedback ? (
            <Button onClick={() => void check()}>Check</Button>
          ) : (
            <Button onClick={next} disabled={index + 1 >= items.length && done}>
              {index + 1 >= items.length ? "Finish" : "Next"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
