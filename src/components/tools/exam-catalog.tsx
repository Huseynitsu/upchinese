"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { PaywallOverlay } from "@/components/paywall-overlay"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { papersForLevel, paperSummary } from "@/lib/exams/catalog"
import { errorMessage } from "@/lib/errors"
import { listExamAttempts } from "@/lib/store"
import { can, planOf } from "@/lib/membership"
import type { ExamAttempt, HskLevel } from "@/lib/types"

export function ExamCatalog({ level }: { level: HskLevel }) {
  const { user } = useAuth()
  const papers = papersForLevel(level).map(paperSummary)
  const [attempts, setAttempts] = useState<ExamAttempt[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    void listExamAttempts(user.id)
      .then((rows) => {
        setAttempts(rows)
        setError(null)
      })
      .catch((err) => setError(errorMessage(err, "Could not load exam history.")))
  }, [user])

  return (
    <PaywallOverlay locked={!can.exam(planOf(user))}>
      <div className="mx-auto max-w-4xl space-y-6 overflow-x-auto">
        <div className="space-y-2 text-neutral-100">
          <p className="text-sm uppercase tracking-wide text-neutral-400">HSK {level} · 模拟试卷</p>
          <h1 className="text-2xl font-semibold sm:text-3xl">Mock exams</h1>
          <p className="max-w-2xl text-sm text-neutral-300">
            Five original papers in the official booklet format (codes like my-hsk). Listening uses
            on-device Chinese TTS — not copyrighted Hanban recordings.
          </p>
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {papers.map((paper) => {
            const last = attempts.find((item) => item.examId === paper.code && item.hskLevel === level)
            return (
              <Card key={paper.code} className="border-white/10 bg-white text-neutral-900">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="font-mono">{paper.code}</CardTitle>
                    <Badge variant="outline">{paper.itemCount} questions</Badge>
                  </div>
                  <CardDescription>
                    {paper.titleEn} · {paper.totalMin} min
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-neutral-600">
                    {last
                      ? `Last: ${last.totalScore}/${last.totalPossible} · ${last.passed ? "Passed" : "Not yet"}`
                      : "Not attempted"}
                  </p>
                  <Button asChild className="min-h-9">
                    <Link href={`/hsk/${level}/exam/${paper.code}`}>Open paper</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </PaywallOverlay>
  )
}
