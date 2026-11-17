import { mkdir, writeFile, stat } from "node:fs/promises"
import { join } from "node:path"

const pexels = {
  apple: 102104,
  water: 416528,
  bike: 100582,
  rain: 110874,
  bus: 385998,
  noodles: 1279330,
  shirt: 996329,
  hospital: 263402,
  tea: 1417945,
  dog: 1108099,
  girl: 415829,
  cake: 140831,
  train: 210179,
  pizza: 315755,
  clock: 39396,
  mountain: 417074,
  piano: 164743,
  bread: 1775043,
  sun: 86953,
  broom: 4239146,
  book: 46274,
  hot: 266429,
  tv: 1444416,
  school: 207692,
  beach: 457882,
  egg: 162712,
  teacher: 5212345,
  ship: 163236,
  coffee: 302899,
  flower: 36753,
  cook: 333868,
  ball: 358042,
  bank: 259200,
  cat: 104827,
  snow: 688660,
  door: 277559,
  meal: 1640777,
  camera: 90946,
  hat: 984619,
  tree: 268533,
  pencil: 159752,
  fish: 128756,
  taxi: 460633,
  woman: 733872,
  plane: 46148,
  computer: 18105,
  house: 106399,
  shop: 264636,
  bird: 349758,
  rice: 723198,
  chicken: 1769279,
  gift: 264771,
  phone: 699122,
  "phone-call": 3760263,
  friends: 1415131,
  cold: 688660,
  run: 1199590,
  blue: 190819,
}

const extra = {
  "flag-cn":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_the_People%27s_Republic_of_China.svg/640px-Flag_of_the_People%27s_Republic_of_China.svg.png",
}

const dir = join(process.cwd(), "public", "exam-photos")
await mkdir(dir, { recursive: true })

function pexelsUrl(id) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=640`
}

async function fetchBuffer(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12000)
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "UpChineseExamPhotos/1.0 (educational; free-license photos)" },
    })
    if (!res.ok) return null
    const type = res.headers.get("content-type") ?? ""
    if (type.includes("text/html")) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 3000) return null
    return buf
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function downloadScene(scene) {
  const dest = join(dir, `${scene}.jpg`)
  try {
    const info = await stat(dest)
    if (info.size > 4000) return `${scene}: kept`
  } catch {
    // missing
  }
  const urls = []
  if (extra[scene]) urls.push(extra[scene])
  if (pexels[scene]) urls.push(pexelsUrl(pexels[scene]))
  for (const url of urls) {
    const buf = await fetchBuffer(url)
    if (buf) {
      await writeFile(dest, buf)
      return `${scene}: ok ${buf.length}`
    }
  }
  return `${scene}: FAILED`
}

const names = [...new Set([...Object.keys(pexels), ...Object.keys(extra)])]
const results = await Promise.all(names.map(downloadScene))
for (const line of results) console.log(line)
