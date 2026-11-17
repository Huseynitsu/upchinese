"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { PageLoader } from "@/components/page-loader"

export function RouteProgress() {
  const pathname = usePathname()
  const [pending, setPending] = useState(false)
  const [overlay, setOverlay] = useState(false)

  useEffect(() => {
    setPending(false)
    setOverlay(false)
  }, [pathname])

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as HTMLElement | null)?.closest("a")
      if (!link) return
      if (link.target && link.target !== "_self") return
      if (link.origin !== window.location.origin) return
      const next = `${link.pathname}${link.search}`
      const current = `${window.location.pathname}${window.location.search}`
      if (next === current) return
      setPending(true)
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  useEffect(() => {
    if (!pending) {
      setOverlay(false)
      return
    }
    const timer = window.setTimeout(() => setOverlay(true), 180)
    return () => window.clearTimeout(timer)
  }, [pending])

  if (!pending) return null

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-primary/15">
        <div className="h-full w-1/3 rounded-full bg-primary animate-[route-progress_1.1s_ease-in-out_infinite]" />
      </div>
      {overlay ? (
        <div className="pointer-events-none fixed inset-x-0 top-14 bottom-0 z-30 flex items-center justify-center bg-background/55 backdrop-blur-[2px]">
          <PageLoader />
        </div>
      ) : null}
    </>
  )
}
