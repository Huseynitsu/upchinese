"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { useAuth } from "@/components/auth/auth-provider"
import { PageLoader } from "@/components/page-loader"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserMenu } from "@/components/user-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LOCALES, t } from "@/lib/i18n"
import { planLabel, planOf } from "@/lib/membership"

export function SiteHeader() {
  const { user, loading, logout, locale, setLocale } = useAuth()
  const links = [
    { href: "/", label: t(locale, "levels") },
    { href: "/dictionary", label: t(locale, "dictionary") },
    { href: "/today", label: t(locale, "today") },
    { href: "/review", label: t(locale, "srs") },
    { href: "/review/mistakes", label: t(locale, "mistakes") },
    { href: "/pricing", label: t(locale, "pricing") },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/55 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full min-w-0 max-w-6xl items-center justify-between gap-2 px-3 sm:px-4">
        <Link href="/" className="min-w-0 shrink hover:opacity-90">
          <BrandLogo className="max-[380px]:[&>span:last-child]:hidden" />
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-1 transition-colors hover:text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-primary/70 after:transition-transform hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-1 md:flex">
            {LOCALES.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={locale === item.id ? "secondary" : "ghost"}
                className="h-9 min-h-9 px-2 text-xs"
                onClick={() => void setLocale(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <ThemeToggle />
          {loading ? (
            <PageLoader compact label="" />
          ) : user ? (
            <>
              <Badge variant="outline" className="hidden max-w-24 truncate sm:inline-flex">
                {planLabel(planOf(user))}
              </Badge>
              <UserMenu name={user.displayName} onLogout={() => logout()} />
            </>
          ) : (
            <div className="hidden gap-2 lg:flex">
              <Button asChild variant="ghost" size="sm" className="min-h-9">
                <Link href="/login">{t(locale, "login")}</Link>
              </Button>
              <Button asChild size="sm" className="min-h-9">
                <Link href="/register">{t(locale, "register")}</Link>
              </Button>
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="min-h-9 min-w-9 lg:hidden" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <BrandLogo />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-3">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="min-h-9 text-sm leading-9">
                    {link.label}
                  </Link>
                ))}
                <div className="flex gap-1">
                  {LOCALES.map((item) => (
                    <Button
                      key={item.id}
                      type="button"
                      size="sm"
                      className="min-h-9"
                      variant={locale === item.id ? "secondary" : "ghost"}
                      onClick={() => void setLocale(item.id)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
                {!loading && !user ? (
                  <>
                    <Link href="/login" className="min-h-9 leading-9">
                      {t(locale, "login")}
                    </Link>
                    <Link href="/register" className="min-h-9 leading-9">
                      {t(locale, "register")}
                    </Link>
                  </>
                ) : null}
                {!loading && user ? (
                  <>
                    <Link href="/account" className="min-h-9 leading-9">
                      {t(locale, "account")}
                    </Link>
                    <button
                      type="button"
                      className="min-h-9 text-left text-sm"
                      onClick={() => logout()}
                    >
                      {t(locale, "logout")}
                    </button>
                  </>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
