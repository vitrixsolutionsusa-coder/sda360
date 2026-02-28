"use client"

import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { OnboardingFormData } from "./onboarding-wizard"

const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" }, { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" }, { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" }, { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" }, { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" }, { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" }, { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" }, { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" }, { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
]

export function StepChurchInfo() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingFormData>()

  const churchName = watch("church.name")

  useEffect(() => {
    if (!churchName) return
    const slug = churchName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setValue("church.slug", slug, { shouldValidate: false })
  }, [churchName, setValue])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Dados da Igreja</h2>
          <p className="text-sm text-muted-foreground">
            Informações básicas da sua congregação
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="church-name">
            Nome da Igreja <span className="text-destructive">*</span>
          </Label>
          <Input
            id="church-name"
            placeholder="Igreja Adventista do Sétimo Dia - Orlando Central"
            {...register("church.name")}
          />
          {errors.church?.name && (
            <p className="text-xs text-destructive">{errors.church.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="church-slug">
            Identificador único (URL)
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">sda360.app/</span>
            <Input
              id="church-slug"
              placeholder="iasd-orlando-central"
              className="font-mono text-sm"
              {...register("church.slug")}
            />
          </div>
          {errors.church?.slug && (
            <p className="text-xs text-destructive">{errors.church.slug.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="church-city">
              Cidade <span className="text-destructive">*</span>
            </Label>
            <Input
              id="church-city"
              placeholder="Orlando"
              {...register("church.city")}
            />
            {errors.church?.city && (
              <p className="text-xs text-destructive">{errors.church.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Estado <span className="text-destructive">*</span></Label>
            <Select
              onValueChange={(val) => setValue("church.state", val, { shouldValidate: true })}
              defaultValue={watch("church.state")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.church?.state && (
              <p className="text-xs text-destructive">{errors.church.state.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="church-address">Endereço</Label>
          <Input
            id="church-address"
            placeholder="1234 Main St, Suite 100"
            {...register("church.address")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="church-email">
              E-mail da Igreja <span className="text-destructive">*</span>
            </Label>
            <Input
              id="church-email"
              type="email"
              placeholder="contato@suaigreja.org"
              {...register("church.email")}
            />
            {errors.church?.email && (
              <p className="text-xs text-destructive">{errors.church.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="church-phone">Telefone</Label>
            <Input
              id="church-phone"
              type="tel"
              placeholder="(407) 555-0100"
              {...register("church.phone")}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
