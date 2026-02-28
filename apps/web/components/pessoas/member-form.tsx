"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createMember, updateMember } from "@/actions/members"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const memberSchema = z.object({
  full_name: z.string().min(2, "Nome obrigatório"),
  status: z.enum(["baptized", "awaiting_transfer", "visitor", "regular_attendee"]),
  baptism_date: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  phone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  notes: z.string().optional(),
})

type MemberFormValues = z.infer<typeof memberSchema>

type Elder = { id: string; full_name: string }

type MemberFormProps = {
  mode: "create" | "edit"
  memberId?: string
  defaultValues?: Partial<MemberFormValues>
  elders?: Elder[]
  onSuccess?: () => void
}

export function MemberForm({ mode, memberId, defaultValues, elders = [], onSuccess }: MemberFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      status: "baptized",
      ...defaultValues,
    },
  })

  const status = watch("status")

  const onSubmit = (data: MemberFormValues) => {
    startTransition(async () => {
      const payload = {
        ...data,
        baptism_date: data.baptism_date || null,
        birth_date: data.birth_date || null,
        gender: data.gender || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zip_code: data.zip_code || null,
        notes: data.notes || null,
      }

      if (mode === "create") {
        const result = await createMember(payload)
        if (!result.success) { toast.error(result.error); return }
        toast.success("Membro cadastrado com sucesso!")
        onSuccess?.()
        router.push(`/dashboard/pessoas/membros/${result.data.id}`)
      } else {
        const result = await updateMember(memberId!, payload)
        if (!result.success) { toast.error(result.error); return }
        toast.success("Membro atualizado!")
        onSuccess?.()
        router.push(`/dashboard/pessoas/membros/${memberId}`)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dados pessoais */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Dados Pessoais
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="full_name">Nome completo <span className="text-destructive">*</span></Label>
            <Input id="full_name" placeholder="João da Silva" {...register("full_name")} />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Status <span className="text-destructive">*</span></Label>
            <Select
              defaultValue={defaultValues?.status ?? "baptized"}
              onValueChange={(v) => setValue("status", v as MemberFormValues["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baptized">Batizado</SelectItem>
                <SelectItem value="awaiting_transfer">Aguardando Carta</SelectItem>
                <SelectItem value="regular_attendee">Frequentador Regular</SelectItem>
                <SelectItem value="visitor">Visitante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gênero</Label>
            <Select
              defaultValue={defaultValues?.gender ?? ""}
              onValueChange={(v) => setValue("gender", v as "male" | "female")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(status === "baptized" || status === "awaiting_transfer") && (
            <div className="space-y-2">
              <Label htmlFor="baptism_date">Data de batismo</Label>
              <Input id="baptism_date" type="date" {...register("baptism_date")} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="birth_date">Data de nascimento</Label>
            <Input id="birth_date" type="date" {...register("birth_date")} />
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Contato
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone / WhatsApp</Label>
            <Input id="phone" type="tel" placeholder="(407) 555-0100" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="joao@email.com" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Endereço
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Rua / Endereço</Label>
            <Input id="address" placeholder="1234 Main St" {...register("address")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" placeholder="Orlando" {...register("city")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input id="state" placeholder="FL" maxLength={2} className="uppercase" {...register("state")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip_code">CEP / ZIP</Label>
            <Input id="zip_code" placeholder="32801" {...register("zip_code")} />
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea
          id="notes"
          placeholder="Informações adicionais sobre o membro..."
          rows={3}
          {...register("notes")}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
          className="flex-1 sm:flex-none"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Cadastrar Membro" : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  )
}
