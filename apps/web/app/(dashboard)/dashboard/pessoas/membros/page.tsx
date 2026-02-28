import type { Metadata } from "next"
import Link from "next/link"
import { UserPlus, Search, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MemberStatusBadge } from "@/components/pessoas/member-status-badge"

export const metadata: Metadata = { title: "Membros" }

type SearchParams = { search?: string; status?: string }

export default async function MembrosPage({
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
    .from("members")
    .select("id, full_name, photo_url, status, city, state, phone, email, baptism_date, birth_date")
    .eq("church_id", profile!.church_id)
    .order("full_name")

  if (params.search) {
    query = query.ilike("full_name", `%${params.search}%`)
  }
  if (params.status) {
    query = query.eq("status", params.status)
  }

  const { data: members, count } = await query

  const statusCounts = {
    all: members?.length ?? 0,
    baptized: members?.filter((m) => m.status === "baptized").length ?? 0,
    awaiting_transfer: members?.filter((m) => m.status === "awaiting_transfer").length ?? 0,
    regular_attendee: members?.filter((m) => m.status === "regular_attendee").length ?? 0,
    visitor: members?.filter((m) => m.status === "visitor").length ?? 0,
  }

  const STATUS_FILTERS = [
    { value: "", label: "Todos", count: statusCounts.all },
    { value: "baptized", label: "Batizados", count: statusCounts.baptized },
    { value: "awaiting_transfer", label: "Ag. Carta", count: statusCounts.awaiting_transfer },
    { value: "regular_attendee", label: "Frequentadores", count: statusCounts.regular_attendee },
    { value: "visitor", label: "Visitantes", count: statusCounts.visitor },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Membros</h2>
          <p className="text-muted-foreground text-sm">
            {members?.length ?? 0} pessoa{(members?.length ?? 0) !== 1 ? "s" : ""} cadastrada{(members?.length ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/dashboard/pessoas/membros/novo">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Novo Membro
          </Button>
        </Link>
      </div>

      {/* Filtros de status */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={`/dashboard/pessoas/membros${filter.value ? `?status=${filter.value}` : ""}${params.search ? `${filter.value ? "&" : "?"}search=${params.search}` : ""}`}
          >
            <Badge
              variant={params.status === filter.value || (!params.status && !filter.value) ? "default" : "outline"}
              className="cursor-pointer gap-1 px-3 py-1 text-sm"
            >
              {filter.label}
              <span className="ml-1 rounded-full bg-background/20 px-1.5 text-xs">
                {filter.count}
              </span>
            </Badge>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <form>
                <Input
                  name="search"
                  defaultValue={params.search}
                  placeholder="Buscar por nome..."
                  className="pl-9"
                />
                {params.status && <input type="hidden" name="status" value={params.status} />}
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!members || members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="font-medium">Nenhum membro encontrado</p>
              <p className="text-sm text-muted-foreground mt-1">
                {params.search ? "Tente buscar por outro nome." : "Comece cadastrando o primeiro membro."}
              </p>
              {!params.search && (
                <Link href="/dashboard/pessoas/membros/novo" className="mt-4">
                  <Button size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" /> Cadastrar Membro
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Cidade</TableHead>
                  <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                  <TableHead className="hidden lg:table-cell">E-mail</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const initials = member.full_name
                    .split(" ")
                    .slice(0, 2)
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                  return (
                    <TableRow key={member.id} className="cursor-pointer">
                      <TableCell>
                        <Link href={`/dashboard/pessoas/membros/${member.id}`} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.photo_url ?? ""} />
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium hover:underline">{member.full_name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <MemberStatusBadge status={member.status as "baptized" | "awaiting_transfer" | "visitor" | "regular_attendee"} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {member.city && member.state ? `${member.city}, ${member.state}` : member.city ?? "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {member.phone ?? "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {member.email ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/pessoas/membros/${member.id}`}>
                          <Button variant="ghost" size="sm">Ver</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
