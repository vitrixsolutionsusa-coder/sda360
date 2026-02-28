"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createVisitor, updateVisitor } from "@/actions/visitors"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const visitorSchema = z.object({
  full_name: z.string().min(2, "Nome obrigatório"),
  phone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  first_visit_date: z.string().min(1, "Data da visita obrigatória"),
  has_children: z.boolean().default(false),
  prayer_request: z.string().optional(),
  interest_bible_study: z.boolean().default(false),
  interest_club: z.boolean().default(false),
  interest_ministry: z.boolean().default(false),
  interest_social_help: z.boolean().default(false),
  assigned_to_id: z.string().optional(),
})

type VisitorFormValues = z.infer<typeof visitorSchema>

type Responsible = { id: string; full_name: string }

type VisitorFormProps = {
  mode: "create" | "edit"
  visitorId?: string
  defaultValues?: Partial<VisitorFormValues>
  responsibles?: Responsible[]
  onSuccess?: () => void
}

export function VisitorForm({ mode, visitorId, defaultValues, responsibles = [], onSuccess }: VisitorFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      first_visit_date: new Date().toISOString().split("T")[0],
      has_children: false,
      interest_bible_study: false,
      interest_club: false,
      interest_ministry: false,
      interest_social_help: false,
      ...defaultValues,
    },
  })

  const onSubmit = (data: VisitorFormValues) => {
    startTransition(async () => {
      const payload = {
        ...data,
        phone: data.phone || null,
        email: data.email || null,
        prayer_request: data.prayer_request || null,
        assigned_to_id: data.assigned_to_id || null,
      }

      if (mode === "create") {
        const result = await createVisitor(payload)
        if (!result.success) { toast.error(result.error); return }
        toast.success("Visitante cadastrado!")
        onSuccess?.()
        router.push(`/dashboard/pessoas/visitantes/${result.data.id}`)
      } else {
        const result = await updateVisitor(visitorId!, payload)
        if (!result.success) { toast.error(result.error); return }
        toast.success("Visitante atualizado!")
        onSuccess?.()
        router.push(`/dashboard/pessoas/visitantes/${visitorId}`)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Dados pessoais */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Dados do Visitante
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="v-full_name">Nome completo <span className="text-destructive">*</span></Label>
            <Input id="v-full_name" placeholder="Maria Oliveira" {...register("full_name")} />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="v-phone">Telefone / WhatsApp</Label>
            <Input id="v-phone" type="tel" placeholder="(407) 555-0100" {...register("phone")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="v-email">E-mail</Label>
            <Input id="v-email" type="email" placeholder="maria@email.com" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="v-first_visit_date">Data da 1ª visita <span className="text-destructive">*</span></Label>
            <Input id="v-first_visit_date" type="date" {...register("first_visit_date")} />
            {errors.first_visit_date && <p className="text-xs text-destructive">{errors.first_visit_date.message}</p>}
          </div>

          <div className="flex items-center gap-3 pt-6">
            <Checkbox
              id="has_children"
              checked={watch("has_children")}
              onCheckedChange={(v) => setValue("has_children", Boolean(v))}
            />
            <Label htmlFor="has_children" className="cursor-pointer">Tem filhos / crianças</Label>
          </div>
        </div>
      </div>

      {/* Interesses */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Interesses
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { field: "interest_bible_study" as const, label: "Estudo Bíblico" },
            { field: "interest_club" as const, label: "Clube (Desbravadores/Aventureiros)" },
            { field: "interest_ministry" as const, label: "Participar de Ministério" },
            { field: "interest_social_help" as const, label: "Ajuda Social" },
          ].map((item) => (
            <div key={item.field} className="flex items-center gap-2">
              <Checkbox
                id={item.field}
                checked={watch(item.field)}
                onCheckedChange={(v) => setValue(item.field, Boolean(v))}
              />
              <Label htmlFor={item.field} className="cursor-pointer text-sm">{item.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Responsável */}
      {responsibles.length > 0 && (
        <div className="space-y-2">
          <Label>Atribuir acompanhamento a</Label>
          <Select
            defaultValue={defaultValues?.assigned_to_id ?? ""}
            onValueChange={(v) => setValue("assigned_to_id", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar responsável..." />
            </SelectTrigger>
            <SelectContent>
              {responsibles.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Pedido de oração */}
      <div className="space-y-2">
        <Label htmlFor="prayer_request">Pedido de oração</Label>
        <Textarea
          id="prayer_request"
          placeholder="Pedido de oração ou observações..."
          rows={3}
          {...register("prayer_request")}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending} className="flex-1 sm:flex-none">
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Cadastrar Visitante" : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  )
}
