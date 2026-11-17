import { PageShell } from "@/components/page-shell"
import { SrsReview } from "@/components/tools/srs-review"

export const metadata = { title: "SRS Review" }

export default function ReviewPage() {
  return (
    <PageShell>
      <SrsReview />
    </PageShell>
  )
}
