import type { Metadata } from "next"
import Link from "next/link"
import { UserPlus, Search, UserSearch, BookOpen, Church, HeartHandshake, Baby } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export const metadata: Metadata = { title: "Visitantes" }

type SearchParams = { search?: string; status?: string }

const VISITOR_STATUS: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "outline" }> = {
  new: { label: "Novo", variant: "default" },
  in_follow_up: { label: "Em acompanhamento", variant: "warning" },
  integrated: { label: "Integrado", variant: "success" },
  inactive: { label: "Inativo", variant: "outline" },
}

export default async function VisitantesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("church_id")
    .eq("auth_user_id", user.user!.id)
    .single()

  let query = supabase
    .from("visitors")
    .select("id, full_name, phone, email, first_visit_date, has_children, status, interest_bible_study, interest_club, interest_ministry, interest_social_help, prayer_request")
    .eq("church_id", profile!.church_id)
    .order("created_at", { ascending: false })

  if (params.search) {
    query = query.ilike("full_name", `%${params.search}%`)
  }
  if (params.status) {
    query = query.eq("status", params.status)
  }

  const { data: visitors } = await query

  const statusCounts = {
    all: visitors?.length ?? 0,
    new: visitors?.filter((v) => v.status === "new").length ?? 0,
    in_follow_up: visitors?.filter((v) => v.status === "in_follow_up").length ?? 0,
    integrated: visitors?.filter((v) => v.status === "integrated").length ?? 0,
  }

  const STATUS_FILTERS = [
    { value: "", label: "Todos", count: statusCounts.all },
    { value: "new", label: "Novos", count: statusCounts.new },
    { value: "in_follow_up", label: "Em acompanhamento", count: statusCounts.in_follow_up },
    { value: "integrated", label: "Integrados", count: statusCounts.integrated },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Visitantes</h2>
          <p className="text-muted-foreground text-sm">
            {visitors?.length ?? 0} visitante{(visitors?.length ?? 0) !== 1 ? "s" : ""} cadastrado{(visitors?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/pessoas/visitantes/novo">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Novo Visitante
          </Button>
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={`/dashboard/pessoas/visitantes${filter.value ? `?status=${filter.value}` : ""}${params.search ? `${filter.value ? "&" : "?"}search=${params.search}` : ""}`}
          >
            <Badge
              variant={params.status === filter.value || (!params.status && !filter.value) ? "default" : "outline"}
              className="cursor-pointer gap-1 px-3 py-1 text-sm"
            >
              {filter.label}
              <span className="ml-1 rounded-full bg-background/20 px-1.5 text-xs">{filter.count}</span>
            </Badge>
          </Link>
        ))}
      </div>

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <form>
          <Input
            name="search"
            defaultValue={params.search}
            placeholder="Buscar visitante..."
            className="pl-9"
          />
          {params.status && <input type="hidden" name="status" value={params.status} />}
        </form>
      </div>

      {/* Cards de visitantes */}
      {!visitors || visitors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <UserSearch className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="font-medium">Nenhum visitante encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            {params.search ? "Tente buscar por outro nome." : "Comece cadastrando o primeiro visitante."}
          </p>
          {!params.search && (
            <Link href="/dashboard/pessoas/visitantes/novo" className="mt-4">
              <Button size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" /> Cadastrar Visitante
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visitors.map((visitor) => {
            const initials = visitor.full_name
              .split(" ")
              .slice(0, 2)
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()

            const interests = [
              visitor.interest_bible_study && { icon: BookOpen, label: "Estudo Bíblico" },
              visitor.interest_club && { icon: Baby, label: "Clube" },
              visitor.interest_ministry && { icon: Church, label: "Ministério" },
              visitor.interest_social_help && { icon: HeartHandshake, label: "Ajuda Social" },
            ].filter(Boolean) as { icon: typeof BookOpen; label: string }[]

            const statusConfig = VISITOR_STATUS[visitor.status] ?? VISITOR_STATUS.new

            return (
              <Link key={visitor.id} href={`/dashboard/pessoas/visitantes/${visitor.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm font-medium">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{visitor.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(visitor.first_visit_date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <Badge variant={statusConfig.variant} className="shrink-0 text-xs">
                        {statusConfig.label}
                      </Badge>
                    </div>

                    {visitor.phone && (
                      <p className="text-xs text-muted-foreground">{visitor.phone}</p>
                    )}

                    {interests.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {interests.map((interest) => (
                          <div
                            key={interest.label}
                            className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            <interest.icon className="h-3 w-3" />
                            {interest.label}
                          </div>
                        ))}
                      </div>
                    )}

                    {visitor.has_children && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Baby className="h-3 w-3" /> Tem filhos
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
