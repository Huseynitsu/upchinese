import type { Membership, SessionUser } from "./types"

export function asMembership(value: unknown): Membership {
  if (value === "vip" || value === "premium" || value === "free") return value
  return "free"
}

export function isVipPlus(plan: Membership) {
  return plan === "vip" || plan === "premium"
}

export function isPremium(plan: Membership) {
  return plan === "premium"
}

export function planOf(user: SessionUser | null | undefined): Membership {
  return user?.membership ?? "free"
}

export const can = {
  exam: (plan: Membership) => isVipPlus(plan),
  speaking: (plan: Membership) => isVipPlus(plan),
  srs: (plan: Membership) => isVipPlus(plan),
  strokes: (plan: Membership) => isVipPlus(plan),
  accountProgress: (plan: Membership) => isVipPlus(plan),
  notebook: (plan: Membership) => isPremium(plan),
  dailyPath: (plan: Membership) => isPremium(plan),
  examDiagnostics: (plan: Membership) => isPremium(plan),
  whisperBase: (plan: Membership) => isPremium(plan),
}

export function planLabel(plan: Membership) {
  if (plan === "premium") return "Premium"
  if (plan === "vip") return "VIP"
  return "Standart"
}

export function upgradeError(feature: "vip" | "premium") {
  return feature === "premium"
    ? "Premium is required for this feature."
    : "VIP or Premium is required for this feature."
}
