"use client"

import { useFormContext } from "react-hook-form"
import { UserCircle, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { OnboardingFormData } from "./onboarding-wizard"

export function StepAdminProfile() {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingFormData>()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <UserCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Perfil do Administrador</h2>
          <p className="text-sm text-muted-foreground">
            Seus dados como administrador master da igreja
          </p>
        </div>
      </div>

      {/* Badge de papel */}
      <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-4">
        <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">Nível de Acesso</p>
            <Badge variant="default">Master Admin</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Como fundador desta conta, você terá acesso total ao sistema,
            podendo gerenciar todos os módulos, usuários e configurações.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="admin-name">
            Nome completo <span className="text-destructive">*</span>
          </Label>
          <Input
            id="admin-name"
            placeholder="João da Silva"
            autoComplete="name"
            {...register("admin.fullName")}
          />
          {errors.admin?.fullName && (
            <p className="text-xs text-destructive">
              {errors.admin.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-phone">Telefone / WhatsApp</Label>
          <Input
            id="admin-phone"
            type="tel"
            placeholder="(407) 555-0100"
            autoComplete="tel"
            {...register("admin.phone")}
          />
          <p className="text-xs text-muted-foreground">
            Usado para notificações importantes do sistema
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 p-4 space-y-1">
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Revise antes de finalizar
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Após a criação, a estrutura da igreja ficará disponível imediatamente.
          Você poderá convidar membros, configurar ministérios e personalizar
          tudo a qualquer momento nas configurações.
        </p>
      </div>
    </div>
  )
}
