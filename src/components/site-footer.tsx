"use client"

import { BrandLogo } from "@/components/brand-logo"

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/50 py-12 text-center text-xs text-muted-foreground">
      <span className="mb-3 flex justify-center">
        <BrandLogo className="text-muted-foreground" size="sm" />
      </span>
      <p suppressHydrationWarning>
        Original practice content for HSK 1 to 6. Official exam papers are not reproduced.
      </p>
      <p className="mt-3 font-cjk tracking-[0.4em] text-muted-foreground/25" aria-hidden>
        学习汉语
      </p>
    </footer>
  )
}
