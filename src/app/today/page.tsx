import { PageShell } from "@/components/page-shell"
import { DailyPath } from "@/components/tools/daily-path"

export const metadata = { title: "Today" }

export default function TodayPage() {
  return (
    <PageShell>
      <DailyPath />
    </PageShell>
  )
}
