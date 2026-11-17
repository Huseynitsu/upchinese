"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { BrandLogo } from "@/components/brand-logo"
import { ExamPicture } from "@/components/exam-picture"
import { ExamPhoto } from "@/components/exam-photo"
import { PaywallOverlay } from "@/components/paywall-overlay"
import { RequireAuth } from "@/components/require-auth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { explainExamItem } from "@/lib/exams/explain"
import { officialPaper, allExamItems } from "@/lib/exams/papers"
import { scoreExamItem } from "@/lib/exams/score"
import { errorMessage } from "@/lib/errors"
import { can, planOf } from "@/lib/membership"
import { recordMistake, saveExamAttempt } from "@/lib/store"
import { PinyinText } from "@/components/pinyin-text"
import { cancelSpeech, speakExamItem, speakListeningIntro } from "@/lib/tts"
import { cn } from "@/lib/utils"
import type { ExamBlock, ExamItem, ExamPart, HskLevel, OfficialPaper } from "@/lib/types"

export function ExamTool({ level, code }: { level: HskLevel; code: string }) {
  const { user } = useAuth()
  return (
    <RequireAuth>
      <PaywallOverlay locked={!can.exam(planOf(user))}>
        <ExamInner level={level} code={code} />
      </PaywallOverlay>
    </RequireAuth>
  )
}

