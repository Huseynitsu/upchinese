"use client"

import { useState } from "react"
import { ListenButton } from "@/components/listen-button"
import { PinyinText } from "@/components/pinyin-text"
import { useAuth } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/require-auth"
import { ChoiceGrid } from "@/components/tools/choice-grid"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useShuffledSession } from "@/hooks/use-shuffled-session"
import { passageById } from "@/lib/content"
import { PRACTICE_SIZE } from "@/lib/shuffle"
import { errorMessage } from "@/lib/errors"
import { savePracticeResult, recordMistake } from "@/lib/store"
import type { HskLevel, Question, ToolId } from "@/lib/types"

export function QuizEngine({
  title,
  tool,
  level,
  questions,
  gated = true,
  sessionSize = PRACTICE_SIZE.quiz,
}: {
  title: string
  tool: ToolId
  level: HskLevel
  questions: Question[]
  gated?: boolean
  sessionSize?: number
}) {
  const body = (
    <QuizInner
      title={title}
      tool={tool}
      level={level}
      questions={questions}
      sessionSize={sessionSize}
    />
  )
  return gated ? <RequireAuth>{body}</RequireAuth> : body
}

function QuizInner({
  title,
  tool,
  level,
  questions,
  sessionSize,
}: {
  title: string
  tool: ToolId
  level: HskLevel
  questions: Question[]
  sessionSize: number
}) {
  const { user } = useAuth()
  const pool = questions.filter((question) => question.choices?.length)
  const { items, poolSize, reshuffle } = useShuffledSession(pool, sessionSize)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [marks, setMarks] = useState<boolean[]>([])
  const [done, setDone] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const score = marks.filter(Boolean).length
  const question = items[index]
  const passage = question?.passageId ? passageById(question.passageId) : null

  async function finish(nextScore: number) {
    setDone(true)
    if (!user || saved) return
    try {
      await savePracticeResult({
        userId: user.id,
        hskLevel: level,
        tool,
        score: nextScore,
        total: items.length,
      })
      setSaved(true)
      setSaveError(null)
    } catch (err) {
      setSaveError(errorMessage(err, "Could not save this session to your account."))
    }
  }

  function choose(key: string) {
    if (selected || !question) return
    setSelected(key)
    const ok = key === question.correctKey
    setMarks((current) => [...current, ok])
    if (!ok && user && question.vocabId) {
      void recordMistake({
        userId: user.id,
        vocabId: question.vocabId,
        skill: tool,
        prompt: question.promptZh || question.prompt,
      })
    }
  }

  function next() {
    if (index + 1 >= items.length) {
      void finish(marks.filter(Boolean).length)
      return
    }
    setIndex((value) => value + 1)
    setSelected(null)
  }

  function restart() {
    reshuffle()
    setIndex(0)
    setSelected(null)
    setMarks([])
    setDone(false)
    setSaved(false)
    setSaveError(null)
  }

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">No questions for this level yet.</p>
  }

  if (done) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title} complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Score: <span className="font-semibold">{score}/{items.length}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {saveError
              ? saveError
              : `Saved to your account. Another random set is ready from ${poolSize} items.`}
          </p>
          <Button onClick={restart}>New random set</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Badge variant="outline">
          {index + 1}/{items.length} · pool {poolSize}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Mixed question types. After each choice you will see why the answer is right.
      </p>
      <Progress value={((index + (selected ? 1 : 0)) / items.length) * 100} />
      {passage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{passage.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-lg leading-8">
            <PinyinText text={passage.body} level={level} />
            {passage.bodyEn ? <p className="text-sm text-muted-foreground">{passage.bodyEn}</p> : null}
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{question.prompt}</CardTitle>
          {question.instruction ? (
            <p className="text-sm font-normal text-muted-foreground">{question.instruction}</p>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {question.audioText && <ListenButton text={question.audioText} />}
          {question.promptZh && <PinyinText text={question.promptZh} level={level} className="text-xl" />}
          <ChoiceGrid
            choices={question.choices ?? []}
            selected={selected}
            correctKey={question.correctKey}
            layout={question.layout}
            level={level}
            ruby={tool !== "hanzi" && tool !== "pinyin"}
            onChoose={choose}
          />
          {selected ? <AnswerExplain question={question} selected={selected} /> : null}
          {selected && (
            <Button onClick={next}>{index + 1 >= items.length ? "Finish" : "Next"}</Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function AnswerExplain({ question, selected }: { question: Question; selected: string }) {
  const ok = selected === question.correctKey
  const correct = question.choices?.find((choice) => choice.key === question.correctKey)
  const yours = question.choices?.find((choice) => choice.key === selected)
  return (
    <div className="space-y-1 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
      <p className={ok ? "font-medium text-emerald-400" : "font-medium text-destructive"}>
        {ok ? "Correct" : "Not quite"}
      </p>
      {!ok ? (
        <p className="text-muted-foreground">
          Your answer: {selected}
          {yours?.text ? ` (${yours.text})` : ""}. Correct: {question.correctKey}
          {correct?.text ? ` (${correct.text})` : ""}.
        </p>
      ) : null}
      {question.explanation ? <p className="text-muted-foreground">{question.explanation}</p> : null}
    </div>
  )
}
