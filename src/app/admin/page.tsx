import { AdminPanel } from "@/components/admin-panel"
import { PageShell } from "@/components/page-shell"

export const metadata = { title: "Admin" }

export default function AdminPage() {
  return (
    <PageShell>
      <AdminPanel />
    </PageShell>
  )
}
