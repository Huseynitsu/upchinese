"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { PaywallOverlay } from "@/components/paywall-overlay"
import { RequireAuth } from "@/components/require-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { vocabById } from "@/lib/content"
import { errorMessage } from "@/lib/errors"
import { can, planOf } from "@/lib/membership"
import { deleteMistake, listMistakes } from "@/lib/store"
import type { MistakeItem } from "@/lib/types"

export function MistakeNotebook() {
  const { user } = useAuth()
  return (
    <RequireAuth>
      <PaywallOverlay locked={!can.notebook(planOf(user))} premium>
        <MistakeInner />
      </PaywallOverlay>
    </RequireAuth>
  )
}

function MistakeInner() {
  const { user } = useAuth()
  const [rows, setRows] = useState<MistakeItem[]>([])
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    if (!user) return
    try {
      setRows(await listMistakes(user.id))
      setError(null)
    } catch (err) {
      setError(errorMessage(err, "Could not load mistakes."))
    }
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  if (!user) return null

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Error notebook</h1>
        <p className="text-sm text-muted-foreground">Words and items you missed. Drill them again from the matching tool.</p>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {!rows.length ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No mistakes saved yet. Wrong quiz, dictation, and exam answers land here.
          </CardContent>
        </Card>
      ) : (
        rows.map((row) => {
          const vocab = vocabById(row.vocabId)
          return (
            <Card key={`${row.vocabId}-${row.skill}`}>
              <CardHeader>
                <CardTitle className="font-cjk text-2xl">
                  {vocab?.hanzi ?? row.prompt}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">
                    {vocab ? `${vocab.pinyin} · ${vocab.english}` : row.prompt}
                  </p>
                  <p className="text-muted-foreground">
                    {row.skill} · missed {row.times}×
                  </p>
                </div>
                <div className="flex gap-2">
                  {vocab ? (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/hsk/${vocab.hskLevel}/vocab`}>Practice</Link>
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      void deleteMistake(user.id, row.vocabId, row.skill).then(() => refresh())
                    }
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
