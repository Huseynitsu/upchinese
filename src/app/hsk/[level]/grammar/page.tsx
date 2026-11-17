import { PageShell } from "@/components/page-shell"
import { GrammarTool } from "@/components/tools/grammar-tool"
import { HSK_LEVELS, requireLevel } from "@/lib/levels"

export function generateStaticParams() {
  return HSK_LEVELS.map((level) => ({ level: String(level) }))
}

export default async function GrammarPage({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return (
    <PageShell>
      <GrammarTool level={level} />
    </PageShell>
  )
}
