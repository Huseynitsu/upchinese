import { Suspense } from "react"
import { AuthForm } from "@/components/auth/auth-form"
import { PageLoader } from "@/components/page-loader"
import { PageShell } from "@/components/page-shell"

export const metadata = { title: "Register" }

export default function RegisterPage() {
  return (
    <PageShell>
      <Suspense fallback={<PageLoader />}>
        <AuthForm mode="register" />
      </Suspense>
    </PageShell>
  )
}
