import Link from "next/link"
import { HomeHero } from "@/components/home-hero"
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HSK_LEVELS, LEVEL_META } from "@/lib/levels"

export default function HomePage() {
  return (
    <PageShell className="space-y-10">
      <HomeHero />
      <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {HSK_LEVELS.map((level) => {
          const meta = LEVEL_META[level]
          return (
            <Link key={level} href={`/hsk/${level}`}>
              <Card className="h-full bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-[0_18px_40px_-24px] hover:shadow-primary/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>HSK {level}</CardTitle>
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${meta.tone}`}>
                      {meta.words}
                    </span>
                  </div>
                  <CardDescription>{meta.focus}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Vocabulary, skills practice, and a sample mock exam.
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </section>
    </PageShell>
  )
}
