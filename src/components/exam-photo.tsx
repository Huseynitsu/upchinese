"use client"

import { useState } from "react"
import { examPhotoSources } from "@/lib/exam-photos"
import { cn } from "@/lib/utils"

const SCENE: Record<string, string> = {
  "👨📞": "phone-call",
  "👨‍👩‍👧": "friends",
  "👩‍👧": "friends",
  "📞": "phone",
  "🐔": "chicken",
  "🐓": "chicken",
  "🎁": "gift",
  "🥶": "cold",
  "🍎": "apple",
  "💧": "water",
  "🚲": "bike",
  "🌧️": "rain",
  "🚌": "bus",
  "🍜": "noodles",
  "👕": "shirt",
  "🏥": "hospital",
  "🍵": "tea",
  "🐶": "dog",
  "🐕": "dog",
  "👧": "girl",
  "🎂": "cake",
  "🚂": "train",
  "🍕": "pizza",
  "⏰": "clock",
  "🇨🇳": "flag-cn",
  "⛰️": "mountain",
  "🎹": "piano",
  "🍞": "bread",
  "☀️": "sun",
  "🌞": "sun",
  "🧹": "broom",
  "🏃": "run",
  "📚": "book",
  "📖": "book",
  "🥵": "hot",
  "📺": "tv",
  "🏫": "school",
  "🏖️": "beach",
  "🥚": "egg",
  "👩‍🏫": "teacher",
  "🚢": "ship",
  "☕": "coffee",
  "🌸": "flower",
  "👩‍🍳": "cook",
  "🏀": "ball",
  "🏦": "bank",
  "🐱": "cat",
  "🐈": "cat",
  "❄️": "snow",
  "🚪": "door",
  "🔵": "blue",
  "🍽️": "meal",
  "📷": "camera",
  "🧢": "hat",
  "🌲": "tree",
  "✏️": "pencil",
  "🐟": "fish",
  "🚕": "taxi",
  "👩": "woman",
  "✈️": "plane",
  "💻": "computer",
  "🏠": "house",
  "🏪": "shop",
  "🐦": "bird",
  "🍚": "rice",
  "🎬": "tv",
  "📱": "phone",
  "👨": "run",
  "👦": "run",
  "🛏️": "bed",
  "🪑": "chair",
  "🕔": "clock",
  "🕖": "clock",
  "🕘": "clock",
  "🕙": "clock",
  "👨‍⚕️": "hospital",
  "👨‍🎓": "school",
  "👮": "run",
}

function sceneOf(token: string) {
  return SCENE[token] ?? SCENE[token.replace(/\uFE0F/g, "")] ?? "unknown"
}

export function ExamPhoto({
  token,
  className,
}: {
  token?: string | null
  className?: string
}) {
  if (!token) return null
  const scene = sceneOf(token)
  return <PhotoFrame scene={scene} className={className} />
}

function PhotoFrame({ scene, className }: { scene: string; className?: string }) {
  const sources = examPhotoSources(scene)
  const [index, setIndex] = useState(0)
  const srcs = [sources.local, ...sources.remote]
  const src = srcs[index]
  if (!src) return <DrawnPhoto scene={scene} className={className} />
  return (
    <span
      className={cn(
        "relative inline-block size-[7.25rem] overflow-hidden bg-[#eceae4] sm:size-32",
        className
      )}
    >
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        className="size-full object-cover"
        onError={() => {
          if (index + 1 < srcs.length) setIndex(index + 1)
          else setIndex(srcs.length)
        }}
      />
    </span>
  )
}

function DrawnPhoto({ scene, className }: { scene: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      aria-hidden
      className={cn("size-[7.25rem] sm:size-32", className)}
    >
      <rect width="160" height="160" rx="2" fill="#f4f4f1" />
      <Art scene={scene} />
    </svg>
  )
}

