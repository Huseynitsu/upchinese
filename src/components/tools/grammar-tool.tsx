"use client"

import { QuizEngine } from "@/components/tools/quiz-engine"
import { PinyinText } from "@/components/pinyin-text"
import { RequireAuth } from "@/components/require-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { grammarByLevel, questionsBySkill } from "@/lib/content"
import type { HskLevel } from "@/lib/types"

const DRILL_PREFIX: Record<string, string> = {
  "g1-de": "gd-de-",
  "g1-ma": "gd-ma-",
  "g1-le": "gd-le-",
  "g1-bu-mei": "gd-bumei-",
  "g1-zai": "gd-zai-",
  "g1-shi": "gd-shi-",
  "g1-you": "gd-you-",
  "g1-mw": "gd-mw-",
  "g2-bi": "gd-bi-",
  "g2-de-manner": "gd-de2-",
  "g2-zhe": "gd-zhe-",
  "g2-guo": "gd-guo-",
  "g2-hen": "gd-hen-",
  "g2-yao": "gd-yao-",
  "g3-ba": "gd-ba-",
  "g3-le-change": "gd-le3-",
  "g3-suiran": "gd-suiran-",
  "g3-hui": "gd-hui-",
  "g3-bei": "gd-bei-",
  "g3-ruguo": "gd-ru-",
  "g4-baifenzhi": "gd-pct-",
  "g4-anzhao": "gd-an-",
  "g4-bujin": "gd-bj-",
  "g4-buguan": "gd-bg-",
  "g4-yue": "gd-yue-",
  "g5-把握": "gd-bw-",
  "g5-yinwei": "gd-yy-",
  "g5-jiushi": "gd-js-",
  "g6-aimei": "gd-ai-",
  "g6-faner": "gd-fe-",
  "g6-wulun": "gd-wl-",
}

export function GrammarTool({ level }: { level: HskLevel }) {
  const lessons = grammarByLevel(level)
  const allDrills = questionsBySkill(level, "grammar")

  return (
    <RequireAuth>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold">HSK {level} grammar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Read the rule, study the examples, then drill only that pattern.
          </p>
        </div>
        {lessons.map((lesson) => {
          const prefix = DRILL_PREFIX[lesson.id]
          const drills = prefix
            ? allDrills.filter((item) => item.id.startsWith(prefix) && (prefix !== "gd-le-" || !item.id.startsWith("gd-le3-")))
            : []
          return (
            <div key={lesson.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">{lesson.explanation}</p>
                  {lesson.examples.map((example) => (
                    <div key={example.zh}>
                      <PinyinText text={example.zh} level={level} force={level <= 2} className="text-base" />
                      {level > 2 ? <p className="text-primary">{example.pinyin}</p> : null}
                      <p className="text-muted-foreground">{example.en}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              {drills.length ? (
                <QuizEngine
                  title={`Drill: ${lesson.title}`}
                  tool="grammar"
                  level={level}
                  questions={drills}
                  gated={false}
                  sessionSize={drills.length}
                />
              ) : null}
            </div>
          )
        })}
      </div>
    </RequireAuth>
  )
}
