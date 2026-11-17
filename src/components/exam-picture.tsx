import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Kind =
  | "apple"
  | "book"
  | "dog"
  | "tea"
  | "rice"
  | "plane"
  | "computer"
  | "house"
  | "hospital"
  | "school"
  | "shop"
  | "hot"
  | "cold"
  | "rain"
  | "sun"
  | "cloud"
  | "cat"
  | "fish"
  | "bird"
  | "chicken"
  | "meal"
  | "clock"
  | "doctor"
  | "teacher"
  | "student"
  | "police"
  | "cook"
  | "office"
  | "pilot"
  | "tv"
  | "movie"
  | "ball"
  | "water"
  | "chair"
  | "shirt"
  | "family"
  | "parent"
  | "elder"
  | "bed"
  | "door"
  | "window"
  | "snow"
  | "wind"
  | "bus"
  | "taxi"
  | "car"
  | "bike"
  | "scooter"
  | "train"
  | "ship"
  | "noodles"
  | "bread"
  | "cup"
  | "coffee"
  | "milk"
  | "juice"
  | "phone"
  | "pencil"
  | "shoe"
  | "hat"
  | "bag"
  | "bank"
  | "cart"
  | "station"
  | "dot-red"
  | "dot-blue"
  | "dot-white"
  | "dot-black"
  | "dawn"
  | "moon"
  | "star"
  | "man"
  | "woman"
  | "boy"
  | "girl"
  | "baby"
  | "building"
  | "hotel"
  | "camera"
  | "game"
  | "piano"
  | "guitar"
  | "drum"
  | "trumpet"
  | "headphones"
  | "cake"
  | "gift"
  | "party"
  | "balloon"
  | "tree"
  | "flower"
  | "leaf"
  | "cactus"
  | "letter"
  | "broom"
  | "basket"
  | "sponge"
  | "bucket"
  | "sushi"
  | "dumpling"
  | "pizza"
  | "calendar"
  | "watch"
  | "compass"
  | "flag-cn"
  | "flag-jp"
  | "flag-us"
  | "flag-uk"
  | "mountain"
  | "beach"
  | "park"
  | "city"
  | "ice"
  | "fire"
  | "bath"
  | "toilet"
  | "egg"
  | "cheese"
  | "bacon"
  | "quiet"
  | "run"
  | "sparkle"
  | "unknown"

