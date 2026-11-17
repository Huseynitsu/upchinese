"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  getSession,
  loginAccount,
  logoutAccount,
  registerAccount,
  updateProfile,
} from "@/lib/store"
import { errorMessage } from "@/lib/errors"
import { asLocale, type UiLocale } from "@/lib/i18n"
import { createClient } from "@/lib/supabase/client"
import type { HskLevel, SessionUser } from "@/lib/types"

type AuthContextValue = {
  user: SessionUser | null
  loading: boolean
  locale: UiLocale
  login: (email: string, password: string) => Promise<void>
  register: (input: {
    email: string
    password: string
    displayName: string
  }) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  setLevel: (level: HskLevel) => Promise<void>
  setDisplayName: (name: string) => Promise<void>
  setLocale: (locale: UiLocale) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const LOCALE_KEY = "upchinese.locale"

function readBrowserLocale(): UiLocale {
  return asLocale(window.localStorage.getItem(LOCALE_KEY))
}

function writeBrowserLocale(next: UiLocale) {
  window.localStorage.setItem(LOCALE_KEY, next)
  document.documentElement.lang = next
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [locale, setLocaleState] = useState<UiLocale>("en")

  async function refresh() {
    setUser(await getSession())
  }

  useEffect(() => {
    const stored = readBrowserLocale()
    setLocaleState(stored)
    document.documentElement.lang = stored
  }, [])

  useEffect(() => {
    if (!user) return
    const stored = readBrowserLocale()
    if (stored === user.locale) return
    void updateProfile(user.id, { locale: stored })
      .then((updated) => setUser({ ...updated, locale: stored }))
      .catch(() => undefined)
  }, [user?.id])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) {
      void refresh().finally(() => setLoading(false))
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") {
        setUser(null)
        setLoading(false)
        return
      }
      const sessionUser = await getSession()
      if (sessionUser) setUser(sessionUser)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      locale,
      async login(email, password) {
        setUser(await loginAccount({ email, password }))
      },
      async register(input) {
        setUser(await registerAccount(input))
      },
      async logout() {
        await logoutAccount()
        setUser(null)
      },
      refresh,
      async setLevel(level) {
        if (!user) return
        const previous = user
        setUser({ ...user, currentHskLevel: level })
        try {
          setUser(await updateProfile(user.id, { currentHskLevel: level }))
        } catch (err) {
          setUser(previous)
          throw new Error(errorMessage(err, "Could not save HSK goal."))
        }
      },
      async setDisplayName(name) {
        if (!user) return
        const previous = user
        setUser({ ...user, displayName: name })
        try {
          setUser(await updateProfile(user.id, { displayName: name }))
        } catch (err) {
          setUser(previous)
          throw new Error(errorMessage(err, "Could not save display name."))
        }
      },
      async setLocale(next) {
        setLocaleState(next)
        writeBrowserLocale(next)
        if (!user) return
        try {
          const updated = await updateProfile(user.id, { locale: next })
          setUser({ ...updated, locale: next })
        } catch {
          // Chrome language stays in localStorage even if the profile save fails.
        }
      },
    }),
    [user, loading, locale]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
