import type { Metadata } from "next"
import { Suspense } from "react"
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Configuração Inicial | SDA360",
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-lg mx-auto space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      }
    >
      <OnboardingWizard />
    </Suspense>
  )
}
