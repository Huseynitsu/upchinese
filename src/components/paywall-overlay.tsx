"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function PaywallOverlay({
  locked,
  premium,
  children,
  className,
}: {
  locked: boolean
  premium?: boolean
  children: React.ReactNode
  className?: string
}) {
  const { locale } = useAuth()
  if (!locked) return <>{children}</>

  return (
    <div className={cn("relative min-h-64", className)}>
      <div className="pointer-events-none select-none blur-[6px]" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 z-10 overflow-auto bg-background/55">
        <div className="sticky top-20 flex justify-center p-4">
          <Card className="max-w-md shadow-lg">
            <CardHeader>
              <CardTitle>{premium ? t(locale, "paywallPremiumTitle") : t(locale, "paywallTitle")}</CardTitle>
              <CardDescription>
                {premium ? t(locale, "paywallPremiumBody") : t(locale, "paywallBody")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/pricing">{t(locale, "upgrade")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
