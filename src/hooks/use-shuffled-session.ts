"use client"

import { useMemo, useState } from "react"
import { shuffle } from "@/lib/shuffle"

export function useShuffledSession<T>(pool: T[], size: number) {
  const [seed, setSeed] = useState(() => Date.now())
  const items = useMemo(() => {
    const next = shuffle(pool, seed)
    return next.slice(0, Math.min(size, next.length))
  }, [pool, seed, size])

  return {
    items,
    poolSize: pool.length,
    reshuffle() {
      setSeed(Date.now())
    },
  }
}
