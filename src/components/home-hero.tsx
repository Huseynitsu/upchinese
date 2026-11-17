"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function HomeHero() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const ready = mounted && !loading
  const startLevel = user?.currentHskLevel ?? 1

  return (
    <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.7fr)]">
      <div className="relative z-10 max-w-2xl space-y-4">
        <Badge variant="outline">HSK 1–6</Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Learn Chinese with a dark, exam-ready workspace.
        </h1>
        <p className="text-muted-foreground">
          A 1,000-word bank, exam-length listening and reading sets, picture questions, and timed
          mock papers for HSK 1–6. Every session is shuffled.
          {ready && !user ? " Create an account so scores land on your profile." : null}
        </p>
        <div className="flex min-h-8 flex-wrap gap-2">
          {!ready ? (
            <div className="h-8 w-40 rounded-lg bg-muted" />
          ) : (
            <>
              {!user ? (
                <Button asChild>
                  <Link href="/register">Create account</Link>
                </Button>
              ) : null}
              <Button asChild>
                <Link href={`/hsk/${startLevel}`}>Start HSK {startLevel}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/placement">Placement test</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing">Plans</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <div
        className="pointer-events-none relative hidden min-h-56 overflow-hidden select-none items-center justify-center lg:flex"
        aria-hidden
      >
        <div className="hero-ring absolute size-56 rounded-full border border-primary/15" />
        <div className="hero-ring absolute size-40 rounded-full border border-primary/10" />
        <span className="hero-seal font-cjk text-[8.5rem] leading-none font-semibold text-primary/18">
          学
        </span>
      </div>
    </section>
  )
}
