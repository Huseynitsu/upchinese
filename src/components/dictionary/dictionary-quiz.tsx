"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ListenButton } from "@/components/listen-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth/auth-provider"
import { readDictionaryList } from "@/lib/dictionary/list"
import type { DictListWord } from "@/lib/dictionary/types"
import { prettyPinyin } from "@/lib/dictionary/pinyin-norm"
import { scoreMeaning, scorePinyin } from "@/lib/dictionary/score"
import { t } from "@/lib/i18n"

export function DictionaryQuiz() {
  const { locale } = useAuth()
  const [words, setWords] = useState<DictListWord[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setWords(readDictionaryList())
    setReady(true)
  }, [])
  const [index, setIndex] = useState(0)
  const [pinyin, setPinyin] = useState("")
  const [meaning, setMeaning] = useState("")
  const [checked, setChecked] = useState(false)
  const [marks, setMarks] = useState<boolean[]>([])

  const word = words[index]
  const done = index >= words.length

  function check(nextPinyin = pinyin, nextMeaning = meaning) {
    if (!word || checked) return
    const ok = scorePinyin(nextPinyin, word.pinyin) && scoreMeaning(nextMeaning, word.english)
    setMarks((current) => [...current, ok])
    setChecked(true)
  }

  function next() {
    setPinyin("")
    setMeaning("")
    setChecked(false)
    setIndex((value) => value + 1)
  }

  if (!ready) return null

  if (!words.length) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">{t(locale, "dictionaryTest")}</h1>
        <p className="text-sm text-muted-foreground">{t(locale, "dictionaryNoList")}</p>
        <Button asChild>
          <Link href="/dictionary">{t(locale, "dictionary")}</Link>
        </Button>
      </div>
    )
  }

  if (done) {
    const score = marks.filter(Boolean).length
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">{t(locale, "dictionaryTest")}</h1>
        <p className="text-xl">
          {t(locale, "dictionaryScore")}: {score}/{words.length}
        </p>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dictionary">{t(locale, "dictionary")}</Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIndex(0)
              setMarks([])
              setChecked(false)
              setPinyin("")
              setMeaning("")
            }}
          >
            {t(locale, "dictionaryTest")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{t(locale, "dictionaryTest")}</h1>
        <p className="text-sm text-muted-foreground">{t(locale, "dictionaryQuizLead")}</p>
        <p className="text-sm text-muted-foreground">
          {index + 1} / {words.length}
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <p className="font-cjk text-6xl">{word.hanzi}</p>
            {word.hskLevel ? <Badge variant="outline">HSK {word.hskLevel}</Badge> : null}
          </div>
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              check(String(data.get("pinyin") ?? pinyin), String(data.get("meaning") ?? meaning))
            }}
          >
            <label className="grid gap-1 text-sm">
              <span>{t(locale, "dictionaryPinyin")}</span>
              <Input name="pinyin" value={pinyin} onChange={(event) => setPinyin(event.target.value)} disabled={checked} />
            </label>
            <label className="grid gap-1 text-sm">
              <span>{t(locale, "dictionaryEnglish")}</span>
              <Input name="meaning" value={meaning} onChange={(event) => setMeaning(event.target.value)} disabled={checked} />
            </label>
            {!checked ? (
              <div className="sm:col-span-2">
                <Button type="submit">{t(locale, "dictionaryCheck")}</Button>
              </div>
            ) : null}
          </form>
          {checked ? (
            <div className="space-y-3">
              <p className={marks[marks.length - 1] ? "text-emerald-400" : "text-red-400"}>
                {marks[marks.length - 1] ? t(locale, "dictionaryCorrect") : t(locale, "dictionaryWrong")}
              </p>
              <p className="text-sm">
                {t(locale, "dictionaryReveal")}: {prettyPinyin(word.pinyin)} · {word.english}
              </p>
              <ListenButton text={word.hanzi} />
              <Button type="button" onClick={next}>
                {t(locale, "dictionaryNext")}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
