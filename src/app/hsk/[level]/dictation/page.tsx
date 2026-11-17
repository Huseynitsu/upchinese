import { PageShell } from "@/components/page-shell"
import { DictationTool } from "@/components/tools/dictation-tool"
import { HSK_LEVELS, requireLevel } from "@/lib/levels"

export function generateStaticParams() {
  return HSK_LEVELS.map((level) => ({ level: String(level) }))
}

export default async function DictationPage({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return (
    <PageShell>
      <DictationTool level={level} />
    </PageShell>
  )
}
