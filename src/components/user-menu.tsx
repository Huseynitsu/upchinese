"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserMenu({
  name,
  onLogout,
}: {
  name: string
  onLogout: () => void
}) {
  return (
    <div className="group relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-haspopup="menu"
        className="max-w-40 gap-1"
      >
        <span className="truncate">{name}</span>
        <ChevronDown className="size-3.5 opacity-70 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
      </Button>
      <div className="invisible absolute right-0 top-full z-50 pt-1 opacity-0 transition-[opacity,visibility] delay-150 group-hover:visible group-hover:opacity-100 group-hover:delay-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:delay-0">
        <div
          role="menu"
          className="min-w-40 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <Link
            href="/account"
            role="menuitem"
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            Account
          </Link>
          <Link
            href="/pricing"
            role="menuitem"
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            Plans
          </Link>
          <Link
            href="/placement"
            role="menuitem"
            className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            Placement
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
            onClick={() => void onLogout()}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
