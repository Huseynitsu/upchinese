import { notFound } from "next/navigation"
import { ExamTool } from "@/components/tools/exam-tool"
import { allPaperParams, PAPER_CODES } from "@/lib/exams/catalog"
import { requireLevel } from "@/lib/levels"

export function generateStaticParams() {
  return allPaperParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ level: string; code: string }>
}) {
  const { level, code } = await params
  return { title: `${code} · HSK ${level}` }
}

export default async function ExamPaperPage({
  params,
}: {
  params: Promise<{ level: string; code: string }>
}) {
  const { level: rawLevel, code } = await params
  const level = requireLevel(rawLevel)
  if (!PAPER_CODES[level].includes(code)) notFound()
  return (
    <div className="flex-1 overflow-x-auto bg-[#2b2b2b] px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto max-w-6xl">
        <ExamTool level={level} code={code} />
      </div>
    </div>
  )
}
