"use client"

import { useEffect, useRef, useState } from "react"
import { FlipCard } from "@/components/flash-card"
import { ListenButton } from "@/components/listen-button"
import { useAuth } from "@/components/auth/auth-provider"
import { PageLoader } from "@/components/page-loader"
import { PaywallOverlay } from "@/components/paywall-overlay"
import { RequireAuth } from "@/components/require-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { vocabById } from "@/lib/content"
import { queueCardProgress } from "@/lib/progress-client"
import { isDue } from "@/lib/srs"
import { listSrsCards } from "@/lib/store"
import { can, planOf } from "@/lib/membership"
import type { SrsCard, VocabItem } from "@/lib/types"

type DueItem = { card: SrsCard; vocab: VocabItem }

export function SrsReview() {
  const { user } = useAuth()
  return (
    <RequireAuth>
      <PaywallOverlay locked={!can.srs(planOf(user))}>
        <SrsInner />
      </PaywallOverlay>
    </RequireAuth>
  )
}

function SrsInner() {
  const { user } = useAuth()
  const [queue, setQueue] = useState<DueItem[]>([])
  const [deckCount, setDeckCount] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [reviewed, setReviewed] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ratedIds = useRef(new Set<string>())

  useEffect(() => {
    if (!user) return
    setLoading(true)
    setError(null)
    void listSrsCards(user.id)
      .then((cards) => {
        setDeckCount(cards.length)
        setQueue(
          cards
            .filter((card) => isDue(card))
            .map((card) => {
              const vocab = vocabById(card.vocabId)
              return vocab ? { card, vocab } : null
            })
            .filter((item): item is DueItem => Boolean(item))
        )
      })
      .catch(() => setError("Could not load SRS cards."))
      .finally(() => setLoading(false))
  }, [user])

  function rate(quality: number) {
    const current = queue[0]
    if (!user || !current || ratedIds.current.has(current.vocab.id)) return
    ratedIds.current.add(current.vocab.id)

    const remaining = queue.slice(1)
    const nextReviewed = reviewed + 1
    const again = quality < 3
    const nextQueue = again ? [...remaining, current] : remaining

    queueCardProgress({
      userId: user.id,
      vocabId: current.vocab.id,
      quality,
      practice: nextQueue.length
        ? undefined
        : {
            hskLevel: current.vocab.hskLevel,
            tool: "srs",
            score: nextReviewed,
            total: nextReviewed,
          },
    })

    if (again) ratedIds.current.delete(current.vocab.id)
    setReviewed(nextReviewed)
    setQueue(nextQueue)
    setFlipped(false)
  }

  if (loading) return <PageLoader label="Loading due cards…" />
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
      </Card>
    )
  }
  if (!queue.length) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          {deckCount
            ? `No cards are due right now. ${deckCount} saved in your deck — they return when their interval is up.`
            : "No cards are due. Study a vocabulary deck first, then come back."}
        </CardContent>
      </Card>
    )
  }

  const item = queue[0]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Spaced repetition</h1>
        <p className="text-sm text-muted-foreground">
          {queue.length} due · {reviewed} reviewed
        </p>
      </div>
      <FlipCard
        key={item.vocab.id}
        flipped={flipped}
        onFlip={() => setFlipped((v) => !v)}
        front={
          <>
            <p className="font-cjk text-6xl">{item.vocab.hanzi}</p>
            <p className="text-sm text-muted-foreground">Tap to reveal</p>
          </>
        }
        back={
          <>
            <p className="font-cjk text-6xl">{item.vocab.hanzi}</p>
            <p className="text-xl text-primary">{item.vocab.pinyin}</p>
            <p>{item.vocab.english}</p>
          </>
        }
      />
      <div className="flex flex-wrap gap-2">
        <ListenButton text={item.vocab.hanzi} />
        <Button variant="outline" onClick={() => rate(1)}>
          Again
        </Button>
        <Button variant="secondary" onClick={() => rate(3)}>
          Hard
        </Button>
        <Button onClick={() => rate(4)}>Good</Button>
        <Button variant="outline" onClick={() => rate(5)}>
          Easy
        </Button>
      </div>
    </div>
  )
}
