"use server"

import { asLocale } from "@/lib/i18n"
import { asMembership, can, upgradeError } from "@/lib/membership"
import { createSrsCard, enrollSrsCard, reviewSrsCard } from "@/lib/srs"
import { createServerSupabase } from "@/lib/supabase/server"
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
} from "@/lib/types"

type AuthUser = {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}

function asLevel(value: unknown): HskLevel {
  const n = Number(value)
  if (n === 1 || n === 2 || n === 3 || n === 4 || n === 5 || n === 6) return n
  return 1
}

function displayNameFromUser(user: AuthUser) {
  const meta = user.user_metadata?.display_name
  if (typeof meta === "string" && meta.trim()) return meta.trim()
  return user.email?.split("@")[0] || "Learner"
}

async function requireClient() {
  const supabase = await createServerSupabase()
  if (!supabase) throw new Error("Cloud save is not configured.")
  return supabase
}

async function requireUser() {
  const supabase = await requireClient()
  const { data, error } = await supabase.auth.getUser()
  throwIfError(error)
  if (!data.user) throw new Error("Not signed in.")
  return { supabase, user: data.user as AuthUser }
}

function mapPractice(row: Record<string, unknown>): PracticeResult {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    hskLevel: asLevel(row.hsk_level),
    tool: row.tool as ToolId,
    score: Number(row.score),
    total: Number(row.total),
    payload: (row.payload as Record<string, unknown>) ?? {},
    createdAt: String(row.created_at),
  }
}

function mapExam(row: Record<string, unknown>): ExamAttempt {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    hskLevel: asLevel(row.hsk_level),
    examId: String(row.exam_id),
    sectionScores: (row.section_scores as ExamAttempt["sectionScores"]) ?? {},
    totalScore: Number(row.total_score),
    totalPossible: Number(row.total_possible),
    passed: Boolean(row.passed),
    durationSec: Number(row.duration_sec),
    answers: (row.answers as Record<string, string>) ?? {},
    createdAt: String(row.created_at),
  }
}

function mapSrs(row: Record<string, unknown>): SrsCard {
  return {
    userId: String(row.user_id),
    vocabId: String(row.vocab_id),
    dueAt: String(row.due_at),
    interval: Number(row.interval),
    ease: Number(row.ease),
    reps: Number(row.reps),
    lapses: Number(row.lapses),
  }
}

async function readProfile(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  user: AuthUser
): Promise<SessionUser> {
  if (!supabase) throw new Error("Cloud save is not configured.")

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("display_name, current_hsk_level, membership, locale")
    .eq("id", user.id)
    .maybeSingle()
  throwIfError(error)

  let displayName = profile?.display_name as string | undefined
  let currentHskLevel = profile?.current_hsk_level as number | undefined
  let membership = asMembership(profile?.membership)
  let locale = asLocale(profile?.locale)

  if (!profile) {
    const fallbackName = displayNameFromUser(user)
    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: fallbackName,
      current_hsk_level: 1,
      membership: "free",
      locale: "en",
    })
    throwIfError(upsertError)
    displayName = fallbackName
    currentHskLevel = 1
    membership = "free"
    locale = "en"
  }

  return {
    id: user.id,
    email: user.email ?? "",
    displayName: displayName || displayNameFromUser(user),
    currentHskLevel: asLevel(currentHskLevel),
    membership,
    locale,
  }
}

export async function getOwnSession(): Promise<SessionUser | null> {
  const supabase = await createServerSupabase()
  if (!supabase) return null
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return readProfile(supabase, data.user as AuthUser)
}

export async function updateOwnProfile(
  patch: Partial<Pick<Profile, "displayName" | "currentHskLevel" | "locale">>
): Promise<SessionUser> {
  const { supabase, user } = await requireUser()
  const row: Record<string, unknown> = { id: user.id }
  if (patch.displayName !== undefined) row.display_name = patch.displayName.trim()
  if (patch.currentHskLevel !== undefined) row.current_hsk_level = patch.currentHskLevel
  if (patch.locale !== undefined) row.locale = patch.locale

  const { error } = await supabase.from("profiles").upsert(row, { onConflict: "id" })
  throwIfError(error)
  return readProfile(supabase, user)
}