function ExamInner({ level, code }: { level: HskLevel; code: string }) {
  const { user } = useAuth()
  const paper = useMemo(() => officialPaper(level, code), [level, code])
  const items = useMemo(() => allExamItems(paper), [paper])
  const [phase, setPhase] = useState<"cover" | "exam" | "result">("cover")
  const [blockIndex, setBlockIndex] = useState(0)
  const [partIndex, setPartIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [remaining, setRemaining] = useState(0)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [listeningDone, setListeningDone] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [diagnostics, setDiagnostics] = useState<
    { id: string; title: string; score: number; total: number }[]
  >([])
  const [sectionSummary, setSectionSummary] = useState<Record<string, { score: number; total: number }>>({})
  const [review, setReview] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const startedAt = useRef<number>(0)
  const playCursor = useRef(0)
  const finishingRef = useRef(false)

  const block = paper.blocks[blockIndex]
  const part = block?.parts[partIndex]
  const listenBlock = paper.blocks.find((item) => item.skill === "listening")

  useEffect(() => {
    if (phase !== "exam") return
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          void goNextBlock()
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, blockIndex, showTransfer])

  useEffect(() => {
    return () => cancelSpeech()
  }, [])

  function setAnswer(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }))
  }

  function startExam() {
    startedAt.current = Date.now()
    setPhase("exam")
    setBlockIndex(0)
    setPartIndex(0)
    setRemaining(paper.blocks[0].timeMin * 60)
    window.setTimeout(() => {
      if (!listenBlock) return
      speakListeningIntro(listenBlock.parts.length, listenBlock.itemCount, () => {
        playCursor.current = 0
        playListeningQueue(allExamItems({ ...paper, blocks: [listenBlock] }))
      })
    }, 400)
  }

  function playListeningQueue(queue: ExamItem[]) {
    const item = queue[playCursor.current]
    if (!item?.audio?.length) {
      setListeningDone(true)
      setPlayingId(null)
      return
    }
    setPlayingId(item.id)
    const partIdx = listenBlock?.parts.findIndex((entry) => entry.items.some((row) => row.id === item.id)) ?? 0
    setPartIndex(Math.max(0, partIdx))
    speakExamItem(item, {
      onEnd: () => {
        playCursor.current += 1
        window.setTimeout(() => playListeningQueue(queue), 700)
      },
    })
  }

  async function goNextBlock(finalAnswers = answers) {
    cancelSpeech()
    const current = paper.blocks[blockIndex]
    if (current?.skill === "listening" && !showTransfer) {
      setListeningDone(true)
      setPlayingId(null)
      setShowTransfer(true)
      setRemaining(5 * 60)
      return
    }
    setShowTransfer(false)
    if (blockIndex + 1 >= paper.blocks.length) {
      await finishExam(finalAnswers)
      return
    }
    const next = blockIndex + 1
    setBlockIndex(next)
    setPartIndex(0)
    setRemaining(paper.blocks[next].timeMin * 60)
  }

  async function finishExam(finalAnswers: Record<string, string>) {
    if (finishingRef.current) return
    finishingRef.current = true
    cancelSpeech()
    const sectionScores: Record<string, { score: number; total: number }> = {}
    let totalScore = 0
    let totalPossible = 0
    for (const examBlock of paper.blocks) {
      const blockItems = examBlock.parts.flatMap((entry) => entry.items)
      let score = 0
      for (const item of blockItems) {
        totalPossible += 1
        score += scoreExamItem(item, finalAnswers[item.id])
      }
      sectionScores[examBlock.skill] = { score, total: blockItems.length }
      totalScore += score
    }
    const percent = totalPossible ? (totalScore / totalPossible) * 100 : 0
    const passed = percent >= paper.passPercent
    const partScores = paper.blocks.flatMap((examBlock) =>
      examBlock.parts.map((examPart) => {
        const score = examPart.items.reduce((sum, item) => sum + scoreExamItem(item, finalAnswers[item.id]), 0)
        return {
          id: examPart.id,
          title: `${examBlock.titleEn} · ${examPart.titleZh}`,
          score,
          total: examPart.items.length,
        }
      })
    )
    setResult(
      `${passed ? "Passed" : "Not yet"} · ${totalScore}/${totalPossible} (${Math.round(percent)}%)`
    )
    setSectionSummary(sectionScores)
    setDiagnostics(partScores)
    setReview(true)
    setPhase("result")

    if (user && can.notebook(planOf(user))) {
      for (const examBlock of paper.blocks) {
        for (const examPart of examBlock.parts) {
          for (const item of examPart.items) {
            if (!scoreExamItem(item, finalAnswers[item.id])) {
              void recordMistake({
                userId: user.id,
                vocabId: item.id,
                skill: "exam",
                prompt: item.question || item.stem || examPart.titleZh,
              })
            }
          }
        }
      }
    }
    if (!user) {
      setSaveError("Sign in to save this attempt to your account.")
      return
    }
    void saveExamAttempt({
      userId: user.id,
      hskLevel: level,
      examId: paper.code,
      sectionScores,
      totalScore,
      totalPossible,
      passed,
      durationSec: Math.round((Date.now() - startedAt.current) / 1000),
      answers: finalAnswers,
    })
      .then(() => setSaveError(null))
      .catch((err) => setSaveError(errorMessage(err, "Could not save this exam to your account.")))
  }

  if (phase === "cover") {
    return <CoverPage paper={paper} onStart={startExam} />
  }

  if (phase === "result") {
    const reviewRows = items.map((item) => ({
      item,
      answer: answers[item.id],
      info: explainExamItem(item, answers[item.id]),
    }))
    const mistakes = reviewRows.filter((row) => !row.info.correct)
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-6">
        <PaperSheet>
          <HeaderBand paper={paper} />
          <h2 className="mt-8 text-center text-2xl font-semibold text-neutral-900">成绩 Results</h2>
          <p className="mt-4 text-center text-xl text-neutral-800">{result}</p>
          <div className="mt-6 space-y-2 text-sm text-neutral-700">
            {paper.blocks.map((examBlock) => {
              const section = sectionSummary[examBlock.skill]
              return (
                <p key={examBlock.skill}>
                  {examBlock.titleZh} {examBlock.titleEn}
                  {section ? ` · ${section.score}/${section.total}` : ""}
                </p>
              )
            })}
          </div>
          <div className="mt-6 rounded-lg border border-neutral-200 p-4 text-left text-sm text-neutral-800">
            <p className="font-medium">
              {mistakes.length ? `Mistakes · ${mistakes.length}` : "No mistakes"}
            </p>
            {mistakes.length ? (
              <ol className="mt-3 space-y-4">
                {mistakes.map((row) => (
                  <li key={row.item.id} className="rounded-md bg-red-50 p-3 text-red-950">
                    <p className="font-medium">
                      #{row.item.number} · Your answer: {row.info.yourLabel} · Correct: {row.info.correctLabel}
                    </p>
                    <p className="mt-1 leading-6 text-neutral-800">{row.info.explanation}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-neutral-600">Every marked answer matches the key.</p>
            )}
          </div>
          {can.examDiagnostics(planOf(user)) ? (
            <div className="mt-6 space-y-2 rounded-lg border border-neutral-200 p-4 text-left text-sm text-neutral-800">
              <p className="font-medium">Premium diagnostics</p>
              {diagnostics
                .slice()
                .sort((a, b) => a.score / Math.max(a.total, 1) - b.score / Math.max(b.total, 1))
                .map((part) => (
                  <p key={part.id}>
                    {part.title}: {part.score}/{part.total}
                    {part.total && part.score / part.total < 0.6 ? " · weak" : ""}
                  </p>
                ))}
            </div>
          ) : null}
          {saveError ? (
            <p className="mt-6 text-center text-sm text-red-700">{saveError}</p>
          ) : (
            <p className="mt-6 text-center text-sm text-neutral-500">
              Saved to your account when your plan allows it.
            </p>
          )}
          <div className="mt-8 flex justify-center gap-3">
            <Button onClick={() => setReview((value) => !value)}>
              {review ? "Hide paper" : "Review paper"}
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              New attempt
            </Button>
          </div>
        </PaperSheet>
        {review ? (
          <PaperSheet>
            {paper.blocks.map((examBlock) =>
              examBlock.parts.map((examPart) => (
                <PartPage
                  key={examPart.id}
                  paper={paper}
                  block={examBlock}
                  part={examPart}
                  answers={answers}
                  playingId={null}
                  reveal
                  onAnswer={() => undefined}
                  onPlay={() => undefined}
                />
              ))
            )}
          </PaperSheet>
        ) : null}
      </div>
    )
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-black/30 px-3 py-2 text-sm text-neutral-100">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-white/30 text-white">
              {paper.code}
            </Badge>
            <span>
              {showTransfer ? "填写听力答案" : `${block.titleZh} ${block.titleEn}`}
            </span>
            {playingId ? <span className="text-amber-300">播放第 {items.find((item) => item.id === playingId)?.number} 题</span> : null}
          </div>
          <span className="font-mono">{formatTime(remaining)}</span>
        </div>
        <Progress value={block ? (remaining / (block.timeMin * 60)) * 100 : 0} />
        {showTransfer ? (
          <PaperSheet>
            <h2 className="text-center text-2xl font-semibold text-neutral-900">听力结束</h2>
            <p className="mt-6 text-center leading-8 text-neutral-800">
              听力结束后，有 5 分钟填写答案。
              <br />
              Use this time to finish Listening answers, then continue to Reading.
            </p>
            <div className="mt-8 flex justify-center">
              <Button onClick={() => void goNextBlock()}>Continue to {paper.blocks[blockIndex + 1]?.titleEn ?? "next"}</Button>
            </div>
          </PaperSheet>
        ) : (
          <PaperSheet>
            <HeaderBand paper={paper} />
            {part ? (
              <PartPage
                paper={paper}
                block={block}
                part={part}
                answers={answers}
                playingId={playingId}
                reveal={false}
                onAnswer={setAnswer}
                onPlay={(item) => {
                  if (block.skill !== "listening") return
                  setPlayingId(item.id)
                  speakExamItem(item, { onEnd: () => setPlayingId(null) })
                }}
              />
            ) : null}
            <div className="mt-10 flex flex-wrap justify-between gap-2">
              <Button
                variant="outline"
                className="min-h-9"
                disabled={partIndex === 0}
                onClick={() => setPartIndex((value) => Math.max(0, value - 1))}
              >
                上一页 Previous
              </Button>
              {partIndex + 1 < block.parts.length ? (
                <Button className="min-h-9" onClick={() => setPartIndex((value) => value + 1)}>下一页 Next</Button>
              ) : (
                <Button className="min-h-9 whitespace-normal" onClick={() => void goNextBlock()}>
                  {blockIndex + 1 >= paper.blocks.length ? "交卷 Submit" : listeningDone || block.skill !== "listening" ? "下一部分 Next section" : "结束听力 End listening"}
                </Button>
              )}
            </div>
          </PaperSheet>
        )}
      </div>
      <AnswerSheet
        paper={paper}
        answers={answers}
        currentPart={part}
        onJump={(item) => {
          const found = paper.blocks.findIndex((examBlock) =>
            examBlock.parts.some((examPart) => examPart.items.some((row) => row.id === item.id))
          )
          const foundPart = paper.blocks[found]?.parts.findIndex((examPart) =>
            examPart.items.some((row) => row.id === item.id)
          )
          if (found >= 0 && (found < blockIndex || paper.blocks[found].skill === block.skill)) {
            setBlockIndex(found)
            setPartIndex(Math.max(0, foundPart))
            setShowTransfer(false)
            setRemaining(paper.blocks[found].timeMin * 60)
          }
        }}
      />
    </div>
  )
}

function englishCoverNotes(paper: OfficialPaper) {
  const parts = paper.blocks
    .map((block, index) => `${index + 1}. ${block.titleEn} (${block.itemCount} questions, about ${block.timeMin} minutes)`)
    .join("; ")
  const notes = [`HSK (Level ${paper.hskLevel}) has ${paper.blocks.length} parts: ${parts}.`]
  if (paper.blocks.some((block) => block.skill === "listening")) {
    notes.push("After Listening, you have 5 minutes to fill in the answer sheet.")
  }
  notes.push(
    `The whole test takes about ${paper.totalMin} minutes (including 5 minutes for personal information).`
  )
  return notes
}

function CoverPage({ paper, onStart }: { paper: OfficialPaper; onStart: () => void }) {
  const levelNames = ["", "一级", "二级", "三级", "四级", "五级", "六级"]
  const notesEn = englishCoverNotes(paper)
  const noteCount = Math.max(paper.notes.length, notesEn.length)
  return (
    <div className="mx-auto max-w-[210mm] overflow-x-auto">
      <PaperSheet className="flex min-h-[80vh] flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 text-left">
            <p className="text-[11px] tracking-wide text-neutral-500 uppercase">
              Confucius Institute Headquarters (Hanban)
            </p>
            <p className="font-cjk text-sm text-neutral-700">国家汉办 / 孔子学院总部</p>
            <div className="flex items-center gap-3 pt-1">
              <BrandLogo
                className="text-neutral-900"
                markClassName="size-12 rounded-full bg-emerald-700 text-lg text-white"
              />
              <div className="font-cjk text-sm leading-5 text-neutral-700">汉语水平模拟考试</div>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-neutral-700">
            {paper.code}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center space-y-6 py-8 text-center">
          <h1 className="font-cjk text-3xl font-bold tracking-wide text-neutral-900 sm:text-4xl md:text-5xl">
            {paper.titleZh}
          </h1>
          <p className="text-lg text-neutral-700 sm:text-xl">HSK (Level {paper.hskLevel}) Sample Paper</p>
          <p className="font-cjk text-2xl text-neutral-800 sm:text-3xl">
            HSK（{levelNames[paper.hskLevel]}）模拟卷
          </p>
          <p className="text-base text-neutral-600">{paper.titleEn}</p>
          <div className="w-full max-w-lg space-y-3 text-left">
            <p className="text-center font-cjk text-xl tracking-[0.6em] text-neutral-900">注意 / Notes</p>
            <ol className="space-y-4 text-neutral-800">
              {Array.from({ length: noteCount }, (_, index) => (
                <li key={paper.notes[index] ?? notesEn[index] ?? index} className="space-y-1">
                  <p className="font-cjk">
                    {["一", "二", "三", "四", "五"][index] ?? index + 1}、
                    {paper.notes[index] ?? ""}
                  </p>
                  {notesEn[index] ? (
                    <p className="pl-6 text-sm leading-6 text-neutral-600">{notesEn[index]}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
          <span>Simulated paper · not an official Hanban exam</span>
          <span>模拟卷 · 非国家汉办官方试卷 · UpChinese</span>
        </div>
        <div className="mt-6 flex justify-center">
          <Button size="lg" onClick={onStart}>
            开始考试 Start
          </Button>
        </div>
        <div className="mt-4 text-center">
          <Button asChild variant="ghost" className="text-neutral-600">
            <Link href={`/hsk/${paper.hskLevel}/exam`}>全部试卷 All papers</Link>
          </Button>
        </div>
      </PaperSheet>
    </div>
  )
}

function HeaderBand({ paper }: { paper: OfficialPaper }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-2 border-b border-neutral-300 pb-4">
      <div className="flex items-center gap-2">
        <BrandLogo
          size="sm"
          className="text-neutral-800"
          markClassName="rounded-full bg-emerald-700 text-white"
        />
        <div>
          <span className="font-cjk text-sm text-neutral-700">新汉语水平考试 · 模拟卷</span>
          <p className="text-[11px] text-neutral-500">HSK (Level {paper.hskLevel}) Sample Paper</p>
        </div>
      </div>
      <span className="font-mono text-sm text-neutral-500">{paper.code}</span>
    </div>
  )
}

function PartPage({
  paper,
  block,
  part,
  answers,
  playingId,
  reveal,
  onAnswer,
  onPlay,
}: {
  paper: OfficialPaper
  block: ExamBlock
  part: ExamPart
  answers: Record<string, string>
  playingId: string | null
  reveal: boolean
  onAnswer: (id: string, value: string) => void
  onPlay: (item: ExamItem) => void
}) {
  return (
    <div className="font-cjk text-neutral-900">
      <h2 className="text-center text-2xl font-semibold tracking-widest">
        {block.titleZh.replace(/^[一二三]、/, "")}
      </h2>
      <h3 className="mt-6 text-lg font-medium">
        <PinyinText text={part.titleZh} level={paper.hskLevel} />
      </h3>
      <p className="mt-2 text-neutral-700">
        <PinyinText text={part.instructionZh} level={paper.hskLevel} />
      </p>
      {part.exampleZh && !isPictureJudgePart(part) ? (
        <p className="mt-2 text-sm text-neutral-500">
          例如：<PinyinText text={part.exampleZh} level={paper.hskLevel} />
        </p>
      ) : null}
      <div className="mt-6 space-y-8">
        {isPictureJudgePart(part) ? (
          <ListeningPictureJudge
            part={part}
            block={block}
            answers={answers}
            playingId={playingId}
            reveal={reveal}
            level={paper.hskLevel}
            onAnswer={onAnswer}
            onPlay={onPlay}
          />
        ) : (
          renderPartItems(part, block, paper, answers, playingId, reveal, onAnswer, onPlay)
        )}
      </div>
      <p className="sr-only">{paper.titleEn}</p>
    </div>
  )
}

function isPictureJudgePart(part: ExamPart) {
  return part.items.length > 0 && part.items.every((item) => item.format === "true-false" && item.picture)
}

function ListeningPictureJudge({
  part,
  block,
  answers,
  playingId,
  reveal,
  level,
  onAnswer,
  onPlay,
}: {
  part: ExamPart
  block: ExamBlock
  answers: Record<string, string>
  playingId: string | null
  reveal: boolean
  level: HskLevel
  onAnswer: (id: string, value: string) => void
  onPlay: (item: ExamItem) => void
}) {
  const examples = part.examples ?? []
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse border-[1.5px] border-neutral-900 text-neutral-900">
          <tbody>
            {examples.map((example, index) => (
              <tr key={`ex-${example.picture}-${index}`}>
                {index === 0 ? (
                  <td
                    rowSpan={examples.length}
                    className="w-20 border-[1.5px] border-neutral-900 px-3 text-center align-middle font-cjk text-lg sm:w-28 sm:text-xl"
                  >
                    例如:
                  </td>
                ) : null}
                <td className="border-[1.5px] border-neutral-900 bg-white py-5 text-center">
                  <ExamPhoto token={example.picture} className="mx-auto" />
                </td>
                <td className="w-24 border-[1.5px] border-neutral-900 text-center font-serif text-3xl sm:w-32">
                  {example.mark === "T" ? "√" : "×"}
                </td>
              </tr>
            ))}
            {part.items.map((item) => {
              const playing = playingId === item.id
              const info = reveal ? explainExamItem(item, answers[item.id]) : null
              return (
                <tr
                  key={item.id}
                  className={cn(
                    playing && "bg-[#fffbeb]",
                    info && (info.correct ? "bg-emerald-50" : "bg-red-50")
                  )}
                >
                  <td className="w-20 border-[1.5px] border-neutral-900 px-2 text-center align-middle font-serif text-xl sm:w-28 sm:text-2xl">
                    {item.number}.
                  </td>
                  <td className="border-[1.5px] border-neutral-900 bg-white py-5 text-center">
                    {block.skill === "listening" ? (
                      <button
                        type="button"
                        onClick={() => onPlay(item)}
                        className="mx-auto block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-900"
                        aria-label={`播放第 ${item.number} 题`}
                      >
                        <ExamPhoto token={item.picture} />
                      </button>
                    ) : (
                      <ExamPhoto token={item.picture} className="mx-auto" />
                    )}
                  </td>
                  <td className="w-24 border-[1.5px] border-neutral-900 px-2 text-center sm:w-32">
                    <div className="flex items-center justify-center gap-3 font-serif text-2xl">
                      <span className="text-neutral-500">（</span>
                      <JudgeMark
                        label="√"
                        selected={answers[item.id] === "T"}
                        onClick={() => onAnswer(item.id, "T")}
                      />
                      <JudgeMark
                        label="×"
                        selected={answers[item.id] === "F"}
                        onClick={() => onAnswer(item.id, "F")}
                      />
                      <span className="text-neutral-500">）</span>
                    </div>
                    {info ? (
                      <p className="mt-2 text-xs font-sans text-neutral-700">
                        {info.correct ? "Correct" : `Correct ${info.correctLabel}`}
                      </p>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {reveal
        ? part.items.map((item) => (
            <AnswerReveal key={`${item.id}-explain`} item={item} answer={answers[item.id]} level={level} />
          ))
        : null}
    </div>
  )
}

function JudgeMark({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-2xl leading-none",
        selected ? "border-[1.5px] border-neutral-900" : "border border-transparent hover:border-neutral-400"
      )}
    >
      {label}
    </button>
  )
}

function renderPartItems(
  part: ExamPart,
  block: ExamBlock,
  paper: OfficialPaper,
  answers: Record<string, string>,
  playingId: string | null,
  reveal: boolean,
  onAnswer: (id: string, value: string) => void,
  onPlay: (item: ExamItem) => void
) {
  const nodes: ReactNode[] = []
  let index = 0
  while (index < part.items.length) {
    const item = part.items[index]
    if (item.format === "cloze" && item.wordBank) {
      const bankKey = JSON.stringify(item.wordBank)
      const group: ExamItem[] = []
      while (index < part.items.length && part.items[index].format === "cloze" && JSON.stringify(part.items[index].wordBank) === bankKey) {
        group.push(part.items[index])
        index += 1
      }
      nodes.push(
        <div key={`${paper.code}-${group[0].id}-bank`} className="space-y-6">
          <WordBank bank={item.wordBank} level={paper.hskLevel} />
          {group.map((row) => (
            <QuestionRow
              key={row.id}
              item={row}
              block={block}
              level={paper.hskLevel}
              answer={answers[row.id]}
              playing={playingId === row.id}
              reveal={reveal}
              hideListeningScript={!reveal && block.skill === "listening"}
              onAnswer={onAnswer}
              onPlay={() => onPlay(row)}
            />
          ))}
        </div>
      )
      continue
    }
    nodes.push(
      <QuestionRow
        key={item.id}
        item={item}
        block={block}
        level={paper.hskLevel}
        answer={answers[item.id]}
        playing={playingId === item.id}
        reveal={reveal}
        hideListeningScript={!reveal && block.skill === "listening"}
        onAnswer={onAnswer}
        onPlay={() => onPlay(item)}
      />
    )
    index += 1
  }
  return nodes
}

function QuestionRow({
  item,
  block,
  level,
  answer,
  playing,
  reveal,
  hideListeningScript,
  onAnswer,
  onPlay,
}: {
  item: ExamItem
  block: ExamBlock
  level: HskLevel
  answer?: string
  playing: boolean
  reveal: boolean
  hideListeningScript: boolean
  onAnswer: (id: string, value: string) => void
  onPlay: () => void
}) {
  const stem = hideListeningScript ? "" : [item.stem, item.question].filter(Boolean).join(" ")
  return (
    <div className={cn("rounded-md p-1", playing && "bg-amber-50")}>
      {item.format === "true-false" ? (
        <div className="flex flex-wrap items-center gap-3 text-lg leading-8">
          {item.picture ? (
            <div className="flex items-center gap-3">
              <span>{item.number}．</span>
              <div className="border border-neutral-800 bg-white p-2">
                <ExamPicture token={item.picture} />
              </div>
            </div>
          ) : (
            <span>
              {item.number}．★ <PinyinText text={item.stem} level={level} />
            </span>
          )}
          <span>（</span>
          <MarkButton selected={answer === "T"} onClick={() => onAnswer(item.id, "T")}>
            √
          </MarkButton>
          <MarkButton selected={answer === "F"} onClick={() => onAnswer(item.id, "F")}>
            ×
          </MarkButton>
          <span>）</span>
          {block.skill === "listening" ? <PlayMini playing={playing} onPlay={onPlay} /> : null}
        </div>
      ) : null}

      {item.format === "mcq" || item.format === "picture-mcq" ? (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-lg">
              {item.number}．{stem ? <PinyinText text={stem} level={level} /> : null}
            </p>
            {block.skill === "listening" ? <PlayMini playing={playing} onPlay={onPlay} /> : null}
          </div>
          {item.format === "picture-mcq" ? (
            <div className="mx-auto grid max-w-lg grid-cols-2 gap-4">
              {(item.choices ?? []).map((choice) => (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => onAnswer(item.id, choice.key)}
                  className={cn(
                    "flex flex-col items-center gap-2 border border-neutral-800 bg-white p-3 text-neutral-900",
                    answer === choice.key && "bg-neutral-50 ring-2 ring-neutral-800"
                  )}
                >
                  <ExamPhoto token={choice.emoji ?? choice.text} />
                  <span className="font-cjk text-sm">
                    {choice.key}．<PinyinText text={choice.text} level={level} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {(item.choices ?? []).map((choice) => (
                <button
                  key={choice.key}
                  type="button"
                  onClick={() => onAnswer(item.id, choice.key)}
                  className={cn(
                    "rounded border border-neutral-300 px-3 py-2 text-left text-neutral-900",
                    answer === choice.key && "border-emerald-700 bg-emerald-50"
                  )}
                >
                  {choice.key} <PinyinText text={choice.text} level={level} />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {item.format === "cloze" ? (
        <div className="space-y-2">
          <p className="text-lg leading-8">
            {item.number}．<PinyinText text={item.stem} level={level} />
          </p>
          <div className="flex flex-wrap gap-2">
            {(item.wordBank ?? []).map((choice) => (
              <button
                key={choice.key}
                type="button"
                onClick={() => onAnswer(item.id, choice.key)}
                className={cn(
                  "rounded border px-2 py-1",
                  answer === choice.key ? "border-emerald-700 bg-emerald-50" : "border-neutral-300"
                )}
              >
                {choice.key} <PinyinText text={choice.text} level={level} />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {item.format === "order" ? (
        <div className="space-y-2">
          <p className="text-lg">{item.number}．</p>
          {(item.segments ?? []).map((segment, index) => (
            <p key={segment} className="leading-8">
              {["A", "B", "C"][index]} <PinyinText text={segment} level={level} />
            </p>
          ))}
          <div className="flex flex-wrap gap-2">
            {(item.choices ?? []).map((choice) => (
              <button
                key={choice.key}
                type="button"
                onClick={() => onAnswer(item.id, choice.key)}
                className={cn(
                  "rounded border px-2 py-1 text-sm",
                  answer === choice.key ? "border-emerald-700 bg-emerald-50" : "border-neutral-300"
                )}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {item.format === "scramble" ? (
        <ScrambleItem item={item} level={level} value={answer ?? ""} onChange={(value) => onAnswer(item.id, value)} />
      ) : null}

      {item.format === "picture-sentence" || item.format === "essay" ? (
        <div className="space-y-3">
          <p className="text-lg">
            {item.number}．<PinyinText text={item.stem ?? "看图，用词造句。"} level={level} />
          </p>
          {item.picture ? (
            <div className="inline-flex border border-neutral-800 bg-white p-3">
              <ExamPicture token={item.picture} />
            </div>
          ) : null}
          {item.keyword ? (
            <p>
              用词：<span className="font-semibold"><PinyinText text={item.keyword} level={level} /></span>
            </p>
          ) : null}
          <Textarea
            className="min-h-24 border-neutral-300 bg-white font-cjk text-neutral-900"
            value={answer ?? ""}
            onChange={(event) => onAnswer(item.id, event.target.value)}
          />
        </div>
      ) : null}

      {reveal ? <AnswerReveal item={item} answer={answer} level={level} /> : null}
    </div>
  )
}

function AnswerReveal({
  item,
  answer,
  level,
}: {
  item: ExamItem
  answer?: string
  level: HskLevel
}) {
  const info = explainExamItem(item, answer)
  return (
    <div
      className={cn(
        "mt-2 rounded-md border p-3 text-sm leading-6",
        info.correct ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-red-200 bg-red-50 text-red-950"
      )}
    >
      <p className="font-medium">
        {info.correct ? "Correct" : "Mistake"} · Your answer: {info.yourLabel} · 正确答案：{info.correctLabel}
      </p>
      <p className="mt-1 text-neutral-800">{info.explanation}</p>
      {item.audio?.length ? (
        <p className="mt-1 text-neutral-700">
          听力原文：
          {item.audio.map((line) => (
            <span key={`${line.speaker}-${line.text}`}>
              {line.speaker ?? ""}
              {line.speaker ? "：" : ""}
              <PinyinText text={line.text} level={level} />{" "}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  )
}

function ScrambleItem({
  item,
  level,
  value,
  onChange,
}: {
  item: ExamItem
  level: HskLevel
  value: string
  onChange: (value: string) => void
}) {
  const words = item.scramble ?? []
  const [used, setUsed] = useState<number[]>([])

  useEffect(() => {
    if (!value) setUsed([])
  }, [value])

  return (
    <div className="space-y-3">
      <p className="text-lg">{item.number}．完成句子。</p>
      <div className="flex flex-wrap gap-2">
        {words.map((word, index) => (
          <button
            key={`${word}-${index}`}
            type="button"
            disabled={used.includes(index)}
            onClick={() => {
              const next = [...used, index]
              setUsed(next)
              onChange(next.map((i) => words[i]).join(""))
            }}
            className="rounded border border-neutral-400 bg-neutral-50 px-3 py-1 text-lg disabled:opacity-30"
          >
            <PinyinText text={word} level={level} />
          </button>
        ))}
      </div>
      <p className="min-h-10 rounded border border-dashed border-neutral-400 px-3 py-2 text-lg">
        {value ? <PinyinText text={value} level={level} /> : "…"}
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          setUsed([])
          onChange("")
        }}
      >
        重写 Reset
      </Button>
    </div>
  )
}

function WordBank({
  bank,
  level,
}: {
  bank: NonNullable<ExamItem["wordBank"]>
  level: HskLevel
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 rounded border border-neutral-300 p-3 text-sm sm:grid-cols-3">
      {bank.map((item) => (
        <span key={item.key}>
          {item.key} <PinyinText text={item.text} level={level} />
        </span>
      ))}
    </div>
  )
}

function AnswerSheet({
  paper,
  answers,
  currentPart,
  onJump,
}: {
  paper: OfficialPaper
  answers: Record<string, string>
  currentPart?: ExamPart
  onJump: (item: ExamItem) => void
}) {
  const items = allExamItems(paper)
  return (
    <aside className="h-fit rounded-lg bg-white p-3 text-neutral-900 shadow">
      <p className="mb-2 text-center font-cjk text-sm font-medium">答题卡</p>
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const inPart = currentPart?.items.some((row) => row.id === item.id)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onJump(item)}
              className={cn(
                "h-8 rounded text-xs",
                answers[item.id] ? "bg-emerald-700 text-white" : "bg-neutral-200 text-neutral-700",
                inPart && "ring-2 ring-amber-500"
              )}
            >
              {item.number}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

function PaperSheet({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-sm bg-white px-3 py-5 text-neutral-900 shadow-[0_8px_40px_rgba(0,0,0,0.35)] sm:px-12 sm:py-12", className)}>
      {children}
    </div>
  )
}

function MarkButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded border text-lg",
        selected ? "border-emerald-700 bg-emerald-50" : "border-neutral-400"
      )}
    >
      {children}
    </button>
  )
}

function PlayMini({ playing, onPlay }: { playing: boolean; onPlay: () => void }) {
  return (
    <button type="button" onClick={onPlay} className="text-sm text-emerald-800 underline">
      {playing ? "播放中" : "播放"}
    </button>
  )
}

function formatTime(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, "0")}`
}