function Art({ scene }: { scene: string }) {
  switch (scene) {
    case "friends":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="42" ry="6" fill="#e4e2dc" />
          <path d="M48 128 C48 96 58 86 70 86 C78 86 82 94 82 104 V128 Z" fill="#3d5a80" />
          <circle cx="70" cy="70" r="14" fill="#e8c4a8" />
          <path d="M56 66 C58 52 82 52 84 68 C76 62 62 62 56 66 Z" fill="#2b2b2b" />
          <path d="M92 128 C92 98 100 88 114 88 C124 88 128 98 128 108 V128 Z" fill="#c45c26" />
          <circle cx="114" cy="72" r="13" fill="#d7a07a" />
          <path d="M102 68 C106 54 128 56 128 70 C120 64 108 62 102 68 Z" fill="#4a3020" />
        </g>
      )
    case "phone-call":
      return (
        <g>
          <ellipse cx="80" cy="144" rx="40" ry="6" fill="#e4e2dc" />
          <path d="M58 132 C58 92 66 80 82 80 C98 80 106 94 106 110 V132 Z" fill="#1f3a5f" />
          <rect x="70" y="92" width="24" height="18" rx="1" fill="#f2efe8" />
          <circle cx="82" cy="62" r="16" fill="#e6c2a4" />
          <path d="M66 58 C68 44 96 42 98 60 C88 52 74 52 66 58 Z" fill="#2c2c2c" />
          <path d="M104 70 C118 62 128 74 120 86 C114 78 108 76 104 78 Z" fill="#2a2a2a" />
          <rect x="116" y="68" width="10" height="22" rx="3" fill="#2a2a2a" />
        </g>
      )
    case "phone":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="36" ry="6" fill="#e4e2dc" />
          <path d="M52 78 C48 70 56 58 70 62 L78 88 C66 92 54 88 52 78 Z" fill="#2b2b2b" />
          <path d="M108 78 C112 70 104 58 90 62 L82 88 C94 92 106 88 108 78 Z" fill="#2b2b2b" />
          <rect x="70" y="86" width="20" height="36" rx="6" fill="#2b2b2b" />
        </g>
      )
    case "chicken":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="38" ry="6" fill="#e4e2dc" />
          <ellipse cx="78" cy="98" rx="32" ry="26" fill="#d8a24a" />
          <circle cx="104" cy="72" r="16" fill="#e8b85a" />
          <path d="M96 56 L100 44 L104 54 L110 42 L112 56" fill="#c43c2c" />
          <path d="M118 74 L132 70 L118 80 Z" fill="#e07a2f" />
          <circle cx="110" cy="68" r="2" fill="#2a2a2a" />
          <path d="M64 122 L58 138 M78 124 L78 140 M92 122 L98 138" stroke="#c43c2c" strokeWidth="3" strokeLinecap="round" />
          <path d="M54 136 H66 M72 140 H86 M92 136 H104" stroke="#c43c2c" strokeWidth="2" />
        </g>
      )
    case "gift":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="36" ry="6" fill="#e4e2dc" />
          <rect x="44" y="78" width="72" height="52" rx="3" fill="#c45c4a" />
          <rect x="44" y="68" width="72" height="16" fill="#a94436" />
          <rect x="74" y="68" width="12" height="62" fill="#e8d48a" />
          <rect x="44" y="92" width="72" height="10" fill="#e8d48a" />
          <path d="M80 68 C70 48 52 56 62 70 C74 62 80 68 80 68 Z" fill="#e8d48a" />
          <path d="M80 68 C90 48 108 56 98 70 C86 62 80 68 80 68 Z" fill="#e8d48a" />
        </g>
      )
    case "cold":
      return (
        <g>
          <circle cx="80" cy="80" r="28" fill="none" stroke="#6a8ca8" strokeWidth="3" />
          <path d="M80 52 V108 M54 66 L106 94 M106 66 L54 94" stroke="#6a8ca8" strokeWidth="3" strokeLinecap="round" />
          <path d="M80 60 L74 66 L86 66 Z M80 100 L74 94 L86 94 Z" fill="#6a8ca8" />
        </g>
      )
    case "apple":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="28" ry="5" fill="#e4e2dc" />
          <path d="M80 52 C52 54 44 88 50 114 C56 136 70 140 80 140 C90 140 104 136 110 114 C116 88 108 54 80 52 Z" fill="#c23b2e" />
          <path d="M80 52 C86 40 100 38 104 48" stroke="#5a7a3a" strokeWidth="3" fill="none" />
          <ellipse cx="64" cy="78" rx="6" ry="10" fill="#e07a6a" opacity="0.45" />
        </g>
      )
    case "water":
      return (
        <g>
          <path d="M80 36 C80 36 48 86 48 110 C48 130 62 140 80 140 C98 140 112 130 112 110 C112 86 80 36 80 36 Z" fill="#5b9ec9" />
          <ellipse cx="68" cy="96" rx="8" ry="12" fill="#8fc4e0" />
        </g>
      )
    case "bike":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="44" ry="6" fill="#e4e2dc" />
          <circle cx="48" cy="112" r="22" fill="none" stroke="#2a2a2a" strokeWidth="4" />
          <circle cx="116" cy="112" r="22" fill="none" stroke="#2a2a2a" strokeWidth="4" />
          <path d="M48 112 L76 72 H108 L116 112 M76 72 L88 112 M88 112 L64 112" stroke="#2a2a2a" strokeWidth="3.5" fill="none" strokeLinejoin="round" />
          <circle cx="76" cy="72" r="4" fill="#2a2a2a" />
        </g>
      )
    case "rain":
      return (
        <g>
          <path d="M48 70 H112 C124 70 124 90 110 90 H50 C38 90 38 70 48 70 Z" fill="#8a97a6" />
          <path d="M70 58 C74 42 98 42 102 62 C92 52 78 52 70 58 Z" fill="#8a97a6" />
          <path d="M58 102 V124 M80 98 V128 M102 102 V122" stroke="#5b9ec9" strokeWidth="4" strokeLinecap="round" />
        </g>
      )
    case "bus":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="46" ry="6" fill="#e4e2dc" />
          <rect x="28" y="58" width="104" height="58" rx="8" fill="#d4a017" />
          <rect x="38" y="68" width="28" height="22" rx="2" fill="#d7eef7" />
          <rect x="72" y="68" width="28" height="22" rx="2" fill="#d7eef7" />
          <rect x="106" y="68" width="16" height="22" rx="2" fill="#d7eef7" />
          <circle cx="50" cy="122" r="10" fill="#2a2a2a" />
          <circle cx="114" cy="122" r="10" fill="#2a2a2a" />
        </g>
      )
    case "taxi":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="44" ry="6" fill="#e4e2dc" />
          <path d="M36 100 H124 L114 78 H50 Z" fill="#e6c200" />
          <rect x="32" y="100" width="96" height="24" rx="4" fill="#f0d23a" />
          <rect x="56" y="82" width="22" height="16" fill="#d7eef7" />
          <rect x="84" y="82" width="22" height="16" fill="#d7eef7" />
          <circle cx="52" cy="126" r="9" fill="#2a2a2a" />
          <circle cx="110" cy="126" r="9" fill="#2a2a2a" />
        </g>
      )
    case "noodles":
      return (
        <g>
          <ellipse cx="80" cy="128" rx="44" ry="12" fill="#d8c4a0" />
          <path d="M36 128 C36 96 56 82 80 82 C104 82 124 96 124 128" fill="#c45c26" />
          <path d="M50 104 C62 116 78 96 94 112 C102 104 110 114 116 108" stroke="#f0d9a0" strokeWidth="3" fill="none" />
          <path d="M48 92 L72 48 M112 92 L128 56" stroke="#8a6a3a" strokeWidth="3" strokeLinecap="round" />
        </g>
      )
    case "shirt":
      return (
        <g>
          <path d="M44 48 L80 62 L116 48 L132 70 L116 78 V128 H44 V78 L28 70 Z" fill="#3d6ea8" />
          <path d="M68 62 C72 78 88 78 92 62 L80 62 Z" fill="#e8c4a8" />
        </g>
      )
    case "hospital":
      return (
        <g>
          <rect x="40" y="58" width="80" height="76" fill="#f2f2f0" stroke="#6a6a6a" strokeWidth="2" />
          <path d="M32 58 L80 28 L128 58" fill="#c45c4a" />
          <rect x="70" y="96" width="20" height="38" fill="#6a8ca8" />
          <path d="M80 72 V92 M70 82 H90" stroke="#c43c2c" strokeWidth="5" />
        </g>
      )
    case "school":
      return (
        <g>
          <rect x="36" y="64" width="88" height="68" fill="#f0ebe0" stroke="#6a6a6a" strokeWidth="2" />
          <path d="M28 64 L80 30 L132 64" fill="#3d5a80" />
          <rect x="70" y="98" width="20" height="34" fill="#8a5a3a" />
          <rect x="46" y="78" width="14" height="12" fill="#d7eef7" />
          <rect x="100" y="78" width="14" height="12" fill="#d7eef7" />
        </g>
      )
    case "bank":
      return (
        <g>
          <rect x="34" y="78" width="92" height="52" fill="#efe8d8" />
          <path d="M24 78 H136 L80 36 Z" fill="#d8c48a" />
          <rect x="48" y="88" width="10" height="42" fill="#c4b48a" />
          <rect x="75" y="88" width="10" height="42" fill="#c4b48a" />
          <rect x="102" y="88" width="10" height="42" fill="#c4b48a" />
        </g>
      )
    case "tea":
    case "coffee":
      return (
        <g>
          <ellipse cx="80" cy="138" rx="30" ry="5" fill="#e4e2dc" />
          <path d="M50 70 H100 V110 C100 124 92 132 80 132 C68 132 60 124 60 110 Z" fill="#f4f0e8" stroke="#8a8a8a" strokeWidth="2" />
          <ellipse cx="80" cy="70" rx="25" ry="7" fill={scene === "tea" ? "#6a9a4a" : "#5a3a28"} />
          <path d="M100 82 H118 C126 82 126 104 110 104" fill="none" stroke="#8a8a8a" strokeWidth="3" />
          {scene === "tea" ? (
            <path d="M70 50 C72 40 78 40 80 50 M86 50 C88 40 94 40 96 50" stroke="#b8c4b0" strokeWidth="2" fill="none" />
          ) : null}
        </g>
      )
    case "dog":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="36" ry="6" fill="#e4e2dc" />
          <ellipse cx="78" cy="108" rx="30" ry="22" fill="#c4a06a" />
          <circle cx="98" cy="72" r="18" fill="#c4a06a" />
          <path d="M84 62 L74 42 L90 58" fill="#a87848" />
          <path d="M110 60 L126 44 L118 68" fill="#a87848" />
          <ellipse cx="108" cy="80" rx="6" ry="5" fill="#e8c4a8" />
          <circle cx="94" cy="68" r="2" fill="#2a2a2a" />
        </g>
      )
    case "cat":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="34" ry="6" fill="#e4e2dc" />
          <ellipse cx="80" cy="110" rx="28" ry="20" fill="#c8c4c0" />
          <circle cx="80" cy="72" r="18" fill="#c8c4c0" />
          <path d="M64 62 L60 42 L74 58" fill="#c8c4c0" />
          <path d="M96 62 L100 42 L86 58" fill="#c8c4c0" />
          <circle cx="72" cy="70" r="2" fill="#2a2a2a" />
          <circle cx="88" cy="70" r="2" fill="#2a2a2a" />
          <path d="M80 76 L76 82 L84 82 Z" fill="#e8a090" />
        </g>
      )
    case "girl":
    case "woman":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="30" ry="5" fill="#e4e2dc" />
          <path d="M58 128 C58 96 66 86 80 86 C94 86 102 98 102 110 V128 Z" fill="#c45c6a" />
          <circle cx="80" cy="64" r="16" fill="#e6c2a4" />
          <path d="M64 62 C66 42 96 40 98 64 C88 52 72 52 64 62 Z" fill="#4a3020" />
        </g>
      )
    case "teacher":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="30" ry="5" fill="#e4e2dc" />
          <path d="M58 128 C58 96 66 86 80 86 C94 86 102 98 102 110 V128 Z" fill="#3d5a80" />
          <circle cx="80" cy="64" r="16" fill="#e6c2a4" />
          <path d="M64 58 C68 42 96 42 98 60" fill="#4a3020" />
          <rect x="56" y="78" width="48" height="6" fill="#d8c48a" />
        </g>
      )
    case "cook":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="30" ry="5" fill="#e4e2dc" />
          <path d="M58 128 C58 96 66 86 80 86 C94 86 102 98 102 110 V128 Z" fill="#f2f2f0" stroke="#b0b0b0" />
          <circle cx="80" cy="68" r="15" fill="#e6c2a4" />
          <path d="M60 52 H100 V60 C100 48 60 48 60 60 Z" fill="#f8f8f6" stroke="#b0b0b0" />
        </g>
      )
    case "run":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="36" ry="5" fill="#e4e2dc" />
          <circle cx="92" cy="48" r="10" fill="#e6c2a4" />
          <path d="M88 58 L70 86 L86 86 L78 128" stroke="#2a2a2a" strokeWidth="4" fill="none" />
          <path d="M70 86 L52 74 M70 86 L58 104" stroke="#2a2a2a" strokeWidth="4" fill="none" />
          <path d="M78 128 L62 140 M78 128 L96 142" stroke="#2a2a2a" strokeWidth="4" fill="none" />
        </g>
      )
    case "cake":
      return (
        <g>
          <ellipse cx="80" cy="138" rx="40" ry="7" fill="#e4e2dc" />
          <rect x="44" y="88" width="72" height="40" rx="4" fill="#e8c4a0" />
          <path d="M44 88 C52 78 108 78 116 88" fill="#f4d4b0" />
          <rect x="50" y="70" width="60" height="20" fill="#c45c6a" />
          <rect x="76" y="54" width="8" height="16" fill="#f2efe8" />
          <ellipse cx="80" cy="52" rx="5" ry="6" fill="#e07a2f" />
        </g>
      )
    case "train":
      return (
        <g>
          <ellipse cx="80" cy="142" rx="48" ry="6" fill="#e4e2dc" />
          <rect x="28" y="70" width="70" height="44" rx="4" fill="#3d6ea8" />
          <rect x="98" y="82" width="34" height="32" rx="3" fill="#3d6ea8" />
          <rect x="38" y="80" width="22" height="16" fill="#d7eef7" />
          <rect x="66" y="80" width="22" height="16" fill="#d7eef7" />
          <circle cx="48" cy="122" r="8" fill="#2a2a2a" />
          <circle cx="86" cy="122" r="8" fill="#2a2a2a" />
          <circle cx="118" cy="122" r="8" fill="#2a2a2a" />
        </g>
      )
    case "pizza":
      return (
        <g>
          <path d="M80 40 L130 120 H30 Z" fill="#e8c48a" />
          <path d="M80 52 L118 116 H42 Z" fill="#c43c2c" />
          <circle cx="74" cy="88" r="6" fill="#e8d48a" />
          <circle cx="90" cy="100" r="5" fill="#e8d48a" />
        </g>
      )
    case "clock":
      return (
        <g>
          <circle cx="80" cy="80" r="40" fill="#f4f0e8" stroke="#2a2a2a" strokeWidth="4" />
          <path d="M80 80 V52 M80 80 L104 92" stroke="#2a2a2a" strokeWidth="3" strokeLinecap="round" />
          <circle cx="80" cy="80" r="3" fill="#2a2a2a" />
        </g>
      )
    case "flag-cn":
      return (
        <g>
          <rect x="36" y="40" width="88" height="80" fill="#c43c2c" />
          <path d="M56 58 L58 66 L66 66 L60 72 L62 80 L56 75 L50 80 L52 72 L46 66 L54 66 Z" fill="#e8d48a" />
        </g>
      )
    case "mountain":
      return (
        <g>
          <path d="M16 128 L56 52 L80 88 L104 40 L144 128 Z" fill="#6a8a6a" />
          <path d="M56 52 L64 64 L48 66 Z" fill="#f2f2f0" />
          <path d="M104 40 L112 54 L96 56 Z" fill="#f2f2f0" />
        </g>
      )
    case "piano":
      return (
        <g>
          <rect x="28" y="58" width="104" height="52" rx="3" fill="#2a2a2a" />
          <rect x="36" y="86" width="88" height="16" fill="#f4f0e8" />
          <rect x="48" y="86" width="8" height="10" fill="#2a2a2a" />
          <rect x="68" y="86" width="8" height="10" fill="#2a2a2a" />
          <rect x="88" y="86" width="8" height="10" fill="#2a2a2a" />
          <rect x="108" y="86" width="8" height="10" fill="#2a2a2a" />
        </g>
      )
    case "bread":
      return (
        <g>
          <ellipse cx="80" cy="92" rx="44" ry="28" fill="#e0b06a" />
          <ellipse cx="80" cy="86" rx="36" ry="18" fill="#f0d090" />
          <path d="M56 80 C60 74 68 74 70 82 M80 76 C84 70 92 72 94 80" stroke="#c48a40" strokeWidth="2" fill="none" />
        </g>
      )
    case "sun":
      return (
        <g>
          <circle cx="80" cy="80" r="24" fill="#e8b84a" />
          <g stroke="#e8b84a" strokeWidth="4" strokeLinecap="round">
            <path d="M80 28 V40 M80 120 V132 M28 80 H40 M120 80 H132" />
            <path d="M44 44 L52 52 M108 108 L116 116 M116 44 L108 52 M44 116 L52 108" />
          </g>
        </g>
      )
    case "broom":
      return (
        <g>
          <path d="M88 28 L68 108" stroke="#8a6a3a" strokeWidth="5" strokeLinecap="round" />
          <path d="M48 104 C58 132 92 136 108 108 C90 118 70 116 48 104 Z" fill="#c4a06a" />
        </g>
      )
    case "book":
      return (
        <g>
          <path d="M80 40 L36 50 V124 L80 114 Z" fill="#3d5a80" />
          <path d="M80 40 L124 50 V124 L80 114 Z" fill="#4a6a94" />
          <path d="M80 40 V114" stroke="#f4f0e8" strokeWidth="2" />
        </g>
      )
    case "hot":
      return (
        <g>
          <path d="M80 132 C56 132 50 96 70 86 C56 78 64 48 80 42 C96 48 104 78 90 86 C110 96 104 132 80 132 Z" fill="#c43c2c" />
        </g>
      )
    case "tv":
      return (
        <g>
          <rect x="32" y="40" width="96" height="68" rx="4" fill="#2a2a2a" />
          <rect x="40" y="48" width="80" height="52" fill="#6a8ca8" />
          <path d="M64 120 H96" stroke="#2a2a2a" strokeWidth="6" />
        </g>
      )
    case "beach":
      return (
        <g>
          <rect x="16" y="96" width="128" height="40" fill="#e8d48a" />
          <path d="M16 96 C48 80 80 104 144 88 V96 Z" fill="#5b9ec9" />
          <circle cx="118" cy="48" r="14" fill="#e8b84a" />
          <path d="M52 96 V60 M36 68 H68" stroke="#8a5a3a" strokeWidth="3" />
        </g>
      )
    case "egg":
      return (
        <g>
          <ellipse cx="80" cy="86" rx="26" ry="36" fill="#f4f0e0" stroke="#d8d0b8" strokeWidth="2" />
        </g>
      )
    case "ship":
      return (
        <g>
          <path d="M28 96 H132 L118 124 H42 Z" fill="#3d5a80" />
          <rect x="70" y="58" width="28" height="38" fill="#c4c8cc" />
          <path d="M16 128 C48 116 112 136 144 120" stroke="#5b9ec9" strokeWidth="6" fill="none" />
        </g>
      )
    case "flower":
      return (
        <g>
          <circle cx="80" cy="72" r="12" fill="#e8b84a" />
          <circle cx="80" cy="48" r="14" fill="#d46a8a" />
          <circle cx="58" cy="64" r="14" fill="#d46a8a" />
          <circle cx="102" cy="64" r="14" fill="#d46a8a" />
          <circle cx="64" cy="90" r="14" fill="#d46a8a" />
          <circle cx="96" cy="90" r="14" fill="#d46a8a" />
          <path d="M80 96 V132" stroke="#5a7a3a" strokeWidth="4" />
        </g>
      )
    case "ball":
      return (
        <g>
          <circle cx="80" cy="80" r="36" fill="#e07a2f" />
          <path d="M44 80 H116 M80 44 V116 M54 54 C70 70 90 70 106 54 M54 106 C70 90 90 90 106 106" stroke="#2a2a2a" strokeWidth="3" fill="none" />
        </g>
      )
    case "snow":
      return (
        <g>
          <path d="M80 40 V120 M48 58 L112 102 M112 58 L48 102" stroke="#6a8ca8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="80" cy="80" r="6" fill="#6a8ca8" />
        </g>
      )
    case "door":
      return (
        <g>
          <rect x="48" y="28" width="64" height="108" fill="#8a5a3a" />
          <rect x="56" y="36" width="48" height="92" fill="#a87848" />
          <circle cx="96" cy="86" r="4" fill="#e8d48a" />
        </g>
      )
    case "blue":
      return <circle cx="80" cy="80" r="36" fill="#3d6ea8" />
    case "meal":
      return (
        <g>
          <ellipse cx="80" cy="100" rx="46" ry="16" fill="#d8d0c0" />
          <ellipse cx="80" cy="92" rx="34" ry="12" fill="#c45c26" />
          <path d="M40 70 L52 48" stroke="#8a8a8a" strokeWidth="3" />
        </g>
      )
    case "camera":
      return (
        <g>
          <rect x="36" y="60" width="88" height="52" rx="8" fill="#2a2a2a" />
          <circle cx="80" cy="86" r="16" fill="#4a4a4a" />
          <circle cx="80" cy="86" r="10" fill="#6a8ca8" />
          <rect x="64" y="50" width="24" height="12" fill="#2a2a2a" />
        </g>
      )
    case "hat":
      return (
        <g>
          <ellipse cx="80" cy="104" rx="48" ry="10" fill="#3d6ea8" />
          <path d="M52 104 C52 70 108 70 108 104" fill="#3d6ea8" />
        </g>
      )
    case "tree":
      return (
        <g>
          <rect x="72" y="100" width="16" height="36" fill="#8a5a3a" />
          <circle cx="80" cy="78" r="32" fill="#3d7a46" />
          <circle cx="58" cy="88" r="18" fill="#4a8a52" />
          <circle cx="102" cy="88" r="18" fill="#4a8a52" />
        </g>
      )
    case "pencil":
      return (
        <g>
          <path d="M52 116 L108 44 L120 54 L64 126 Z" fill="#e8b84a" />
          <path d="M108 44 L120 54 L128 36 Z" fill="#e6c2a4" />
          <path d="M52 116 L64 126 L48 132 Z" fill="#2a2a2a" />
        </g>
      )
    case "fish":
      return (
        <g>
          <ellipse cx="74" cy="80" rx="36" ry="20" fill="#5b9ec9" />
          <path d="M108 80 L136 58 V102 Z" fill="#3d6ea8" />
          <circle cx="58" cy="74" r="3" fill="#2a2a2a" />
        </g>
      )
    case "plane":
      return (
        <g>
          <path d="M24 88 L136 70 L118 88 L136 106 Z" fill="#c4c8cc" />
          <path d="M70 78 L62 44 L78 76" fill="#8a97a6" />
          <path d="M72 92 L56 124 L82 94" fill="#8a97a6" />
        </g>
      )
    case "computer":
      return (
        <g>
          <rect x="32" y="36" width="96" height="64" rx="4" fill="#2a2a2a" />
          <rect x="40" y="44" width="80" height="48" fill="#6a8ca8" />
          <path d="M80 100 V118" stroke="#2a2a2a" strokeWidth="6" />
          <path d="M56 124 H104" stroke="#2a2a2a" strokeWidth="8" strokeLinecap="round" />
        </g>
      )
    case "house":
      return (
        <g>
          <path d="M24 78 L80 32 L136 78" fill="#c45c4a" />
          <rect x="40" y="78" width="80" height="54" fill="#f0ebe0" />
          <rect x="68" y="98" width="24" height="34" fill="#8a5a3a" />
          <rect x="50" y="88" width="14" height="12" fill="#d7eef7" />
        </g>
      )
    case "shop":
      return (
        <g>
          <rect x="36" y="70" width="88" height="62" fill="#f0ebe0" />
          <path d="M28 70 H132 L80 42 Z" fill="#c45c4a" />
          <rect x="68" y="96" width="24" height="36" fill="#6a8ca8" />
          <rect x="46" y="86" width="16" height="14" fill="#d7eef7" />
        </g>
      )
    case "bird":
      return (
        <g>
          <ellipse cx="80" cy="88" rx="28" ry="16" fill="#6a8ca8" />
          <circle cx="104" cy="76" r="10" fill="#6a8ca8" />
          <path d="M114 76 L128 72 L114 82 Z" fill="#e07a2f" />
          <path d="M60 84 C48 70 36 88 52 92" fill="#8a97a6" />
          <circle cx="108" cy="74" r="2" fill="#2a2a2a" />
        </g>
      )
    case "rice":
      return (
        <g>
          <ellipse cx="80" cy="124" rx="44" ry="12" fill="#d8c4a0" />
          <path d="M36 124 C36 92 56 78 80 78 C104 78 124 92 124 124" fill="#f4f0e8" />
        </g>
      )
    default:
      return (
        <g>
          <rect x="44" y="44" width="72" height="72" rx="8" fill="#ddd" />
        </g>
      )
  }
}
