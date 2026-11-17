"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/require-auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { vocabByLevel } from "@/lib/content"
import { errorMessage } from "@/lib/errors"
import { HSK_LEVELS } from "@/lib/levels"
import { can, planLabel, planOf } from "@/lib/membership"
import { loadAccountProgress } from "@/lib/store"
import type { ExamAttempt, HskLevel, PracticeResult, SrsCard } from "@/lib/types"
import { PaywallOverlay } from "@/components/paywall-overlay"

export function AccountDashboard() {
  return (
    <RequireAuth>
      <DashboardInner />
    </RequireAuth>
  )
}

function DashboardInner() {
  const { user, setDisplayName, setLevel } = useAuth()
  const [name, setName] = useState(user?.displayName ?? "")
  const [results, setResults] = useState<PracticeResult[]>([])
  const [exams, setExams] = useState<ExamAttempt[]>([])
  const [srs, setSrs] = useState<SrsCard[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    setName(user.displayName)
    void loadAccountProgress(user.id)
      .then((data) => {
        setResults(data.results)
        setExams(data.exams)
        setSrs(data.srs)
        setError(null)
      })
      .catch((err) => setError(errorMessage(err, "Could not load progress.")))
  }, [user])

  const toolStats = useMemo(() => {
    const map = new Map<string, { score: number; total: number; count: number }>()
    for (const result of results) {
      const current = map.get(result.tool) ?? { score: 0, total: 0, count: 0 }
      current.score += result.score
      current.total += result.total
      current.count += 1
      map.set(result.tool, current)
    }
    return [...map.entries()]
  }, [results])

  if (!user) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Account</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <p className="text-sm text-muted-foreground">Plan: {planLabel(planOf(user))}</p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display name</Label>
            <div className="flex gap-2">
              <Input id="displayName" value={name} onChange={(event) => setName(event.target.value)} />
              <Button
                onClick={() => {
                  setError(null)
                  void setDisplayName(name).catch((err) =>
                    setError(errorMessage(err, "Could not save display name."))
                  )
                }}
              >
                Save
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Current HSK goal</Label>
            <Select
              value={String(user.currentHskLevel)}
              onValueChange={(value) => {
                setError(null)
                void setLevel(Number(value) as HskLevel).catch((err) =>
                  setError(errorMessage(err, "Could not save HSK goal."))
                )
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HSK_LEVELS.map((level) => (
                  <SelectItem key={level} value={String(level)}>
                    HSK {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <PaywallOverlay locked={!can.accountProgress(planOf(user))}>
      <div className="grid gap-4 md:grid-cols-3">
        {HSK_LEVELS.map((level) => {
          const totalVocab = vocabByLevel(level).length
          const known = srs.filter((card) =>
            vocabByLevel(level).some((item) => item.id === card.vocabId)
          ).length
          const bestExam = exams
            .filter((exam) => exam.hskLevel === level)
            .sort((a, b) => b.totalScore / b.totalPossible - a.totalScore / a.totalPossible)[0]
          const pct = totalVocab ? Math.round((known / totalVocab) * 100) : 0
          return (
            <Card key={level}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>HSK {level}</CardTitle>
                <Badge variant="outline">{pct}%</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={pct} />
                <p className="text-sm text-muted-foreground">
                  SRS cards: {known}/{totalVocab}
                </p>
                <p className="text-sm text-muted-foreground">
                  Best exam:{" "}
                  {bestExam
                    ? `${bestExam.totalScore}/${bestExam.totalPossible}${bestExam.passed ? " · pass" : ""}`
                    : "—"}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/hsk/${level}`}>Open level</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tool accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          {toolStats.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tool</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {toolStats.map(([tool, stat]) => (
                  <TableRow key={tool}>
                    <TableCell className="capitalize">{tool}</TableCell>
                    <TableCell>{stat.count}</TableCell>
                    <TableCell>
                      {stat.score}/{stat.total} ({stat.total ? Math.round((stat.score / stat.total) * 100) : 0}%)
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No practice results yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mock exam history</CardTitle>
        </CardHeader>
        <CardContent>
          {exams.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Paper</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>HSK {exam.hskLevel}</TableCell>
                    <TableCell className="font-mono">{exam.examId}</TableCell>
                    <TableCell>
                      {exam.totalScore}/{exam.totalPossible}
                    </TableCell>
                    <TableCell>{exam.passed ? "Passed" : "Not yet"}</TableCell>
                    <TableCell>{new Date(exam.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No exams yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SRS</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">{srs.length} cards in your deck.</p>
          <Button asChild>
            <Link href="/review">Review due cards</Link>
          </Button>
        </CardContent>
      </Card>
      </PaywallOverlay>
    </div>
  )
}