async function ownMembership(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  userId: string
): Promise<Membership> {
  if (!supabase) throw new Error("Cloud save is not configured.")
  const { data, error } = await supabase
    .from("profiles")
    .select("membership")
    .eq("id", userId)
    .maybeSingle()
  throwIfError(error)
  return asMembership(data?.membership)
}

export async function saveOwnPracticeResult(input: {
  hskLevel: HskLevel
  tool: ToolId
  score: number
  total: number
  payload?: Record<string, unknown>
}): Promise<PracticeResult> {
  const { supabase, user } = await requireUser()
  const plan = await ownMembership(supabase, user.id)
  if ((input.tool === "speaking" && !can.speaking(plan)) || (input.tool === "srs" && !can.srs(plan))) {
    throw new Error(upgradeError("vip"))
  }
  const id = crypto.randomUUID()
  const { data, error } = await supabase
    .from("practice_results")
    .insert({
      id,
      user_id: user.id,
      hsk_level: input.hskLevel,
      tool: input.tool,
      score: input.score,
      total: input.total,
      payload: input.payload ?? {},
    })
    .select("*")
    .single()
  throwIfError(error)
  if (!data) throw new Error("Could not save practice result.")
  return mapPractice(data as Record<string, unknown>)
}

export async function listOwnPracticeResults(): Promise<PracticeResult[]> {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from("practice_results")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
  throwIfError(error)
  return (data ?? []).map((row) => mapPractice(row as Record<string, unknown>))
}

export async function saveOwnExamAttempt(
  attempt: Omit<ExamAttempt, "id" | "createdAt" | "userId">
): Promise<ExamAttempt> {
  const { supabase, user } = await requireUser()
  const plan = await ownMembership(supabase, user.id)
  if (!can.exam(plan)) throw new Error(upgradeError("vip"))
  const id = crypto.randomUUID()
  const { data, error } = await supabase
    .from("exam_attempts")
    .insert({
      id,
      user_id: user.id,
      hsk_level: attempt.hskLevel,
      exam_id: attempt.examId,
      section_scores: attempt.sectionScores,
      total_score: attempt.totalScore,
      total_possible: attempt.totalPossible,
      passed: attempt.passed,
      duration_sec: attempt.durationSec,
      answers: attempt.answers,
    })
    .select("*")
    .single()
  throwIfError(error)
  if (!data) throw new Error("Could not save exam attempt.")
  return mapExam(data as Record<string, unknown>)
}

