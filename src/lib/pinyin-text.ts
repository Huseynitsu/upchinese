import { html, pinyin } from "pinyin-pro"
import type { HskLevel } from "./types"

export function showPinyin(level?: HskLevel, force?: boolean) {
  return Boolean(force || (level !== undefined && level <= 2))
}

export function toPinyin(zh: string) {
  return pinyin(zh, { toneType: "symbol", type: "string", nonZh: "consecutive" })
}

export function toPinyinHtml(zh: string) {
  return html(zh, { rp: false, wrapNonChinese: true })
}
