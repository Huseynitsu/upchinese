import { PageShell } from "@/components/page-shell"
import { MistakeNotebook } from "@/components/tools/mistake-notebook"

export const metadata = { title: "Error notebook" }

export default function MistakesPage() {
  return (
    <PageShell>
      <MistakeNotebook />
    </PageShell>
  )
}
