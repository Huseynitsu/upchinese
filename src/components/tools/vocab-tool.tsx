"use client"

import { useRef, useState } from "react"
import { FlipCard } from "@/components/flash-card"
import { ListenButton } from "@/components/listen-button"
import { useAuth } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/require-auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useShuffledSession } from "@/hooks/use-shuffled-session"
import { vocabByLevel } from "@/lib/content"
import { queueCardProgress } from "@/lib/progress-client"
import { can, planOf } from "@/lib/membership"
import { PRACTICE_SIZE } from "@/lib/shuffle"
import { savePracticeResult } from "@/lib/store"
import type { HskLevel } from "@/lib/types"

export function VocabTool({ level }: { level: HskLevel }) {
  return (
    <RequireAuth>
      <VocabInner level={level} />
    </RequireAuth>
  )
}

function VocabInner({ level }: { level: HskLevel }) {
  const { user } = useAuth()
  const pool = vocabByLevel(level)
  const { items: deck, poolSize, reshuffle } = useShuffledSession(pool, PRACTICE_SIZE.vocab)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)
  const [done, setDone] = useState(false)
  const ratedIds = useRef(new Set<string>())
  const card = deck[index]

  function rate(knew: boolean) {
    if (!user || !card || ratedIds.current.has(card.id)) return
    ratedIds.current.add(card.id)

    const nextKnown = known + (knew ? 1 : 0)
    const isLast = index + 1 >= deck.length

    if (can.srs(planOf(user))) {
      queueCardProgress({
        userId: user.id,
        vocabId: card.id,
        quality: knew ? 4 : 1,
        enroll: true,
        practice: isLast
          ? { hskLevel: level, tool: "vocab", score: nextKnown, total: deck.length }
          : undefined,
      })
    } else if (isLast) {
      void savePracticeResult({
        userId: user.id,
        hskLevel: level,
        tool: "vocab",
        score: nextKnown,
        total: deck.length,
      })
    }

    setKnown(nextKnown)
    if (isLast) {
      setDone(true)
      return
    }
    setIndex((value) => value + 1)
    setFlipped(false)
  }

  if (!deck.length) return <p>No vocabulary for this level.</p>
  if (done) {
    return (
      <Card>
        <CardContent className="space-y-3 pt-6">
          <p className="text-lg font-medium">Set finished</p>
          <p>
            Known this round: {known}/{deck.length}
          </p>
          <p className="text-sm text-muted-foreground">
            {poolSize} words in the HSK {level} bank. Cards went into SRS.
          </p>
          <Button
            onClick={() => {
              reshuffle()
              setIndex(0)
              setKnown(0)
              setDone(false)
              setFlipped(false)
              ratedIds.current.clear()
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
        <h1 className="text-2xl font-semibold">HSK {level} vocabulary</h1>
        <Badge variant="outline">
          {index + 1}/{deck.length} · pool {poolSize}
        </Badge>
      </div>
      <FlipCard
        key={card.id}
        flipped={flipped}
        onFlip={() => setFlipped((value) => !value)}
        front={
          <>
            <p className="font-cjk text-6xl font-medium">{card.hanzi}</p>
            <p className="text-sm text-muted-foreground">Tap to flip</p>
          </>
        }
        back={
          <>
            <p className="font-cjk text-6xl font-medium">{card.hanzi}</p>
            <p className="text-xl text-primary">{card.pinyin}</p>
            <p className="text-lg">{card.english}</p>
            <p className="font-cjk text-base text-muted-foreground">{card.exampleZh}</p>
            <p className="text-sm text-muted-foreground">{card.exampleEn}</p>
          </>
        }
      />
      <div className="flex flex-wrap gap-2">
        <ListenButton text={card.hanzi} label="Hear word" />
        <Button variant="outline" onClick={() => rate(false)}>
          Again
        </Button>
        <Button onClick={() => rate(true)}>Knew it</Button>
      </div>
    </div>
  )
}
