import { ExamCatalog } from "@/components/tools/exam-catalog"
import { HSK_LEVELS, requireLevel } from "@/lib/levels"

export function generateStaticParams() {
  return HSK_LEVELS.map((level) => ({ level: String(level) }))
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return { title: `HSK ${level} mock exams` }
}

export default async function ExamIndexPage({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return (
    <div className="flex-1 bg-[#2b2b2b] px-3 py-4 sm:px-6 sm:py-8">
      <ExamCatalog level={level} />
    </div>
  )
}
