import {
  adminIsAdmin,
  adminSearchUsers,
  adminSetMembership,
  deleteOwnMistake,
  getOwnSession,
  listOwnExamAttempts,
  listOwnMistakes,
  listOwnPracticeResults,
  listOwnSrsCards,
  loadOwnProgress,
  recordOwnMistake,
  saveOwnExamAttempt,
  saveOwnPracticeResult,
  updateOwnProfile,
  upsertOwnSrsReview,
} from "@/app/actions/user-data"
import { asLocale } from "@/lib/i18n"
import { asMembership } from "./membership"
import { createSrsCard, enrollSrsCard, isDue, reviewSrsCard } from "./srs"
import { createClient } from "./supabase/client"
import { isSupabaseConfigured } from "./supabase/env"
import type {
  ExamAttempt,
  HskLevel,
  Membership,
  MistakeItem,
  PracticeResult,
  Profile,
  SessionUser,
  SrsCard,
  ToolId,
} from "./types"

const KEYS = {
  users: "hskpath.users",
  session: "hskpath.session",
  results: "hskpath.results",
  exams: "hskpath.exams",
  srs: "hskpath.srs",
  mistakes: "hskpath.mistakes",
}

type LocalUser = Profile & { passwordHash: string; salt: string }

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

async function hashPassword(password: string, salt: string) {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function newId() {
  return crypto.randomUUID()
}

function toProfile(user: LocalUser): Profile {
  const { passwordHash: _h, salt: _s, ...profile } = user
  return {
    ...profile,
    membership: asMembership(profile.membership),
    locale: asLocale(profile.locale),
  }
}

export async function registerAccount(input: {
  email: string
  password: string
  displayName: string
}): Promise<SessionUser> {
  const email = input.email.trim().toLowerCase()
  const displayName = input.displayName.trim()

  if (!email || !input.password || !displayName) {
    throw new Error("All fields are required.")
  }
  if (input.password.length < 6) {
    throw new Error("Password must be at least 6 characters.")
  }

  const supabase = createClient()
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: input.password,
      options: { data: { display_name: displayName } },
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error("Could not create account.")
    if (!data.session) {
      throw new Error("Account created. Confirm your email, then log in.")
    }

    return (
      (await getOwnSession()) ?? {
        id: data.user.id,
        email,
        displayName,
        currentHskLevel: 1,
        membership: "free",
        locale: "en",
      }
    )
  }

  const users = readJson<LocalUser[]>(KEYS.users, [])
  if (users.some((user) => user.email === email)) {
    throw new Error("An account with this email already exists.")
  }

  const salt = newId()
  const user: LocalUser = {
    id: newId(),
    email,
    displayName,
    currentHskLevel: 1,
    membership: "free",
    locale: "en",
    salt,
    passwordHash: await hashPassword(input.password, salt),
  }
  writeJson(KEYS.users, [...users, user])
  writeJson(KEYS.session, { userId: user.id })
  return toProfile(user)
}

export async function loginAccount(input: {
  email: string
  password: string
}): Promise<SessionUser> {
  const email = input.email.trim().toLowerCase()
  const supabase = createClient()

  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: input.password,
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error("Login failed.")
    return (await getOwnSession()) ?? {
      id: data.user.id,
      email,
      displayName: email.split("@")[0],
      currentHskLevel: 1,
      membership: "free",
      locale: "en",
    }
  }

  const users = readJson<LocalUser[]>(KEYS.users, [])
  const user = users.find((item) => item.email === email)
  if (!user) throw new Error("Invalid email or password.")
  const hash = await hashPassword(input.password, user.salt)
  if (hash !== user.passwordHash) throw new Error("Invalid email or password.")
  writeJson(KEYS.session, { userId: user.id })
  return toProfile(user)
}

export async function logoutAccount() {
  const supabase = createClient()
  if (supabase) await supabase.auth.signOut()
  localStorage.removeItem(KEYS.session)
}

export async function getSession(): Promise<SessionUser | null> {
  if (isSupabaseConfigured()) {
    return getOwnSession()
  }

  const session = readJson<{ userId: string } | null>(KEYS.session, null)
  if (!session) return null
  const users = readJson<LocalUser[]>(KEYS.users, [])
  const user = users.find((item) => item.id === session.userId)
  return user ? toProfile(user) : null
}

export async function updateProfile(
  userId: string,
  patch: Partial<Pick<Profile, "displayName" | "currentHskLevel" | "locale">>
): Promise<Profile> {
  if (isSupabaseConfigured()) {
    return updateOwnProfile(patch)
  }

  const users = readJson<LocalUser[]>(KEYS.users, [])
  const next = users.map((user) =>
    user.id === userId
      ? {
          ...user,
          displayName: patch.displayName ?? user.displayName,
          currentHskLevel: patch.currentHskLevel ?? user.currentHskLevel,
          locale: patch.locale ?? user.locale,
        }
      : user
  )
  writeJson(KEYS.users, next)
  const updated = next.find((user) => user.id === userId)
  if (!updated) throw new Error("Account not found.")
  return toProfile(updated)
}

export async function savePracticeResult(input: {
  userId: string
  hskLevel: HskLevel
  tool: ToolId
  score: number
  total: number
  payload?: Record<string, unknown>
}): Promise<PracticeResult> {
  const result: PracticeResult = {
    id: newId(),
    userId: input.userId,
    hskLevel: input.hskLevel,
    tool: input.tool,
    score: input.score,
    total: input.total,
    payload: input.payload ?? {},
    createdAt: new Date().toISOString(),
  }

  if (isSupabaseConfigured()) {
    return saveOwnPracticeResult({
      hskLevel: input.hskLevel,
      tool: input.tool,
      score: input.score,
      total: input.total,
      payload: input.payload,
    })
  }

  writeJson(KEYS.results, [...readJson<PracticeResult[]>(KEYS.results, []), result])
  return result
}

