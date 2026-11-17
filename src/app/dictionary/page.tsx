import { DictionaryPage } from "@/components/dictionary/dictionary-page"
import { PageShell } from "@/components/page-shell"

export const metadata = { title: "Dictionary" }

export default function DictionaryRoute() {
  return (
    <PageShell>
      <DictionaryPage />
    </PageShell>
  )
}
