import { createWriteStream } from "node:fs"
import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pipeline } from "node:stream/promises"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { gunzipSync } from "node:zlib"

const execFileAsync = promisify(execFile)
const outDir = join(process.cwd(), "data")
const outFile = join(outDir, "cedict.min.json")
const ZIP_URL = "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip"
const GZ_URL = "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz"

const LINE = /^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/\s*$/

async function existsAndFresh(path) {
  try {
    const info = await stat(path)
    return info.size > 500_000
  } catch {
    return false
  }
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": "UpChineseDictionary/1.0 (educational; CC-CEDICT)" },
    redirect: "follow",
  })
  if (!res.ok || !res.body) throw new Error(`Download failed ${res.status} ${url}`)
  await pipeline(res.body, createWriteStream(dest))
}

function parseText(text) {
  const rows = []
  for (const raw of text.split(/\r?\n/)) {
    if (!raw || raw.startsWith("#")) continue
    const match = raw.match(LINE)
    if (!match) continue
    const traditional = match[1]
    const simplified = match[2]
    const pinyin = match[3]
    const gloss = match[4]
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2)
      .join(" / ")
      .slice(0, 140)
    if (!simplified || !pinyin || !gloss) continue
    rows.push([simplified, traditional === simplified ? "" : traditional, pinyin, gloss])
  }
  return rows
}

async function readCedictText() {
  const work = join(tmpdir(), `upchinese-cedict-${Date.now()}`)
  await mkdir(work, { recursive: true })
  try {
    const gzPath = join(work, "cedict.txt.gz")
    await download(GZ_URL, gzPath)
    return gunzipSync(await readFile(gzPath)).toString("utf8")
  } catch {
    const zipPath = join(work, "cedict.zip")
    await download(ZIP_URL, zipPath)
    const dest = join(work, "unzipped")
    await mkdir(dest, { recursive: true })
    await execFileAsync("tar", ["-xf", zipPath, "-C", dest]).catch(async () => {
      await execFileAsync("powershell", [
        "-NoProfile",
        "-Command",
        `Expand-Archive -Force -Path "${zipPath}" -DestinationPath "${dest}"`,
      ])
    })
    const { readdir } = await import("node:fs/promises")
    const files = await readdir(dest, { recursive: true })
    const u8 = files.find((name) => name.endsWith(".u8") || name.includes("cedict"))
    if (!u8) throw new Error("CEDICT file missing after unzip.")
    return readFile(join(dest, u8), "utf8")
  }
}

if (await existsAndFresh(outFile)) {
  console.log(`kept ${outFile}`)
  process.exit(0)
}

await mkdir(outDir, { recursive: true })
const text = await readCedictText()
const rows = parseText(text)
if (rows.length < 10000) throw new Error(`CEDICT parse too small: ${rows.length}`)
await writeFile(outFile, JSON.stringify(rows))
console.log(`wrote ${rows.length} entries → ${outFile}`)
