"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { FlipCard } from "@/components/flash-card"
import { ListenButton } from "@/components/listen-button"
import { useAuth } from "@/components/auth/auth-provider"
import { PaywallOverlay } from "@/components/paywall-overlay"
import { RequireAuth } from "@/components/require-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { questionsBySkill, vocabByLevel } from "@/lib/content"
import { can, planOf } from "@/lib/membership"
import { shuffle } from "@/lib/shuffle"
import { listPracticeResults, savePracticeResult } from "@/lib/store"

function localDay(iso: string) {
  const date = new Date(iso)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function streakFrom(dates: string[]) {
  const days = new Set(dates.map(localDay))
  let streak = 0
  const cursor = new Date()
  for (let i = 0; i < 365; i += 1) {
    const key = localDay(cursor.toISOString())
    if (!days.has(key)) break
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function DailyPath() {
  const { user } = useAuth()
  return (
    <RequireAuth>
      <PaywallOverlay locked={!can.dailyPath(planOf(user))} premium>
        <DailyInner />
      </PaywallOverlay>
    </RequireAuth>
  )
}

function DailyInner() {
  const { user } = useAuth()
  const level = user?.currentHskLevel ?? 1
  const cards = useMemo(() => shuffle(vocabByLevel(level)).slice(0, 8), [level])
  const listening = useMemo(
    () => shuffle(questionsBySkill(level, "listening").filter((item) => item.choices?.length)).slice(0, 8),
    [level]
  )
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [listenIndex, setListenIndex] = useState(0)
  const [listenPicked, setListenPicked] = useState<string | null>(null)
  const [listenScore, setListenScore] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    if (!user) return
    void listPracticeResults(user.id).then((rows) => setStreak(streakFrom(rows.map((row) => row.createdAt))))
  }, [user])

  const card = cards[cardIndex]
  const listen = listening[listenIndex]

  async function markDay() {
    if (!user) return
    await savePracticeResult({
      userId: user.id,
      hskLevel: level,
      tool: "vocab",
      score: 1,
      total: 1,
      payload: { daily: true },
    })
    setStreak((value) => Math.max(value, 1))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Today</h1>
        <p className="text-sm text-muted-foreground">
          HSK {level} · {streak} day streak. 8 cards, then 8 listening items
          {can.speaking(planOf(user)) ? ", then speaking" : ""}.
        </p>
      </div>
      {card ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Vocabulary {cardIndex + 1}/{cards.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <FlipCard
              key={card.id}
              flipped={flipped}
              onFlip={() => setFlipped((value) => !value)}
              front={<p className="font-cjk text-6xl">{card.hanzi}</p>}
              back={
                <>
                  <p className="font-cjk text-6xl">{card.hanzi}</p>
                  <p className="text-primary">{card.pinyin}</p>
                  <p>{card.english}</p>
                </>
              }
            />
            <ListenButton text={card.hanzi} />
            <Button
              onClick={() => {
                if (cardIndex + 1 >= cards.length) {
                  void markDay()
                }
                setCardIndex((value) => Math.min(value + 1, cards.length - 1))
                setFlipped(false)
              }}
            >
              {cardIndex + 1 >= cards.length ? "Cards done" : "Next card"}
            </Button>
          </CardContent>
        </Card>
      ) : null}
      {listen ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Listening {listenIndex + 1}/{listening.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>{listen.prompt}</p>
            {listen.audioText ? <ListenButton text={listen.audioText} /> : null}
            <div className="grid gap-2">
              {(listen.choices ?? []).map((choice) => (
                <Button
                  key={choice.key}
                  variant={listenPicked === choice.key ? "secondary" : "outline"}
                  className="justify-start"
                  disabled={Boolean(listenPicked)}
                  onClick={() => {
                    setListenPicked(choice.key)
                    if (choice.key === listen.correctKey) setListenScore((value) => value + 1)
                  }}
                >
                  {choice.key}. {choice.text}
                </Button>
              ))}
            </div>
            {listenPicked ? (
              <Button
                onClick={() => {
                  setListenIndex((value) => Math.min(value + 1, listening.length - 1))
                  setListenPicked(null)
                }}
              >
                {listenIndex + 1 >= listening.length
                  ? `Listening done · ${listenScore}/${listening.length}`
                  : "Next"}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
      {can.speaking(planOf(user)) ? (
        <Button asChild>
          <Link href={`/hsk/${level}/speaking`}>Open speaking</Link>
        </Button>
      ) : null}
    </div>
  )
}
