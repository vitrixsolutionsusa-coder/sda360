import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  CalendarDays,
  Building2,
  UserSearch,
  TrendingUp,
  Clock,
} from "lucide-react"

export const metadata: Metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const firstName = user?.user_metadata?.full_name?.split(" ")[0]
    ?? user?.email?.split("@")[0]
    ?? "Bem-vindo"

  const churchId = user?.user_metadata?.church_id as string | undefined

  if (!churchId) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Olá, {firstName}</h2>
        <p className="text-muted-foreground">Carregando dados da igreja...</p>
      </div>
    )
  }

  const [
    { count: membersCount },
    { count: visitorsCount },
    { count: ministriesCount },
    { data: upcomingEvents },
  ] = await Promise.all([
    supabase
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("church_id", churchId),
    supabase
      .from("visitors")
      .select("*", { count: "exact", head: true })
      .eq("church_id", churchId)
      .eq("status", "new"),
    supabase
      .from("ministries")
      .select("*", { count: "exact", head: true })
      .eq("church_id", churchId)
      .eq("is_active", true),
    supabase
      .from("events")
      .select("id, title, start_date, type, status")
      .eq("church_id", churchId)
      .in("status", ["approved", "published"])
      .gte("start_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(5),
  ])

  const statsCards = [
    {
      title: "Total de Membros",
      value: membersCount ?? 0,
      description: "Membros cadastrados",
      icon: Users,
      trend: "Ver membros",
      href: "/dashboard/pessoas/membros",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Novos Visitantes",
      value: visitorsCount ?? 0,
      description: "Aguardando acompanhamento",
      icon: UserSearch,
      trend: "Ver visitantes",
      href: "/dashboard/pessoas/visitantes",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      title: "Ministérios Ativos",
      value: ministriesCount ?? 0,
      description: "Em atividade regular",
      icon: Building2,
      trend: "Ver ministérios",
      href: "/dashboard/ministerios",
      color: "text-violet-600",
      bgColor: "bg-violet-50 dark:bg-violet-950",
    },
    {
      title: "Próximos Eventos",
      value: upcomingEvents?.length ?? 0,
      description: "Nos próximos dias",
      icon: CalendarDays,
      trend: "Ver agenda",
      href: "/dashboard/agenda",
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
  ]

  const eventTypeLabels: Record<string, string> = {
    worship_service: "Culto",
    youth_meeting: "JA",
    prayer_vigil: "Vigília",
    special: "Especial",
    internal: "Interno",
    community: "Comunitário",
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Olá, {firstName}
        </h2>
        <p className="text-muted-foreground">
          Aqui está um resumo do que está acontecendo na sua igreja.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <a key={card.title} href={card.href}>
            <Card className="overflow-hidden hover:border-primary/40 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`rounded-md p-2 ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  {card.trend}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Próximos Eventos
          </CardTitle>
          <CardDescription>
            Eventos aprovados e publicados nos próximos dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!upcomingEvents || upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CalendarDays className="h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">
                Nenhum evento próximo encontrado.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const date = new Date(event.start_date)
                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-md bg-primary/10 text-primary">
                        <span className="text-xs font-medium">
                          {date.toLocaleDateString("pt-BR", { day: "2-digit" })}
                        </span>
                        <span className="text-xs uppercase">
                          {date.toLocaleDateString("pt-BR", { month: "short" })}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {date.toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={event.status === "published" ? "success" : "secondary"}>
                      {eventTypeLabels[event.type] ?? event.type}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
