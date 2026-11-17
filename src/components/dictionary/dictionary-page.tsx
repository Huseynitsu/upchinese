"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ListenButton } from "@/components/listen-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth/auth-provider"
import { clearDictionaryList, isInDictionaryList, readDictionaryList, toggleDictionaryWord } from "@/lib/dictionary/list"
import { prettyPinyin } from "@/lib/dictionary/pinyin-norm"
import type { DictCharCard, DictEntry, DictField, DictKind, DictListWord, DictMatch } from "@/lib/dictionary/types"
import { t } from "@/lib/i18n"

function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-lg border border-input bg-transparent px-2 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function DictionaryPage() {
  const { locale } = useAuth()
  const [q, setQ] = useState("")
  const [field, setField] = useState<DictField>("all")
  const [match, setMatch] = useState<DictMatch>("contains")
  const [hsk, setHsk] = useState("any")
  const [type, setType] = useState<DictKind>("all")
  const [advanced, setAdvanced] = useState(false)
  const [results, setResults] = useState<DictEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [list, setList] = useState<DictListWord[]>([])
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [focusChar, setFocusChar] = useState<string | null>(null)

  useEffect(() => {
    setList(readDictionaryList())
  }, [])

  const listKeys = useMemo(() => new Set(list.map((item) => item.hanzi)), [list])

  async function search(event?: React.FormEvent) {
    event?.preventDefault()
    const query = q.trim()
    if (!query) return
    setLoading(true)
    setError(null)
    setSearched(true)
    const params = new URLSearchParams({ q: query, field, match, hsk, type })
    try {
      const res = await fetch(`/api/dictionary/search?${params}`)
      const data = (await res.json()) as { results?: DictEntry[]; error?: string }
      if (!res.ok) throw new Error(data.error ?? "Search failed.")
      setResults(data.results ?? [])
      setOpenKey(null)
      setFocusChar(null)
    } catch (err) {
      setResults([])
      setError(err instanceof Error ? err.message : "Search failed.")
    } finally {
      setLoading(false)
    }
  }

  function openChars(key: string, focus: string) {
    if (openKey === key && focusChar === focus) {
      setOpenKey(null)
      setFocusChar(null)
      return
    }
    setOpenKey(key)
    setFocusChar(focus)
  }

  function toggle(entry: DictEntry) {
    setList(
      toggleDictionaryWord({
        hanzi: entry.simplified,
        pinyin: entry.pinyin,
        english: entry.english,
        hskLevel: entry.hskLevel,
      })
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{t(locale, "dictionary")}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{t(locale, "dictionaryLead")}</p>
      </div>

      <form onSubmit={(event) => void search(event)} className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="你好 / nihao / hello"
            className="h-11 flex-1 text-base"
            autoFocus
          />
          <Button type="submit" className="h-11 min-h-11 sm:w-36" disabled={loading}>
            {loading ? "…" : t(locale, "dictionarySearch")}
          </Button>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => setAdvanced((value) => !value)}>
          {t(locale, "dictionaryAdvanced")}
        </Button>
        {advanced ? (
          <div className="grid gap-3 rounded-xl border border-border/60 p-3 sm:grid-cols-2 lg:grid-cols-4">
            <SelectBox
              label={t(locale, "dictionaryField")}
              value={field}
              onChange={(value) => setField(value as DictField)}
              options={[
                { value: "all", label: t(locale, "dictionaryAll") },
                { value: "hanzi", label: t(locale, "dictionaryHanzi") },
                { value: "pinyin", label: t(locale, "dictionaryPinyin") },
                { value: "english", label: t(locale, "dictionaryEnglish") },
              ]}
            />
            <SelectBox
              label={t(locale, "dictionaryMatch")}
              value={match}
              onChange={(value) => setMatch(value as DictMatch)}
              options={[
                { value: "contains", label: t(locale, "dictionaryContains") },
                { value: "starts", label: t(locale, "dictionaryStarts") },
                { value: "exact", label: t(locale, "dictionaryExact") },
              ]}
            />
            <SelectBox
              label={t(locale, "dictionaryHsk")}
              value={hsk}
              onChange={setHsk}
              options={[
                { value: "any", label: t(locale, "dictionaryAll") },
                { value: "1", label: "HSK 1" },
                { value: "2", label: "HSK 2" },
                { value: "3", label: "HSK 3" },
                { value: "4", label: "HSK 4" },
                { value: "5", label: "HSK 5" },
                { value: "6", label: "HSK 6" },
                { value: "none", label: t(locale, "dictionaryNotHsk") },
              ]}
            />
            <SelectBox
              label={t(locale, "dictionaryKind")}
              value={type}
              onChange={(value) => setType(value as DictKind)}
              options={[
                { value: "all", label: t(locale, "dictionaryAll") },
                { value: "words", label: t(locale, "dictionaryWords") },
                { value: "characters", label: t(locale, "dictionaryChars") },
              ]}
            />
          </div>
        ) : null}
      </form>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {!searched ? <p className="text-sm text-muted-foreground">{t(locale, "dictionaryEmpty")}</p> : null}
      {searched && !loading && !results.length && !error ? (
        <p className="text-sm text-muted-foreground">{t(locale, "dictionaryNone")}</p>
      ) : null}

      <div className="space-y-3">
        {results.map((entry) => {
          const resultKey = `${entry.simplified}-${entry.pinyin}-${entry.english}`
          const inList = listKeys.has(entry.simplified) || isInDictionaryList(entry.simplified)
          const open = openKey === resultKey
          return (
            <Card key={resultKey} className="bg-card/80">
              <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-cjk text-2xl leading-none">
                      {[...entry.simplified].map((ch, index) =>
                        /[\u4e00-\u9fff]/.test(ch) ? (
                          <button
                            key={`${resultKey}-${ch}-${index}`}
                            type="button"
                            className="rounded px-0.5 hover:bg-primary/15"
                            onClick={() => openChars(resultKey, ch)}
                          >
                            {ch}
                          </button>
                        ) : (
                          <span key={`${resultKey}-${ch}-${index}`}>{ch}</span>
                        )
                      )}
                    </span>
                    {entry.traditional ? (
                      <span className="text-sm text-muted-foreground">{entry.traditional}</span>
                    ) : null}
                    {entry.hskLevel ? <Badge variant="outline">HSK {entry.hskLevel}</Badge> : null}
                  </div>
                  <p className="text-sm text-primary">{prettyPinyin(entry.pinyin)}</p>
                  <p className="text-sm text-muted-foreground">{entry.english}</p>
                </div>
                <div className="flex gap-2">
                  <ListenButton text={entry.simplified} label="" />
                  <Button type="button" variant={inList ? "secondary" : "outline"} onClick={() => toggle(entry)}>
                    {inList ? t(locale, "dictionaryAdded") : t(locale, "dictionaryAdd")}
                  </Button>
                </div>
              </CardContent>
              {open ? (
                <div className="border-t border-border/60 px-4 pb-4">
                  <p className="pt-3 text-sm font-medium">
                    {t(locale, "dictionaryCharsTitle")} · {entry.simplified}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(entry.characters ?? []).map((item) => (
                      <CharCard key={`${resultKey}-${item.hanzi}`} item={item} active={item.hanzi === focusChar} />
                    ))}
                  </div>
                </div>
              ) : null}
            </Card>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">{t(locale, "dictionaryAttr")}</p>

      {list.length ? (
        <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/90 px-4 py-3 shadow-lg backdrop-blur">
          <p className="text-sm">
            {list.length} {t(locale, "dictionaryListBar")}
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => {
              clearDictionaryList()
              setList([])
            }}>
              {t(locale, "dictionaryClear")}
            </Button>
            <Button asChild>
              <Link href="/dictionary/test">{t(locale, "dictionaryTest")}</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function CharCard({ item, active }: { item: DictCharCard; active: boolean }) {
  return (
    <div
      className={
        active
          ? "rounded-lg border border-primary bg-primary/10 p-3"
          : "rounded-lg border border-border/60 p-3"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-cjk text-3xl">{item.hanzi}</span>
        {item.hskLevel ? <Badge variant="outline">HSK {item.hskLevel}</Badge> : null}
      </div>
      <p className="mt-2 text-sm text-primary">{item.pinyin ? prettyPinyin(item.pinyin) : "—"}</p>
      <p className="mt-1 text-sm text-muted-foreground">{item.english}</p>
    </div>
  )
}