export async function listPracticeResults(userId: string) {
  if (isSupabaseConfigured()) {
    return listOwnPracticeResults()
  }
  return readJson<PracticeResult[]>(KEYS.results, [])
    .filter((item) => item.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function saveExamAttempt(attempt: Omit<ExamAttempt, "id" | "createdAt">) {
  if (isSupabaseConfigured()) {
    return saveOwnExamAttempt({
      hskLevel: attempt.hskLevel,
      examId: attempt.examId,
      sectionScores: attempt.sectionScores,
      totalScore: attempt.totalScore,
      totalPossible: attempt.totalPossible,
      passed: attempt.passed,
      durationSec: attempt.durationSec,
      answers: attempt.answers,
    })
  }

  const record: ExamAttempt = {
    ...attempt,
    id: newId(),
    createdAt: new Date().toISOString(),
  }

  writeJson(KEYS.exams, [...readJson<ExamAttempt[]>(KEYS.exams, []), record])
  return record
}

export async function listExamAttempts(userId: string) {
  if (isSupabaseConfigured()) {
    return listOwnExamAttempts()
  }
  return readJson<ExamAttempt[]>(KEYS.exams, [])
    .filter((item) => item.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function listSrsCards(userId: string) {
  if (isSupabaseConfigured()) {
    return listOwnSrsCards()
  }
  return readJson<SrsCard[]>(KEYS.srs, []).filter((card) => card.userId === userId)
}

async function writeSrsCards(userId: string, cards: SrsCard[]) {
  const others = readJson<SrsCard[]>(KEYS.srs, []).filter((card) => card.userId !== userId)
  writeJson(KEYS.srs, [...others, ...cards])
}

export async function loadAccountProgress(userId: string) {
  if (isSupabaseConfigured()) {
    return loadOwnProgress()
  }
  const [results, exams, srs] = await Promise.all([
    listPracticeResults(userId),
    listExamAttempts(userId),
    listSrsCards(userId),
  ])
  return { results, exams, srs }
}

export async function upsertSrsReview(input: {
  userId: string
  vocabId: string
  quality: number
  enroll?: boolean
}) {
  if (isSupabaseConfigured()) {
    return upsertOwnSrsReview({
      vocabId: input.vocabId,
      quality: input.quality,
      enroll: input.enroll,
    })
  }
  const cards = await listSrsCards(input.userId)
  const existing =
    cards.find((card) => card.vocabId === input.vocabId) ??
    createSrsCard(input.userId, input.vocabId)
  const updated = input.enroll
    ? enrollSrsCard(existing, input.quality)
    : reviewSrsCard(existing, input.quality)
  const next = [
    ...cards.filter((card) => card.vocabId !== input.vocabId),
    updated,
  ]
  await writeSrsCards(input.userId, next)
  return updated
}

export async function getDueSrsCards(userId: string) {
  return (await listSrsCards(userId)).filter((card) => isDue(card))
}

export async function recordMistake(input: {
  userId: string
  vocabId: string
  skill: string
  prompt: string
}) {
  if (isSupabaseConfigured()) {
    await recordOwnMistake(input)
    return
  }
  const rows = readJson<MistakeItem[]>(KEYS.mistakes, [])
  const existing = rows.find(
    (row) => row.userId === input.userId && row.vocabId === input.vocabId && row.skill === input.skill
  )
  const next = existing
    ? rows.map((row) =>
        row === existing
          ? {
              ...row,
              times: row.times + 1,
              prompt: input.prompt || row.prompt,
              lastWrongAt: new Date().toISOString(),
            }
          : row
      )
    : [
        ...rows,
        {
          userId: input.userId,
          vocabId: input.vocabId,
          skill: input.skill,
          prompt: input.prompt,
          times: 1,
          lastWrongAt: new Date().toISOString(),
        },
      ]
  writeJson(KEYS.mistakes, next)
}

export async function listMistakes(userId: string) {
  if (isSupabaseConfigured()) return listOwnMistakes()
  return readJson<MistakeItem[]>(KEYS.mistakes, [])
    .filter((item) => item.userId === userId)
    .sort((a, b) => b.lastWrongAt.localeCompare(a.lastWrongAt))
}

export async function deleteMistake(userId: string, vocabId: string, skill: string) {
  if (isSupabaseConfigured()) {
    await deleteOwnMistake(vocabId, skill)
    return
  }
  writeJson(
    KEYS.mistakes,
    readJson<MistakeItem[]>(KEYS.mistakes, []).filter(
      (item) => !(item.userId === userId && item.vocabId === vocabId && item.skill === skill)
    )
  )
}

export async function checkAdmin() {
  if (isSupabaseConfigured()) return adminIsAdmin()
  return true
}

export async function searchMembers(query: string) {
  if (isSupabaseConfigured()) return adminSearchUsers(query)
  const needle = query.trim().toLowerCase()
  return readJson<LocalUser[]>(KEYS.users, [])
    .filter(
      (user) =>
        !needle || user.email.includes(needle) || user.displayName.toLowerCase().includes(needle)
    )
    .map((user) => ({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      membership: asMembership(user.membership),
      currentHskLevel: user.currentHskLevel,
    }))
}

export async function setMemberPlan(targetId: string, plan: Membership) {
  if (isSupabaseConfigured()) {
    await adminSetMembership(targetId, plan)
    return
  }
  const users = readJson<LocalUser[]>(KEYS.users, [])
  writeJson(
    KEYS.users,
    users.map((user) => (user.id === targetId ? { ...user, membership: plan } : user))
  )
}

export function authModeLabel() {
  return isSupabaseConfigured() ? "Supabase" : "Local account"
}
