"use client"

import { useEffect, useRef, useState } from "react"
import { ListenButton } from "@/components/listen-button"
import { PinyinText } from "@/components/pinyin-text"
import { useAuth } from "@/components/auth/auth-provider"
import { PaywallOverlay } from "@/components/paywall-overlay"
import { RequireAuth } from "@/components/require-auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useShuffledSession } from "@/hooks/use-shuffled-session"
import { questionsBySkill } from "@/lib/content"
import { errorMessage } from "@/lib/errors"
import { PRACTICE_SIZE } from "@/lib/shuffle"
import { bestSpeechScore, speechDiff } from "@/lib/speech-score"
import { can, planOf } from "@/lib/membership"
import { savePracticeResult } from "@/lib/store"
import { cancelSpeech } from "@/lib/tts"
import type { HskLevel, Question } from "@/lib/types"

function targetsFor(question: Question) {
  return [
    ...(question.acceptedAnswers ?? []),
    question.promptZh,
    question.modelAnswer,
    question.audioText,
  ].filter((item): item is string => Boolean(item))
}

function pickRecorderMime() {
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"]
  return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
}

function usableTranscript(value: string) {
  return value.replace(/[.\s，。？！、]/g, "").trim()
}

export function SpeakingTool({ level }: { level: HskLevel }) {
  const { user } = useAuth()
  return (
    <RequireAuth>
      <PaywallOverlay locked={!can.speaking(planOf(user))}>
        <SpeakingInner level={level} />
      </PaywallOverlay>
    </RequireAuth>
  )
}

