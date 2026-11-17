import Link from "next/link"
import { PageShell } from "@/components/page-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { questionsBySkill, vocabByLevel } from "@/lib/content"
import { EXAM_COUNTS } from "@/lib/shuffle"
import { HSK_LEVELS, LEVEL_META, TOOLS, requireLevel } from "@/lib/levels"

export function generateStaticParams() {
  return HSK_LEVELS.map((level) => ({ level: String(level) }))
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }) {
  const level = requireLevel((await params).level)
  return { title: `HSK ${level}` }
}

export default async function HskLevelPage({
  params,
}: {
  params: Promise<{ level: string }>
}) {
  const level = requireLevel((await params).level)
  const meta = LEVEL_META[level]
  const tools = TOOLS.filter((tool) => !tool.minLevel || level >= tool.minLevel)
  const words = vocabByLevel(level).length
  const exam = EXAM_COUNTS[level]
  const listening = questionsBySkill(level, "listening").length
  const reading = questionsBySkill(level, "reading").length

  return (
    <PageShell className="space-y-6">
      <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="space-y-2">
          <Badge variant="outline" className={meta.tone}>
            {words} words in bank
          </Badge>
          <h1 className="text-3xl font-semibold">HSK {level}</h1>
          <p className="max-w-2xl text-muted-foreground">{meta.focus}</p>
          <p className="text-sm text-muted-foreground">
            {listening} listening and {reading} reading items. Each visit shuffles a new set.
            Mock exam follows the official booklet: cover page, timed 听力 / 阅读
            {exam.writing ? " / 书写" : ""}. Five papers per level.
          </p>
        </div>
        <div
          className="pointer-events-none relative hidden min-h-40 min-w-40 select-none items-center justify-center lg:flex"
          aria-hidden
        >
          <div className="hero-ring absolute size-40 rounded-full border border-primary/12" />
          <span className="hero-seal font-cjk text-8xl font-semibold text-primary/18">{level}</span>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.id} href={tool.href(level)}>
            <Card className="h-full bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-[0_18px_40px_-24px] hover:shadow-primary/40">
              <CardHeader>
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">Results save to your account.</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageShell>
  )
}
