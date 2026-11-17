"use client"

import { Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { speakChinese } from "@/lib/tts"

export function ListenButton({ text, label = "Play audio" }: { text: string; label?: string }) {
  return (
    <Button type="button" variant="outline" onClick={() => speakChinese(text)}>
      <Volume2 className="size-4" />
      {label}
    </Button>
  )
}
