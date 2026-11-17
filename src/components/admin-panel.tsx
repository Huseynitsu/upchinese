"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { RequireAuth } from "@/components/require-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { errorMessage } from "@/lib/errors"
import { checkAdmin, searchMembers, setMemberPlan } from "@/lib/store"
import type { Membership } from "@/lib/types"

type Row = {
  id: string
  email: string
  displayName: string
  membership: Membership
  currentHskLevel: 1 | 2 | 3 | 4 | 5 | 6
}

export function AdminPanel() {
  return (
    <RequireAuth>
      <AdminInner />
    </RequireAuth>
  )
}

function AdminInner() {
  const { user } = useAuth()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [query, setQuery] = useState("")
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState<string | null>(null)

  async function load(nextQuery = query) {
    try {
      setRows(await searchMembers(nextQuery))
      setError(null)
    } catch (err) {
      setError(errorMessage(err, "Could not load members."))
    }
  }

  useEffect(() => {
    void checkAdmin()
      .then((ok) => {
        setAllowed(ok)
        if (ok) void load("")
      })
      .catch((err) => {
        setAllowed(false)
        setError(errorMessage(err, "Not an admin."))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  if (allowed === null) return <p className="text-sm text-muted-foreground">Checking admin access…</p>
  if (!allowed) {
    return (
      <Alert>
        <AlertDescription>
          This page is for the site owner. Sign in with the first account, then open /admin
          again. If someone else already claimed admin, they can add you.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Admin</h1>
        <p className="text-sm text-muted-foreground">Assign Standart, VIP, or Premium. No payment.</p>
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          void load(query)
        }}
      >
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search email or name"
        />
        <Button type="submit">Search</Button>
      </form>
      <div className="grid gap-3">
        {rows.map((row) => (
          <Card key={row.id}>
            <CardHeader>
              <CardTitle className="text-base">{row.displayName}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                <p>{row.email}</p>
                <p>HSK {row.currentHskLevel}</p>
              </div>
              <Select
                value={row.membership}
                onValueChange={(value) => {
                  const plan = value as Membership
                  void setMemberPlan(row.id, plan)
                    .then(() => {
                      setRows((current) =>
                        current.map((item) => (item.id === row.id ? { ...item, membership: plan } : item))
                      )
                      setError(null)
                    })
                    .catch((err) => setError(errorMessage(err, "Could not change plan.")))
                }}
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Standart</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
        {!rows.length ? <p className="text-sm text-muted-foreground">No matching accounts.</p> : null}
      </div>
    </div>
  )
}