const EMOJI_KIND: Record<string, Kind> = {
  "🍎": "apple",
  "📚": "book",
  "📖": "book",
  "🐶": "dog",
  "🐕": "dog",
  "🍵": "tea",
  "🍚": "rice",
  "✈️": "plane",
  "💻": "computer",
  "🏠": "house",
  "🏥": "hospital",
  "🏫": "school",
  "🏪": "shop",
  "🛍️": "shop",
  "🥵": "hot",
  "🥶": "cold",
  "🌧️": "rain",
  "☀️": "sun",
  "🌞": "sun",
  "⛅": "cloud",
  "🐱": "cat",
  "🐈": "cat",
  "🐟": "fish",
  "🐦": "bird",
  "🐔": "chicken",
  "🐓": "chicken",
  "🍽️": "meal",
  "🕔": "clock",
  "🕖": "clock",
  "🕘": "clock",
  "🕙": "clock",
  "⏰": "clock",
  "👨‍⚕️": "doctor",
  "👩‍⚕️": "doctor",
  "🧑‍⚕️": "doctor",
  "👩‍🏫": "teacher",
  "👨‍🏫": "teacher",
  "🧑‍🏫": "teacher",
  "👨‍🎓": "student",
  "🧑‍🎓": "student",
  "👮": "police",
  "👩‍🍳": "cook",
  "👨‍🍳": "cook",
  "👨‍💼": "office",
  "🧑‍✈️": "pilot",
  "📺": "tv",
  "🎬": "movie",
  "🏀": "ball",
  "💧": "water",
  "🪑": "chair",
  "👕": "shirt",
  "👩‍👧": "parent",
  "👨‍👦": "parent",
  "👨‍👩‍👧": "family",
  "👴": "elder",
  "👵": "elder",
  "🛏️": "bed",
  "🚪": "door",
  "🪟": "window",
  "❄️": "snow",
  "💨": "wind",
  "🚌": "bus",
  "🚕": "taxi",
  "🚗": "car",
  "🚲": "bike",
  "🛵": "scooter",
  "🚂": "train",
  "🚢": "ship",
  "🍜": "noodles",
  "🍞": "bread",
  "🥐": "bread",
  "🥤": "cup",
  "☕": "coffee",
  "🥛": "milk",
  "🧃": "juice",
  "📱": "phone",
  "📞": "phone",
  "✏️": "pencil",
  "👟": "shoe",
  "🧢": "hat",
  "👜": "bag",
  "🏦": "bank",
  "🛒": "cart",
  "🚉": "station",
  "🔴": "dot-red",
  "🔵": "dot-blue",
  "⚪": "dot-white",
  "⚫": "dot-black",
  "🌅": "dawn",
  "🌙": "moon",
  "⭐": "star",
  "✨": "sparkle",
  "👨": "man",
  "👩": "woman",
  "👦": "boy",
  "👧": "girl",
  "👶": "baby",
  "🏢": "building",
  "🏨": "hotel",
  "🏛️": "building",
  "📷": "camera",
  "🎮": "game",
  "🎹": "piano",
  "🎸": "guitar",
  "🥁": "drum",
  "🎺": "trumpet",
  "🎧": "headphones",
  "🎂": "cake",
  "🎁": "gift",
  "🎉": "party",
  "🎈": "balloon",
  "🌲": "tree",
  "🌸": "flower",
  "🍀": "leaf",
  "🌵": "cactus",
  "✉️": "letter",
  "🧹": "broom",
  "🧺": "basket",
  "🧽": "sponge",
  "🪣": "bucket",
  "🍣": "sushi",
  "🥟": "dumpling",
  "🍕": "pizza",
  "📅": "calendar",
  "⌚": "watch",
  "🧭": "compass",
  "🇨🇳": "flag-cn",
  "🇯🇵": "flag-jp",
  "🇺🇸": "flag-us",
  "🇬🇧": "flag-uk",
  "⛰️": "mountain",
  "🏖️": "beach",
  "🏞️": "park",
  "🏙️": "city",
  "🧊": "ice",
  "🔥": "fire",
  "🛁": "bath",
  "🚽": "toilet",
  "🥚": "egg",
  "🧀": "cheese",
  "🥓": "bacon",
  "🤫": "quiet",
  "🏃": "run",
  "1️⃣": "clock",
  "2️⃣": "clock",
  "3️⃣": "clock",
  "4️⃣": "clock",
}

const HANZI_KIND: Record<string, Kind> = {
  苹果: "apple",
  书: "book",
  狗: "dog",
  茶: "tea",
  米饭: "rice",
  飞机: "plane",
  电脑: "computer",
  家: "house",
  医院: "hospital",
  学校: "school",
  商店: "shop",
  猫: "cat",
  鱼: "fish",
  鸟: "bird",
  鸡: "chicken",
  雨: "rain",
  太阳: "sun",
  水: "water",
  衣服: "shirt",
  车: "car",
  电话: "phone",
  咖啡: "coffee",
  北京: "building",
  中国: "flag-cn",
}

function segments(token: string) {
  const value = token.trim()
  if (!value) return []
  if (/^\d+$/.test(value)) return [value]
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return [...new Intl.Segmenter("zh", { granularity: "grapheme" }).segment(value)].map(
      (part) => part.segment
    )
  }
  return Array.from(value)
}

function kindOf(token: string): Kind | `num:${string}` {
  const keycap = token.replace(/[\uFE0F\u20E3]/g, "")
  if (/^\d+$/.test(keycap)) return `num:${keycap}`
  return EMOJI_KIND[token] ?? HANZI_KIND[token] ?? "unknown"
}

