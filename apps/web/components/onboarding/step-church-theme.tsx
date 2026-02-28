"use client"

import { useFormContext } from "react-hook-form"
import { Palette, Church } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { OnboardingFormData } from "./onboarding-wizard"

const PRESET_COLORS = [
  { primary: "#1d4ed8", secondary: "#7c3aed", label: "Azul Royal" },
  { primary: "#0f766e", secondary: "#0284c7", label: "Esmeralda" },
  { primary: "#7c3aed", secondary: "#db2777", label: "Violeta" },
  { primary: "#b91c1c", secondary: "#c2410c", label: "Vermelho" },
  { primary: "#0369a1", secondary: "#0891b2", label: "Oceano" },
  { primary: "#1e3a5f", secondary: "#1d4ed8", label: "Marinho" },
]

export function StepChurchTheme() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingFormData>()

  const primaryColor = watch("theme.primaryColor")
  const secondaryColor = watch("theme.secondaryColor")
  const systemName = watch("theme.systemName")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Palette className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Identidade Visual</h2>
          <p className="text-sm text-muted-foreground">
            Personalize o sistema com as cores da sua igreja
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Preview */}
        <div
          className="rounded-xl p-4 text-white flex items-center gap-3 shadow-md"
          style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Church className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">{systemName || "SDA360"}</p>
            <p className="text-white/80 text-xs">Sistema Ministerial</p>
          </div>
        </div>

        {/* Nome do sistema */}
        <div className="space-y-2">
          <Label htmlFor="system-name">
            Nome do sistema <span className="text-destructive">*</span>
          </Label>
          <Input
            id="system-name"
            placeholder="SDA360"
            {...register("theme.systemName")}
          />
          <p className="text-xs text-muted-foreground">
            Como o sistema aparecerá para seus membros
          </p>
          {errors.theme?.systemName && (
            <p className="text-xs text-destructive">{errors.theme.systemName.message}</p>
          )}
        </div>

        {/* Paletas predefinidas */}
        <div className="space-y-2">
          <Label>Paleta de cores</Label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  setValue("theme.primaryColor", preset.primary)
                  setValue("theme.secondaryColor", preset.secondary)
                }}
                className={cn(
                  "group relative h-14 rounded-lg overflow-hidden border-2 transition-all",
                  primaryColor === preset.primary
                    ? "border-foreground scale-105"
                    : "border-transparent hover:border-muted-foreground/30"
                )}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                  }}
                />
                <span className="absolute bottom-1 left-0 right-0 text-center text-white text-[10px] font-medium drop-shadow">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cores customizadas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary-color">Cor Primária</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="primary-color"
                value={primaryColor}
                onChange={(e) => setValue("theme.primaryColor", e.target.value)}
                className="h-10 w-12 cursor-pointer rounded border border-input p-0.5"
              />
              <Input
                value={primaryColor}
                onChange={(e) => setValue("theme.primaryColor", e.target.value)}
                placeholder="#1d4ed8"
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary-color">Cor Secundária</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="secondary-color"
                value={secondaryColor}
                onChange={(e) => setValue("theme.secondaryColor", e.target.value)}
                className="h-10 w-12 cursor-pointer rounded border border-input p-0.5"
              />
              <Input
                value={secondaryColor}
                onChange={(e) => setValue("theme.secondaryColor", e.target.value)}
                placeholder="#7c3aed"
                className="font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
