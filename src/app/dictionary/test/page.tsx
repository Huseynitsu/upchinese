import { DictionaryQuiz } from "@/components/dictionary/dictionary-quiz"
import { PageShell } from "@/components/page-shell"

export const metadata = { title: "Test your list" }

export default function DictionaryTestRoute() {
  return (
    <PageShell>
      <DictionaryQuiz />
    </PageShell>
  )
}
