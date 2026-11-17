import { PageShell } from "@/components/page-shell"
import { SpeakingTool } from "@/components/tools/speaking-tool"
import { HSK_LEVELS, requireLevel } from "@/lib/levels"

export function generateStaticParams() {
  return HSK_LEVELS.map((level) => ({ level: String(level) }))
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return { title: `HSK ${level} speaking` }
}

export default async function SpeakingPage({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return (
    <PageShell>
      <SpeakingTool level={level} />
    </PageShell>
  )
}