function SpeakingInner({ level }: { level: HskLevel }) {
  const { user } = useAuth()
  const pool = questionsBySkill(level, "speaking")
  const { items, poolSize, reshuffle } = useShuffledSession(pool, PRACTICE_SIZE.speaking)
  const [index, setIndex] = useState(0)
  const [recording, setRecording] = useState(false)
  const [scoring, setScoring] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [heard, setHeard] = useState("")
  const [score, setScore] = useState<number | null>(null)
  const [gradeNote, setGradeNote] = useState<string | null>(null)
  const [marks, setMarks] = useState<number[]>([])
  const [done, setDone] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const media = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const blobRef = useRef<Blob | null>(null)
  const question = items[index]
  const questionRef = useRef(question)
  questionRef.current = question

  useEffect(() => {
    return () => {
      media.current?.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  function applyScore(text: string) {
    const current = questionRef.current
    if (!current) return
    const trimmed = text.trim()
    setHeard(trimmed)
    if (!usableTranscript(trimmed)) {
      setScore(null)
      setGradeNote(
        trimmed
          ? "That was not a clear sentence. Record again and speak more slowly."
          : "No speech detected. Record again and speak clearly."
      )
      return
    }
    const value = bestSpeechScore(targetsFor(current), trimmed)
    if (value === null) {
      setScore(null)
      setGradeNote("No speech detected. Record again and speak clearly.")
      return
    }
    setScore(value)
    setGradeNote(null)
  }

  async function transcribeBlob(blob: Blob) {
    setScoring(true)
    setGradeNote("Scoring your recording…")
    try {
      const { transcribeChinese } = await import("@/lib/whisper-client")
      const text = await transcribeChinese(blob, setGradeNote, can.whisperBase(planOf(user)))
      applyScore(text)
    } catch (err) {
      setScore(null)
      setGradeNote(errorMessage(err, "Could not score this recording."))
    } finally {
      setScoring(false)
    }
  }

  async function startRecord() {
    cancelSpeech()
    setHeard("")
    setScore(null)
    setGradeNote(null)
    blobRef.current = null
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mimeType = pickRecorderMime()
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
      chunks.current = []
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunks.current.push(event.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        const blob = new Blob(chunks.current, { type: recorder.mimeType || "audio/webm" })
        blobRef.current = blob
        setAudioUrl((current) => {
          if (current) URL.revokeObjectURL(current)
          return URL.createObjectURL(blob)
        })
        void transcribeBlob(blob)
      }
      media.current = recorder
      recorder.start()
      setRecording(true)
    } catch {
      setGradeNote("Microphone permission denied. Allow the mic for this site and try again.")
    }
  }

  function stopRecord() {
    setRecording(false)
    try {
      media.current?.stop()
    } catch {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }

  function grade() {
    if (heard) {
      applyScore(heard)
      return
    }
    if (blobRef.current) {
      void transcribeBlob(blobRef.current)
      return
    }
    setGradeNote("Record your answer first.")
  }

  async function next() {
    const passed = score !== null && score >= 60
    const nextMarks = [...marks, passed ? 1 : 0]
    setMarks(nextMarks)
    if (index + 1 >= items.length) {
      const total = nextMarks.reduce((sum, n) => sum + n, 0)
      if (user) {
        try {
          await savePracticeResult({
            userId: user.id,
            hskLevel: level,
            tool: "speaking",
            score: total,
            total: items.length,
          })
          setSaveError(null)
        } catch (err) {
          setSaveError(errorMessage(err, "Could not save this session to your account."))
        }
      }
      setDone(true)
      return
    }
    setIndex((value) => value + 1)
    setHeard("")
    setScore(null)
    setGradeNote(null)
    blobRef.current = null
    setAudioUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return null
    })
  }

  if (!items.length) return <p>No speaking prompts for this level.</p>
  if (done) {
    const total = marks.reduce((sum, n) => sum + n, 0)
    return (
      <Card>
        <CardContent className="space-y-3 pt-6">
          <p>Speaking score: {total}/{items.length} (60%+ recognition counts as a pass)</p>
          {saveError ? <p className="text-sm text-destructive">{saveError}</p> : null}
          <p className="text-sm text-muted-foreground">{poolSize} prompts in the bank.</p>
          <Button
            onClick={() => {
              reshuffle()
              setIndex(0)
              setMarks([])
              setDone(false)
              setHeard("")
              setScore(null)
              setGradeNote(null)
              setSaveError(null)
              blobRef.current = null
              setAudioUrl(null)
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
        <h1 className="text-2xl font-semibold">HSK {level} speaking</h1>
        <Badge variant="outline">
          {index + 1}/{items.length} · pool {poolSize}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Play the model, then record. You can replay your take. Scoring runs in your browser after
        you stop (first time downloads a small speech model).
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{question.prompt}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.promptZh ? (
            <PinyinText text={question.promptZh} level={level} force={level <= 2} className="text-2xl" />
          ) : null}
          {question.audioText ? <ListenButton text={question.audioText} label="Hear model" /> : null}
          <div className="flex flex-wrap items-center gap-2">
            {!recording ? (
              <Button onClick={() => void startRecord()} disabled={scoring}>
                Record
              </Button>
            ) : (
              <Button variant="destructive" onClick={stopRecord}>
                Stop
              </Button>
            )}
            {audioUrl ? <audio controls src={audioUrl} className="h-10" /> : null}
            <Button variant="outline" onClick={grade} disabled={recording || scoring}>
              Score
            </Button>
          </div>
          {recording ? <p className="text-sm text-muted-foreground">Recording… speak now, then press Stop.</p> : null}
          {gradeNote ? <p className="text-sm text-muted-foreground">{gradeNote}</p> : null}
          {heard || score !== null ? (
            <div className="space-y-2 rounded-lg border border-border/60 p-3 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Computer heard
                </p>
                {heard ? (
                  <SpeechDiff
                    expected={question.modelAnswer || question.promptZh || targetsFor(question)[0] || ""}
                    heard={heard}
                    level={level}
                  />
                ) : (
                  <p className="mt-1 text-muted-foreground">Nothing was recognized.</p>
                )}
              </div>
              {score !== null ? (
                <p className="font-medium">Recognition score: {score}%</p>
              ) : null}
              {question.modelAnswer ? (
                <p className="text-muted-foreground">
                  Target: <PinyinText text={question.modelAnswer} level={level} />
                </p>
              ) : null}
              {question.explanation && score !== null ? (
                <p className="text-muted-foreground">{question.explanation}</p>
              ) : null}
            </div>
          ) : null}
          <Button onClick={() => void next()} disabled={recording || scoring}>
            {index + 1 >= items.length ? "Finish" : "Next"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function SpeechDiff({ expected, heard }: { expected: string; heard: string; level: HskLevel }) {
  const marks = speechDiff(expected, heard)
  return (
    <div className="mt-1 space-y-2 font-cjk text-xl">
      <p>
        {marks.heard.map((mark, index) => (
          <span key={`h-${index}`} className={mark.ok ? "text-emerald-400" : "text-destructive"}>
            {mark.char}
          </span>
        ))}
      </p>
      <p className="text-xs font-sans uppercase tracking-wide text-muted-foreground">Target match</p>
      <p>
        {marks.expected.map((mark, index) => (
          <span key={`e-${index}`} className={mark.ok ? "text-emerald-400" : "text-amber-400"}>
            {mark.char}
          </span>
        ))}
      </p>
    </div>
  )
}
