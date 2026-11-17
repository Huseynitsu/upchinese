"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { planOf } from "@/lib/membership"

const PLANS = [
  {
    id: "free" as const,
    nameKey: "planFree" as const,
    blurb: "Vocabulary, pinyin, listening, reading, grammar, dictation, writing, and hanzi recognition.",
    items: ["All HSK 1–6 study tools above", "Placement test", "AZ / EN interface", "VIP tools shown blurred"],
    titleClass: "text-foreground",
    cardClass: "",
  },
  {
    id: "vip" as const,
    nameKey: "planVip" as const,
    blurb: "Unlocks exam-style practice.",
    items: ["Mock exams", "Speaking + heard vs target", "SRS review", "Stroke order", "Account progress"],
    titleClass: "text-amber-200 drop-shadow-[0_0_16px_rgba(251,191,36,1)]",
    cardClass: "border-amber-400/70 shadow-[0_0_32px_-8px_rgba(251,191,36,0.85)]",
  },
  {
    id: "premium" as const,
    nameKey: "planPremium" as const,
    blurb: "Everything in VIP, plus coaching extras.",
    items: ["Error notebook", "Daily path + streak", "Exam diagnostics", "Clearer in-browser Whisper"],
    titleClass: "text-yellow-200 drop-shadow-[0_0_20px_rgba(250,204,21,1)]",
    cardClass: "border-yellow-300/80 shadow-[0_0_36px_-8px_rgba(250,204,21,0.95)]",
  },
]

export function PricingTable() {
  const { user, locale } = useAuth()
  const current = planOf(user)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{t(locale, "pricing")}</h1>
        <p className="max-w-2xl text-muted-foreground">{t(locale, "pricingLead")}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={cn(plan.cardClass, current === plan.id ? "border-primary" : undefined)}
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className={cn("text-2xl font-semibold", plan.titleClass)}>
                  {t(locale, plan.nameKey)}
                </CardTitle>
                {current === plan.id ? <Badge>Current</Badge> : null}
              </div>
              <CardDescription>{plan.blurb}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Ask the site owner to move you to VIP or Premium. Admins use{" "}
        <Link className="underline" href="/admin">
          /admin
        </Link>
        .
      </p>
      {!user ? (
        <Button asChild>
          <Link href="/register">{t(locale, "register")}</Link>
        </Button>
      ) : null}
    </div>
  )
}