export async function listOwnExamAttempts(): Promise<ExamAttempt[]> {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from("exam_attempts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
  throwIfError(error)
  return (data ?? []).map((row) => mapExam(row as Record<string, unknown>))
}

export async function listOwnSrsCards(): Promise<SrsCard[]> {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase.from("srs_cards").select("*").eq("user_id", user.id)
  throwIfError(error)
  return (data ?? []).map((row) => mapSrs(row as Record<string, unknown>))
}

export async function upsertOwnSrsReview(input: {
  vocabId: string
  quality: number
  enroll?: boolean
}): Promise<SrsCard> {
  const { supabase, user } = await requireUser()
  const plan = await ownMembership(supabase, user.id)
  if (!can.srs(plan)) throw new Error(upgradeError("vip"))
  const { data: existingRow, error: readError } = await supabase
    .from("srs_cards")
    .select("*")
    .eq("user_id", user.id)
    .eq("vocab_id", input.vocabId)
    .maybeSingle()
  throwIfError(readError)

  const existing = existingRow
    ? mapSrs(existingRow as Record<string, unknown>)
    : createSrsCard(user.id, input.vocabId)
  const updated = input.enroll
    ? enrollSrsCard(existing, input.quality)
    : reviewSrsCard(existing, input.quality)

  const { error } = await supabase.from("srs_cards").upsert(
    {
      user_id: user.id,
      vocab_id: updated.vocabId,
      due_at: updated.dueAt,
      interval: updated.interval,
      ease: updated.ease,
      reps: updated.reps,
      lapses: updated.lapses,
    },
    { onConflict: "user_id,vocab_id" }
  )
  throwIfError(error)
  return updated
}

export async function loadOwnProgress() {
  const { supabase, user } = await requireUser()
  const [results, exams, srs] = await Promise.all([
    supabase
      .from("practice_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("exam_attempts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("srs_cards").select("*").eq("user_id", user.id),
  ])
  throwIfError(results.error)
  throwIfError(exams.error)
  throwIfError(srs.error)
  return {
    results: (results.data ?? []).map((row) => mapPractice(row as Record<string, unknown>)),
    exams: (exams.data ?? []).map((row) => mapExam(row as Record<string, unknown>)),
    srs: (srs.data ?? []).map((row) => mapSrs(row as Record<string, unknown>)),
  }
}

function mapMistake(row: Record<string, unknown>): MistakeItem {
  return {
    userId: String(row.user_id),
    vocabId: String(row.vocab_id),
    skill: String(row.skill ?? "vocab"),
    prompt: String(row.prompt ?? ""),
    times: Number(row.times ?? 1),
    lastWrongAt: String(row.last_wrong_at),
  }
}

export async function recordOwnMistake(input: {
  vocabId: string
  skill: string
  prompt: string
}): Promise<void> {
  const { supabase, user } = await requireUser()
  const plan = await ownMembership(supabase, user.id)
  if (!can.notebook(plan)) return

  const { data: existing, error: readError } = await supabase
    .from("mistake_items")
    .select("*")
    .eq("user_id", user.id)
    .eq("vocab_id", input.vocabId)
    .eq("skill", input.skill)
    .maybeSingle()
  throwIfError(readError)

  if (existing) {
    const { error } = await supabase
      .from("mistake_items")
      .update({
        times: Number(existing.times ?? 1) + 1,
        prompt: input.prompt || existing.prompt,
        last_wrong_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("vocab_id", input.vocabId)
      .eq("skill", input.skill)
    throwIfError(error)
    return
  }

  const { error } = await supabase.from("mistake_items").insert({
    user_id: user.id,
    vocab_id: input.vocabId,
    skill: input.skill,
    prompt: input.prompt,
    times: 1,
    last_wrong_at: new Date().toISOString(),
  })
  throwIfError(error)
}

export async function listOwnMistakes(): Promise<MistakeItem[]> {
  const { supabase, user } = await requireUser()
  const plan = await ownMembership(supabase, user.id)
  if (!can.notebook(plan)) return []
  const { data, error } = await supabase
    .from("mistake_items")
    .select("*")
    .eq("user_id", user.id)
    .order("last_wrong_at", { ascending: false })
  throwIfError(error)
  return (data ?? []).map((row) => mapMistake(row as Record<string, unknown>))
}

export async function deleteOwnMistake(vocabId: string, skill: string): Promise<void> {
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from("mistake_items")
    .delete()
    .eq("user_id", user.id)
    .eq("vocab_id", vocabId)
    .eq("skill", skill)
  throwIfError(error)
}

export async function adminIsAdmin(): Promise<boolean> {
  const { supabase } = await requireUser()
  const { data, error } = await supabase.rpc("admin_is_admin")
  throwIfError(error)
  return Boolean(data)
}

export async function adminSearchUsers(query: string): Promise<
  { id: string; email: string; displayName: string; membership: Membership; currentHskLevel: HskLevel }[]
> {
  const { supabase } = await requireUser()
  const { data, error } = await supabase.rpc("admin_search_users", { query })
  throwIfError(error)
  return (data ?? []).map((row: Record<string, unknown>) => ({
    id: String(row.id),
    email: String(row.email ?? ""),
    displayName: String(row.display_name ?? ""),
    membership: asMembership(row.membership),
    currentHskLevel: asLevel(row.current_hsk_level),
  }))
}

export async function adminSetMembership(targetId: string, plan: Membership): Promise<void> {
  const { supabase } = await requireUser()
  const { error } = await supabase.rpc("admin_set_membership", {
    target_id: targetId,
    new_plan: plan,
  })
  throwIfError(error)
}
