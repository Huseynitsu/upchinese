"use client"

import { useEffect, useRef, useState } from "react"
import { QuizEngine } from "@/components/tools/quiz-engine"
import { PaywallOverlay } from "@/components/paywall-overlay"
import { RequireAuth } from "@/components/require-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useShuffledSession } from "@/hooks/use-shuffled-session"
import { questionsBySkill, strokeSafeVocab } from "@/lib/content"
import { PRACTICE_SIZE } from "@/lib/shuffle"
import { can, planOf } from "@/lib/membership"
import type { HskLevel, VocabItem } from "@/lib/types"
import { useAuth } from "@/components/auth/auth-provider"

export function HanziTool({ level }: { level: HskLevel }) {
  const { user } = useAuth()
  const questions = questionsBySkill(level, "hanzi")
  const strokePool = strokeSafeVocab(level)

  return (
    <RequireAuth>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">HSK {level} hanzi</h1>
        <Tabs defaultValue="recognize">
          <TabsList>
            <TabsTrigger value="recognize">Recognize</TabsTrigger>
            <TabsTrigger value="strokes">Stroke order</TabsTrigger>
          </TabsList>
          <TabsContent value="recognize" className="mt-4">
            <QuizEngine title="Character recognition" tool="hanzi" level={level} questions={questions} gated={false} />
          </TabsContent>
          <TabsContent value="strokes" className="mt-4">
            <PaywallOverlay locked={!can.strokes(planOf(user))}>
              <StrokePractice chars={strokePool} />
            </PaywallOverlay>
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuth>
  )
}

function StrokePractice({ chars }: { chars: VocabItem[] }) {
  const { items, poolSize, reshuffle } = useShuffledSession(chars, PRACTICE_SIZE.strokes)
  const [index, setIndex] = useState(0)
  const item = items[index]
  if (!item) return <p className="text-sm text-muted-foreground">No stroke-practice characters.</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {item.hanzi} · {item.pinyin} · {item.english}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <HanziWriterPad character={item.hanzi[0]} />
        <p className="text-xs text-muted-foreground">
          {index + 1}/{items.length} · pool {poolSize}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={index === 0}
            onClick={() => setIndex((value) => value - 1)}
          >
            Previous
          </Button>
          <Button
            disabled={index >= items.length - 1}
            onClick={() => setIndex((value) => value + 1)}
          >
            Next character
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              reshuffle()
              setIndex(0)
            }}
          >
            Shuffle
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function HanziWriterPad({ character }: { character: string }) {
  const host = useRef<HTMLDivElement>(null)
  const writerRef = useRef<{
    animateCharacter: () => void
    quiz: () => void
  } | null>(null)

  useEffect(() => {
    let cancelled = false
    async function mount() {
      if (!host.current) return
      host.current.innerHTML = ""
      const HanziWriter = (await import("hanzi-writer")).default
      if (cancelled || !host.current) return
      const writer = HanziWriter.create(host.current, character, {
        width: 260,
        height: 260,
        padding: 10,
        showOutline: true,
        strokeColor: "#f5b942",
        outlineColor: "#3f3f46",
        drawingColor: "#fafafa",
      })
      writerRef.current = writer
    }
    void mount()
    return () => {
      cancelled = true
      if (host.current) host.current.innerHTML = ""
    }
  }, [character])

  return (
    <div className="space-y-3">
      <div
        ref={host}
        className="mx-auto flex size-[260px] items-center justify-center rounded-xl border bg-zinc-950"
      />
      <div className="flex justify-center gap-2">
        <Button type="button" variant="outline" onClick={() => writerRef.current?.animateCharacter()}>
          Animate
        </Button>
        <Button type="button" onClick={() => writerRef.current?.quiz()}>
          Quiz strokes
        </Button>
      </div>
    </div>
  )
}