function numberLabel(kind: string) {
  return kind.startsWith("num:") ? kind.slice(4) : kind
}

function Frame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden
      className={cn("size-[4.5rem] text-neutral-900", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

function Person({ x = 32, hat }: { x?: number; hat?: "cross" | "cap" | "grad" | "cook" }) {
  return (
    <>
      <circle cx={x} cy="18" r="6" />
      <path d={`M${x} 24 V40`} />
      <path d={`M${x - 10} 30 H${x + 10}`} />
      <path d={`M${x} 40 L${x - 8} 54`} />
      <path d={`M${x} 40 L${x + 8} 54`} />
      {hat === "cross" ? (
        <>
          <path d={`M${x - 7} 12 H${x + 7} V16 H${x - 7} Z`} />
          <path d={`M${x} 11 V8`} />
          <path d={`M${x - 3} 9 H${x + 3}`} />
        </>
      ) : null}
      {hat === "cap" ? <path d={`M${x - 10} 14 H${x + 8} L${x + 12} 16`} /> : null}
      {hat === "grad" ? (
        <>
          <path d={`M${x - 10} 14 L${x} 10 L${x + 10} 14 L${x} 18 Z`} />
          <path d={`M${x + 8} 14 V22`} />
        </>
      ) : null}
      {hat === "cook" ? <path d={`M${x - 6} 12 Q${x} 4 ${x + 6} 12 H${x - 6}`} /> : null}
    </>
  )
}

function Glyph({ token, className }: { token: string; className?: string }) {
  const kind = kindOf(token)
  if (kind.startsWith("num:")) {
    const label = numberLabel(kind)
    return (
      <Frame className={className}>
        <circle cx="32" cy="32" r="22" />
        <text
          x="32"
          y="38"
          textAnchor="middle"
          fontSize={label.length > 2 ? 14 : 18}
          fill="currentColor"
          stroke="none"
          fontFamily="serif"
        >
          {label}
        </text>
      </Frame>
    )
  }

  return (
    <Frame className={className}>
      {kind === "apple" ? (
        <>
          <path d="M32 18 C20 18 16 30 18 42 C20 52 26 54 32 54 C38 54 44 52 46 42 C48 30 44 18 32 18 Z" />
          <path d="M32 18 C34 12 40 10 42 14" />
        </>
      ) : null}
      {kind === "book" ? (
        <>
          <path d="M14 16 H32 V50 H16 C14 50 12 48 12 46 V18 C12 16.5 13 16 14 16 Z" />
          <path d="M50 16 H32 V50 H48 C50 50 52 48 52 46 V18 C52 16.5 51 16 50 16 Z" />
        </>
      ) : null}
      {kind === "dog" ? (
        <>
          <circle cx="38" cy="28" r="10" />
          <path d="M30 24 L22 14 L24 28" />
          <path d="M46 24 L54 14 L50 28" />
          <path d="M34 36 C20 40 16 52 24 54 H44 C52 52 50 42 42 36" />
          <circle cx="35" cy="28" r="1.2" fill="currentColor" />
        </>
      ) : null}
      {kind === "cat" ? (
        <>
          <circle cx="32" cy="30" r="12" />
          <path d="M22 22 L20 10 L28 20" />
          <path d="M42 22 L44 10 L36 20" />
          <path d="M24 44 H40" />
          <circle cx="27" cy="28" r="1.2" fill="currentColor" />
          <circle cx="37" cy="28" r="1.2" fill="currentColor" />
        </>
      ) : null}
      {kind === "tea" || kind === "coffee" || kind === "cup" || kind === "milk" || kind === "juice" ? (
        <>
          <path d="M18 22 H42 V42 C42 48 38 52 32 52 C26 52 22 48 22 42 Z" />
          <path d="M42 28 H50 C54 28 54 40 46 40" />
          {kind === "tea" || kind === "coffee" ? <path d="M26 16 C28 12 30 12 32 16 M34 16 C36 12 38 12 40 16" /> : null}
        </>
      ) : null}
      {kind === "rice" || kind === "meal" || kind === "noodles" || kind === "dumpling" || kind === "sushi" || kind === "pizza" ? (
        <>
          <ellipse cx="32" cy="40" rx="18" ry="8" />
          <path d="M14 40 C14 28 22 22 32 22 C42 22 50 28 50 40" />
          {kind === "noodles" ? <path d="M22 30 C28 36 36 28 42 34" /> : null}
        </>
      ) : null}
      {kind === "plane" ? (
        <>
          <path d="M12 36 L52 28 L44 36 L52 44 L12 36 Z" />
          <path d="M28 32 L24 18 L30 32" />
          <path d="M28 38 L22 50 L32 38" />
        </>
      ) : null}
      {kind === "computer" ? (
        <>
          <rect x="12" y="14" width="40" height="28" rx="2" />
          <path d="M20 50 H44" />
          <path d="M32 42 V50" />
        </>
      ) : null}
      {kind === "house" || kind === "hotel" || kind === "building" || kind === "bank" || kind === "school" || kind === "hospital" || kind === "shop" || kind === "station" || kind === "city" ? (
        <>
          <path d="M10 30 L32 12 L54 30" />
          <path d="M16 28 V52 H48 V28" />
          {kind === "hospital" ? (
            <>
              <path d="M32 34 V46" />
              <path d="M26 40 H38" />
            </>
          ) : (
            <>
              <rect x="26" y="36" width="12" height="16" />
              {kind === "school" || kind === "building" || kind === "city" ? (
                <>
                  <rect x="20" y="32" width="6" height="6" />
                  <rect x="38" y="32" width="6" height="6" />
                </>
              ) : null}
            </>
          )}
        </>
      ) : null}
      {kind === "hot" ? <path d="M32 50 C22 50 20 36 28 32 C22 28 26 16 32 14 C38 16 42 28 36 32 C44 36 42 50 32 50 Z" /> : null}
      {kind === "cold" || kind === "snow" || kind === "ice" ? (
        <>
          <path d="M32 12 V52" />
          <path d="M16 22 L48 42" />
          <path d="M48 22 L16 42" />
          <path d="M22 16 L42 48" />
        </>
      ) : null}
      {kind === "rain" ? (
        <>
          <path d="M18 26 H46 C50 26 50 34 44 34 H20 C14 34 14 26 18 26" />
          <path d="M24 40 V50 M32 40 V52 M40 40 V48" />
        </>
      ) : null}
      {kind === "sun" || kind === "dawn" ? (
        <>
          <circle cx="32" cy="32" r="10" />
          <path d="M32 12 V18 M32 46 V52 M12 32 H18 M46 32 H52 M18 18 L22 22 M42 42 L46 46 M18 46 L22 42 M42 22 L46 18" />
        </>
      ) : null}
      {kind === "cloud" ? <path d="M18 36 H46 C52 36 52 26 46 24 C44 16 32 16 30 24 C24 22 16 26 18 36 Z" /> : null}
      {kind === "fish" ? (
        <>
          <path d="M14 32 C22 20 42 20 48 32 C42 44 22 44 14 32 Z" />
          <path d="M48 32 L58 24 V40 Z" />
          <circle cx="24" cy="30" r="1.4" fill="currentColor" />
        </>
      ) : null}
      {kind === "bird" ? (
        <>
          <path d="M14 36 C24 20 40 22 50 18" />
          <path d="M28 32 C36 28 44 34 52 30" />
          <circle cx="22" cy="28" r="1.2" fill="currentColor" />
        </>
      ) : null}
      {kind === "chicken" ? (
        <>
          <circle cx="38" cy="26" r="8" />
          <path d="M30 30 C16 34 14 50 28 52 H46 C56 50 54 36 44 32" />
          <path d="M36 18 L34 12 L38 15 L42 10 L40 17" />
          <path d="M46 26 L52 24" />
          <path d="M28 52 L24 58 M36 52 L36 58 M44 52 L48 58" />
          <circle cx="36" cy="24" r="1.1" fill="currentColor" />
        </>
      ) : null}
      {kind === "clock" || kind === "watch" ? (
        <>
          <circle cx="32" cy="34" r="16" />
          <path d="M32 34 V24 M32 34 L40 34" />
          {kind === "clock" ? <path d="M28 14 H36" /> : null}
        </>
      ) : null}
      {kind === "doctor" ? <Person hat="cross" /> : null}
      {kind === "teacher" ? <Person hat="cap" /> : null}
      {kind === "student" ? <Person hat="grad" /> : null}
      {kind === "cook" ? <Person hat="cook" /> : null}
      {kind === "police" || kind === "office" || kind === "pilot" || kind === "man" || kind === "run" ? (
        <Person hat={kind === "police" || kind === "pilot" ? "cap" : undefined} />
      ) : null}
      {kind === "woman" || kind === "girl" ? (
        <>
          <Person />
          <path d="M24 40 H40 L36 54 H28 Z" />
        </>
      ) : null}
      {kind === "boy" || kind === "baby" ? (
        <>
          <circle cx="32" cy="22" r="7" />
          <path d="M32 29 V42 M22 34 H42 M32 42 L24 54 M32 42 L40 54" />
        </>
      ) : null}
      {kind === "family" || kind === "parent" ? (
        <>
          <Person x={22} />
          <circle cx="44" cy="22" r="5" />
          <path d="M44 27 V40 M36 32 H52 M44 40 L38 50 M44 40 L50 50" />
        </>
      ) : null}
      {kind === "elder" ? (
        <>
          <Person />
          <path d="M18 40 L28 54" />
        </>
      ) : null}
      {kind === "tv" || kind === "movie" || kind === "game" ? (
        <>
          <rect x="12" y="18" width="40" height="28" rx="2" />
          <path d="M24 52 H40" />
        </>
      ) : null}
      {kind === "ball" ? <circle cx="32" cy="32" r="16" /> : null}
      {kind === "water" ? <path d="M32 12 C32 12 16 32 16 42 C16 52 24 56 32 56 C40 56 48 52 48 42 C48 32 32 12 32 12 Z" /> : null}
      {kind === "chair" ? (
        <>
          <path d="M20 20 V48 M20 32 H42 V48" />
          <path d="M20 32 H16" />
        </>
      ) : null}
      {kind === "shirt" ? (
        <>
          <path d="M20 16 L32 22 L44 16 L52 24 L46 28 V50 H18 V28 L12 24 Z" />
        </>
      ) : null}
      {kind === "bed" ? (
        <>
          <path d="M10 40 H54" />
          <path d="M14 40 V28 H28 V40" />
          <path d="M28 32 H50 V40" />
        </>
      ) : null}
      {kind === "door" ? (
        <>
          <rect x="18" y="10" width="28" height="44" />
          <circle cx="40" cy="34" r="1.6" fill="currentColor" />
        </>
      ) : null}
      {kind === "window" ? (
        <>
          <rect x="14" y="14" width="36" height="36" />
          <path d="M32 14 V50 M14 32 H50" />
        </>
      ) : null}
      {kind === "wind" ? <path d="M14 24 H40 C46 24 46 16 40 16 M14 34 H48 C54 34 54 26 48 26 M14 44 H36 C42 44 42 52 36 52" /> : null}
      {kind === "bus" || kind === "taxi" || kind === "car" ? (
        <>
          <path d="M10 34 H54 L48 24 H20 Z" />
          <path d="M12 34 V42 H52 V34" />
          <circle cx="22" cy="42" r="4" />
          <circle cx="44" cy="42" r="4" />
        </>
      ) : null}
      {kind === "bike" || kind === "scooter" ? (
        <>
          <circle cx="18" cy="42" r="8" />
          <circle cx="46" cy="42" r="8" />
          <path d="M18 42 L28 24 H40 L46 42 M28 24 L22 42" />
        </>
      ) : null}
      {kind === "train" ? (
        <>
          <rect x="12" y="18" width="40" height="24" rx="3" />
          <path d="M12 42 H52" />
          <circle cx="22" cy="46" r="3" />
          <circle cx="42" cy="46" r="3" />
        </>
      ) : null}
      {kind === "ship" ? (
        <>
          <path d="M12 36 H52 L46 48 H18 Z" />
          <path d="M32 36 V16 H42" />
        </>
      ) : null}
      {kind === "bread" ? <path d="M14 36 C14 24 50 24 50 36 C50 44 40 48 32 48 C24 48 14 44 14 36 Z" /> : null}
      {kind === "phone" ? <rect x="22" y="10" width="20" height="44" rx="3" /> : null}
      {kind === "pencil" ? <path d="M18 46 L42 14 L50 20 L26 52 H18 Z" /> : null}
      {kind === "shoe" ? <path d="M12 40 C18 32 28 32 36 36 L54 36 V44 H14 Z" /> : null}
      {kind === "hat" ? <path d="M16 36 H48 M22 36 C22 24 42 24 42 36" /> : null}
      {kind === "bag" ? (
        <>
          <rect x="18" y="24" width="28" height="24" rx="2" />
          <path d="M26 24 V18 H38 V24" />
        </>
      ) : null}
      {kind === "cart" ? (
        <>
          <path d="M14 18 H22 L28 40 H50" />
          <circle cx="30" cy="48" r="3" />
          <circle cx="46" cy="48" r="3" />
        </>
      ) : null}
      {kind === "dot-red" || kind === "dot-blue" || kind === "dot-white" || kind === "dot-black" ? (
        <circle
          cx="32"
          cy="32"
          r="16"
          fill={kind === "dot-white" ? "none" : kind === "dot-black" ? "currentColor" : "none"}
        />
      ) : null}
      {kind === "moon" ? <path d="M38 16 C26 18 18 30 22 42 C32 48 46 42 46 30 C40 32 36 24 38 16 Z" /> : null}
      {kind === "star" || kind === "sparkle" ? (
        <path d="M32 12 L36 26 H50 L38 34 L42 48 L32 40 L22 48 L26 34 L14 26 H28 Z" />
      ) : null}
      {kind === "camera" ? (
        <>
          <rect x="12" y="22" width="40" height="24" rx="3" />
          <circle cx="32" cy="34" r="8" />
          <path d="M24 22 L28 16 H36 L40 22" />
        </>
      ) : null}
      {kind === "piano" ? <rect x="12" y="22" width="40" height="22" /> : null}
      {kind === "guitar" ? (
        <>
          <circle cx="24" cy="40" r="10" />
          <path d="M30 34 L50 14" />
        </>
      ) : null}
      {kind === "drum" ? (
        <>
          <ellipse cx="32" cy="28" rx="16" ry="8" />
          <path d="M16 28 V40 C16 46 48 46 48 40 V28" />
        </>
      ) : null}
      {kind === "trumpet" || kind === "headphones" ? (
        <>
          <path d="M12 32 H40" />
          <path d="M40 24 V40" />
          <circle cx="46" cy="32" r="8" />
        </>
      ) : null}
      {kind === "cake" ? (
        <>
          <path d="M16 32 H48 V48 H16 Z" />
          <path d="M16 32 C16 24 48 24 48 32" />
          <path d="M32 24 V16" />
        </>
      ) : null}
      {kind === "gift" ? (
        <>
          <rect x="16" y="26" width="32" height="24" />
          <path d="M16 34 H48 M32 26 V50" />
        </>
      ) : null}
      {kind === "party" || kind === "balloon" ? (
        <>
          <ellipse cx="32" cy="26" rx="12" ry="16" />
          <path d="M32 42 C28 50 36 54 32 58" />
        </>
      ) : null}
      {kind === "tree" || kind === "leaf" || kind === "cactus" ? (
        <>
          <path d="M32 54 V34" />
          <path d="M32 18 C18 28 20 40 32 40 C44 40 46 28 32 18 Z" />
        </>
      ) : null}
      {kind === "flower" ? (
        <>
          <circle cx="32" cy="32" r="6" />
          <circle cx="32" cy="18" r="6" />
          <circle cx="32" cy="46" r="6" />
          <circle cx="18" cy="32" r="6" />
          <circle cx="46" cy="32" r="6" />
        </>
      ) : null}
      {kind === "letter" ? (
        <>
          <rect x="12" y="18" width="40" height="28" />
          <path d="M12 18 L32 34 L52 18" />
        </>
      ) : null}
      {kind === "broom" || kind === "sponge" || kind === "bucket" || kind === "basket" ? (
        <>
          <path d="M20 14 L44 50" />
          <path d="M36 42 L52 50 L44 54 Z" />
        </>
      ) : null}
      {kind === "calendar" ? (
        <>
          <rect x="14" y="16" width="36" height="36" />
          <path d="M14 26 H50 M24 16 V10 M40 16 V10" />
        </>
      ) : null}
      {kind === "compass" ? (
        <>
          <circle cx="32" cy="32" r="16" />
          <path d="M32 18 L36 32 L32 46 L28 32 Z" />
        </>
      ) : null}
      {kind === "flag-cn" || kind === "flag-jp" || kind === "flag-us" || kind === "flag-uk" ? (
        <>
          <rect x="12" y="16" width="40" height="28" />
          <path d="M12 16 V52" />
          {kind === "flag-jp" ? <circle cx="32" cy="30" r="6" /> : <path d="M12 30 H52 M32 16 V44" />}
        </>
      ) : null}
      {kind === "mountain" || kind === "park" ? <path d="M8 48 L24 20 L32 34 L42 18 L56 48 Z" /> : null}
      {kind === "beach" ? (
        <>
          <path d="M10 44 H54" />
          <path d="M40 44 C40 28 22 28 22 16" />
          <circle cx="48" cy="18" r="6" />
        </>
      ) : null}
      {kind === "fire" ? <path d="M32 52 C20 52 18 36 28 30 C24 24 30 14 32 12 C34 14 40 24 36 30 C46 36 44 52 32 52 Z" /> : null}
      {kind === "bath" ? (
        <>
          <path d="M14 36 H50 V42 C50 48 14 48 14 42 Z" />
          <path d="M20 36 V28" />
        </>
      ) : null}
      {kind === "toilet" ? (
        <>
          <rect x="22" y="12" width="20" height="16" />
          <path d="M20 28 H44 V40 C44 48 20 48 20 40 Z" />
        </>
      ) : null}
      {kind === "egg" || kind === "cheese" || kind === "bacon" ? (
        <ellipse cx="32" cy="34" rx="12" ry="16" />
      ) : null}
      {kind === "quiet" ? (
        <>
          <Person />
          <path d="M40 22 H52" />
        </>
      ) : null}
      {kind === "unknown" ? (
        <>
          <rect x="12" y="12" width="40" height="40" />
          <path d="M24 28 C24 22 40 22 40 30 C40 36 32 36 32 42" />
          <circle cx="32" cy="48" r="1.4" fill="currentColor" />
        </>
      ) : null}
    </Frame>
  )
}

export function ExamPicture({
  token,
  className,
}: {
  token?: string | null
  className?: string
}) {
  if (!token) return null
  const parts = segments(token).filter((part) => part.trim() && part !== "\uFE0F")
  if (!parts.length) return null
  if (parts.length === 1) {
    return (
      <span className={cn("inline-flex justify-center", className)}>
        <Glyph token={parts[0]} />
      </span>
    )
  }
  return (
    <span className={cn("inline-flex items-center justify-center gap-1", className)}>
      {parts.slice(0, 3).map((part, index) => (
        <Glyph key={`${part}-${index}`} token={part} className="size-14" />
      ))}
    </span>
  )
}
