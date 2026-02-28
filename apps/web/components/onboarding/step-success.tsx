"use client"

import { useFormContext } from "react-hook-form"
import {
  CheckCircle2,
  Building2,
  Palette,
  UserCircle,
  ArrowRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { OnboardingFormData } from "./onboarding-wizard"

export function StepSuccess() {
  const { watch } = useFormContext<OnboardingFormData>()

  const church = watch("church")
  const theme = watch("theme")
  const admin = watch("admin")

  const summaryItems = [
    {
      icon: Building2,
      label: "Igreja",
      value: church.name,
      detail: `${church.city}, ${church.state} · ${church.email}`,
    },
    {
      icon: Palette,
      label: "Sistema",
      value: theme.systemName,
      detail: "Cores personalizadas configuradas",
    },
    {
      icon: UserCircle,
      label: "Administrador",
      value: admin.fullName,
      detail: "Papel: Master Admin",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
          <CheckCircle2 className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Tudo pronto!</h2>
          <p className="text-muted-foreground mt-1 text-sm max-w-sm">
            Revise as informações abaixo e clique em{" "}
            <strong>Criar Igreja</strong> para finalizar o cadastro.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-4 rounded-lg border bg-card p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <Badge variant="secondary" className="text-xs">Configurado</Badge>
              </div>
              <p className="font-medium text-sm truncate">{item.value}</p>
              <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground rounded-lg bg-muted/50 p-3">
        <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
        <p>
          Após a criação, você será redirecionado para o dashboard com{" "}
          <strong>9 ministérios</strong> padrão já configurados.
        </p>
      </div>
    </div>
  )
}
