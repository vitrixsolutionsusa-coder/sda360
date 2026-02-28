"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { completeOnboarding } from "@/actions/onboarding"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StepChurchInfo } from "./step-church-info"
import { StepChurchTheme } from "./step-church-theme"
import { StepAdminProfile } from "./step-admin-profile"
import { StepSuccess } from "./step-success"

const onboardingSchema = z.object({
  church: z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    slug: z.string().min(2, "Identificador inválido"),
    city: z.string().min(2, "Cidade obrigatória"),
    state: z.string().min(2, "Estado obrigatório"),
    country: z.string().default("US"),
    address: z.string().optional().default(""),
    email: z.string().email("E-mail inválido"),
    phone: z.string().optional().default(""),
  }),
  theme: z.object({
    systemName: z.string().min(2, "Nome do sistema obrigatório"),
    primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
    secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida"),
  }),
  admin: z.object({
    fullName: z.string().min(3, "Nome completo obrigatório"),
    phone: z.string().optional().default(""),
  }),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>

const STEPS = [
  { id: 1, label: "Igreja", component: StepChurchInfo },
  { id: 2, label: "Visual", component: StepChurchTheme },
  { id: 3, label: "Admin", component: StepAdminProfile },
  { id: 4, label: "Revisão", component: StepSuccess },
]

const STEP_FIELDS: Record<number, (keyof OnboardingFormData)[]> = {
  1: ["church"],
  2: ["theme"],
  3: ["admin"],
  4: [],
}

export function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isPending, startTransition] = useTransition()

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      church: {
        name: "",
        slug: "",
        city: "",
        state: "",
        country: "US",
        address: "",
        email: "",
        phone: "",
      },
      theme: {
        systemName: "SDA360",
        primaryColor: "#1d4ed8",
        secondaryColor: "#7c3aed",
      },
      admin: {
        fullName: "",
        phone: "",
      },
    },
    mode: "onChange",
  })

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep]
    const isValid = await methods.trigger(fields)
    if (!isValid) return
    setCurrentStep((s) => Math.min(s + 1, STEPS.length))
  }

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }

  const handleSubmit = (data: OnboardingFormData) => {
    startTransition(async () => {
      const result = await completeOnboarding({
        church: {
          name: data.church.name,
          slug: data.church.slug,
          city: data.church.city,
          state: data.church.state,
          country: data.church.country,
          phone: data.church.phone ?? "",
          email: data.church.email,
          address: data.church.address ?? "",
        },
        theme: data.theme,
        admin: {
          fullName: data.admin.fullName,
          phone: data.admin.phone ?? "",
        },
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success("Igreja cadastrada com sucesso!")
      router.push("/dashboard")
    })
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component
  const isLastStep = currentStep === STEPS.length

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-lg mx-auto space-y-6">
        {/* Header com steps */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Etapa {currentStep} de {STEPS.length}
            </span>
            <span className="text-muted-foreground">
              {STEPS[currentStep - 1].label}
            </span>
          </div>
          <Progress value={progress} />
          <div className="flex justify-between">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    step.id < currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.id === currentStep
                        ? "border-2 border-primary text-primary"
                        : "border border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? "✓" : step.id}
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    step.id === currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdo do step */}
        <div className="rounded-xl border bg-card p-6 shadow-sm min-h-[400px]">
          <CurrentStepComponent />
        </div>

        {/* Navegação */}
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1 || isPending}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Button>

          {isLastStep ? (
            <Button
              type="button"
              className="flex-1"
              onClick={methods.handleSubmit(handleSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando igreja...
                </>
              ) : (
                "Criar Igreja"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1"
              onClick={handleNext}
              disabled={isPending}
            >
              Continuar
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  )
}
