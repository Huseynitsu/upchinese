import { PageShell } from "@/components/page-shell"
import { QuizEngine } from "@/components/tools/quiz-engine"
import { questionsBySkill } from "@/lib/content"
import { HSK_LEVELS, requireLevel } from "@/lib/levels"

export function generateStaticParams() {
  return HSK_LEVELS.map((level) => ({ level: String(level) }))
}

export default async function PinyinPage({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return (
    <PageShell>
      <QuizEngine
        title={`HSK ${level} pinyin & tones`}
        tool="pinyin"
        level={level}
        questions={questionsBySkill(level, "pinyin")}
      />
    </PageShell>
  )
}
