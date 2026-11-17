import { PageShell } from "@/components/page-shell"
import { QuizEngine } from "@/components/tools/quiz-engine"
import { questionsBySkill } from "@/lib/content"
import { HSK_LEVELS, requireLevel } from "@/lib/levels"
import { EXAM_COUNTS } from "@/lib/shuffle"

export function generateStaticParams() {
  return HSK_LEVELS.map((level) => ({ level: String(level) }))
}

export default async function ReadingPage({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return (
    <PageShell>
      <QuizEngine
        title={`HSK ${level} reading`}
        tool="reading"
        level={level}
        questions={questionsBySkill(level, "reading")}
        sessionSize={EXAM_COUNTS[level].reading}
      />
    </PageShell>
  )
}
