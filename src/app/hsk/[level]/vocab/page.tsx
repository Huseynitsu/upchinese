import { PageShell } from "@/components/page-shell"
import { VocabTool } from "@/components/tools/vocab-tool"
import { HSK_LEVELS, requireLevel } from "@/lib/levels"

export function generateStaticParams() {
  return HSK_LEVELS.map((level) => ({ level: String(level) }))
}

export default async function VocabPage({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return (
    <PageShell>
      <VocabTool level={level} />
    </PageShell>
  )
}
