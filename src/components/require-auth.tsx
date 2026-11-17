"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { PageLoader } from "@/components/page-loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  if (loading) {
    return <PageLoader label="Loading account…" />
  }

  if (!user) {
    const next = encodeURIComponent(pathname)
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
          <CardDescription>
            Create an account to save scores, reviews, and mock exams.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button asChild>
            <Link href={`/login?next=${next}`}>Log in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/register?next=${next}`}>Register</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}
