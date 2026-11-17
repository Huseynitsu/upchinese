import { PageShell } from "@/components/page-shell"
import { PricingTable } from "@/components/pricing-table"

export const metadata = { title: "Plans" }

export default function PricingPage() {
  return (
    <PageShell>
      <PricingTable />
    </PageShell>
  )
}
