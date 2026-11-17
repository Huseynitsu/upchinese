"use client"

type AsrResult = { text?: string }

type ProgressEvent = {
  status?: string
  progress?: number
  file?: string
}

let pipelines = new Map<
  string,
  Promise<(audio: Float32Array, options?: Record<string, unknown>) => Promise<AsrResult>>
>()

async function getPipeline(onProgress?: (message: string) => void, useBase = false) {
  const model = useBase ? "onnx-community/whisper-base" : "onnx-community/whisper-tiny"
  const existing = pipelines.get(model)
  if (existing) return existing

  const pipelinePromise = import("@huggingface/transformers")
    .then(async ({ pipeline, env }) => {
      env.allowLocalModels = false
      const transcriber = await pipeline("automatic-speech-recognition", model, {
        dtype: "fp32",
        device: "wasm",
        session_options: {
          graphOptimizationLevel: "disabled",
        },
        progress_callback: (event: ProgressEvent) => {
          if (!onProgress) return
          if (event.status === "initiate") {
            onProgress("Loading speech model (first time only)…")
            return
          }
          if (event.status === "progress" && typeof event.progress === "number") {
            onProgress(`Loading speech model… ${Math.round(event.progress)}%`)
          }
        },
      })
      return (audio: Float32Array, options?: Record<string, unknown>) =>
        transcriber(audio, options) as Promise<AsrResult>
    })
    .catch((error: unknown) => {
      pipelines.delete(model)
      throw error
    })
  pipelines.set(model, pipelinePromise)
  return pipelinePromise
}

export async function transcribeChinese(
  blob: Blob,
  onProgress?: (message: string) => void,
  useBase = false
) {
  if (blob.size < 200) return ""
  onProgress?.("Preparing your recording…")
  const audio = await toMono16k(blob)
  const transcriber = await getPipeline(onProgress, useBase)
  onProgress?.("Recognizing speech…")
  const result = await transcriber(audio, { language: "chinese", task: "transcribe" })
  return (result.text ?? "").trim()
}

function resample(input: Float32Array, fromRate: number, toRate: number) {
  if (fromRate === toRate) return input
  const ratio = fromRate / toRate
  const length = Math.max(1, Math.round(input.length / ratio))
  const output = new Float32Array(length)
  for (let i = 0; i < length; i += 1) {
    output[i] = input[Math.min(input.length - 1, Math.floor(i * ratio))] ?? 0
  }
  return output
}

async function toMono16k(blob: Blob) {
  const context = new AudioContext()
  try {
    const buffer = await context.decodeAudioData(await blob.arrayBuffer())
    const channel = buffer.numberOfChannels > 1 ? mixDown(buffer) : buffer.getChannelData(0)
    return resample(channel, buffer.sampleRate, 16000)
  } finally {
    await context.close()
  }
}

function mixDown(buffer: AudioBuffer) {
  const length = buffer.length
  const mixed = new Float32Array(length)
  const channels = buffer.numberOfChannels
  for (let c = 0; c < channels; c += 1) {
    const data = buffer.getChannelData(c)
    for (let i = 0; i < length; i += 1) mixed[i] += (data[i] ?? 0) / channels
  }
  return mixed
}
