"use client"

import { useState } from "react"
import { PinyinText } from "@/components/pinyin-text"
import { useAuth } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/require-auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useShuffledSession } from "@/hooks/use-shuffled-session"
import { questionsBySkill } from "@/lib/content"
import { isWritingLevel } from "@/lib/levels"
import { EXAM_COUNTS, PRACTICE_SIZE } from "@/lib/shuffle"
import { errorMessage } from "@/lib/errors"
import { savePracticeResult } from "@/lib/store"
import type { HskLevel } from "@/lib/types"

export function WritingTool({ level }: { level: HskLevel }) {
  if (!isWritingLevel(level)) {
    return (
      <Card>
        <CardContent className="space-y-3 pt-6 text-sm text-muted-foreground">
          <p className="text-base font-medium text-foreground">Writing starts at HSK 3</p>
          <p>
            Official HSK 1–2 papers have no writing section. Use Vocabulary, Reading, and Listening
            on HSK {level}. From HSK 3 you will get a task box, a sentence pattern, a minimum length,
            and a model answer after you submit.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <RequireAuth>
      <WritingInner level={level} />
    </RequireAuth>
  )
}

function scoreWriting(text: string, keywords: string[] = [], minChars = 12) {
  const compact = text.replace(/\s+/g, "")
  const lengthOk = compact.length >= minChars
  const hits = keywords.filter((word) => text.includes(word)).length
  const keywordOk = keywords.length ? hits > 0 : true
  return {
    ok: lengthOk && keywordOk,
    hits,
    needed: keywords.length,
    length: compact.length,
  }
}

function WritingInner({ level }: { level: HskLevel }) {
  const { user } = useAuth()
  const pool = questionsBySkill(level, "writing")
  const { items, poolSize, reshuffle } = useShuffledSession(
    pool,
    EXAM_COUNTS[level].writing || PRACTICE_SIZE.writing
  )
  const [index, setIndex] = useState(0)
  const [text, setText] = useState("")
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const question = items[index]

  async function submit() {
    if (!question) return
    const result = scoreWriting(text, question.keywords, question.minChars)
    const nextScore = score + (result.ok ? 1 : 0)
    setScore(nextScore)
    setFeedback(
      result.ok
        ? `Accepted. You used ${result.hits}/${result.needed || 0} required word(s) and wrote ${result.length} characters.`
        : `Needs work. Length ${result.length} (need ${question.minChars}+). Required words ${result.hits}/${result.needed}.`
    )
    if (index + 1 >= items.length) {
      if (user) {
        try {
          await savePracticeResult({
            userId: user.id,
            hskLevel: level,
            tool: "writing",
            score: nextScore,
            total: items.length,
            payload: { lastAnswer: text },
          })
          setSaveError(null)
        } catch (err) {
          setSaveError(errorMessage(err, "Could not save this session to your account."))
        }
      }
      setDone(true)
    }
  }

  if (!items.length) return <p>No writing prompts for this level.</p>
  if (done) {
    return (
      <Card>
        <CardContent className="space-y-3 pt-6">
          <p>Writing score: {score}/{items.length}</p>
          {saveError ? <p className="text-sm text-destructive">{saveError}</p> : null}
          <p className="text-sm text-muted-foreground">{poolSize} prompts in the bank.</p>
          <Button
            onClick={() => {
              reshuffle()
              setIndex(0)
              setScore(0)
              setText("")
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
        <h1 className="text-2xl font-semibold">HSK {level} writing</h1>
        <Badge variant="outline">
          {index + 1}/{items.length} · pool {poolSize}
        </Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{question.prompt}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {question.instruction ? (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">How to write</p>
              <p className="mt-1">{question.instruction}</p>
              <p className="mt-1">
                Minimum {question.minChars} characters
                {question.keywords?.length ? ` · must include ${question.keywords.join("、")}` : ""}.
              </p>
            </div>
          ) : null}
          <Textarea
            className="min-h-40 font-cjk"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write your answer in Chinese here"
          />
          {feedback ? (
            <div className="space-y-2 rounded-lg border border-border/60 p-3 text-sm">
              <p>{feedback}</p>
              {question.modelAnswer ? (
                <div>
                  <p className="font-medium">Model answer</p>
                  <PinyinText text={question.modelAnswer} level={level} className="text-base" />
                  {question.explanation ? (
                    <p className="mt-1 text-muted-foreground">{question.explanation}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
          {!feedback ? (
            <Button onClick={() => void submit()}>Submit</Button>
          ) : (
            <Button
              onClick={() => {
                if (index + 1 >= items.length) return
                setIndex((value) => value + 1)
                setText("")
                setFeedback(null)
              }}
            >
              Next prompt
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
