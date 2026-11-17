import { AccountDashboard } from "@/components/account/account-dashboard"
import { PageShell } from "@/components/page-shell"

export const metadata = { title: "Account" }

export default function AccountPage() {
  return (
    <PageShell>
      <AccountDashboard />
    </PageShell>
  )
}
