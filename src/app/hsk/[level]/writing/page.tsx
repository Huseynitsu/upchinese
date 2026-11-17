import { PageShell } from "@/components/page-shell"
import { WritingTool } from "@/components/tools/writing-tool"
import { HSK_LEVELS, requireLevel } from "@/lib/levels"

export function generateStaticParams() {
  return HSK_LEVELS.map((level) => ({ level: String(level) }))
}

export default async function WritingPage({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return (
    <PageShell>
      <WritingTool level={level} />
    </PageShell>
  )
}
