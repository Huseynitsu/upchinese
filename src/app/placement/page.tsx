import { PageShell } from "@/components/page-shell"
import { PlacementTest } from "@/components/tools/placement-test"

export const metadata = { title: "Placement" }

export default function PlacementPage() {
  return (
    <PageShell>
      <PlacementTest />
    </PageShell>
  )
}
