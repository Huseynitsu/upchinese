import { PageShell } from "@/components/page-shell"
import { HanziTool } from "@/components/tools/hanzi-tool"
import { HSK_LEVELS, requireLevel } from "@/lib/levels"

export function generateStaticParams() {
  return HSK_LEVELS.map((level) => ({ level: String(level) }))
}

export default async function HanziPage({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return (
    <PageShell>
      <HanziTool level={level} />
    </PageShell>
  )
}
