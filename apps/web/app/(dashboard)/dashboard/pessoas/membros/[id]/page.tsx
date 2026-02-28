import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Mail, Phone, MapPin, Calendar, Edit } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MemberStatusBadge } from "@/components/pessoas/member-status-badge"
import { DeleteMemberButton } from "@/components/pessoas/delete-member-button"

export const metadata: Metadata = { title: "Ficha do Membro" }

export default async function MembroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single()

  if (!member) notFound()

  const initials = member.full_name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  const infoItems = [
    {
      icon: Phone,
      label: "Telefone",
      value: member.phone,
    },
    {
      icon: Mail,
      label: "E-mail",
      value: member.email,
    },
    {
      icon: MapPin,
      label: "Localização",
      value: [member.city, member.state].filter(Boolean).join(", ") || null,
    },
    {
      icon: Calendar,
      label: "Data de batismo",
      value: member.baptism_date
        ? new Date(member.baptism_date).toLocaleDateString("pt-BR")
        : null,
    },
    {
      icon: Calendar,
      label: "Data de nascimento",
      value: member.birth_date
        ? new Date(member.birth_date).toLocaleDateString("pt-BR")
        : null,
    },
  ].filter((item) => item.value)

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/pessoas/membros"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Membros</p>
          <h2 className="text-xl font-bold leading-tight">{member.full_name}</h2>
        </div>
        <div className="flex items-center gap-2">
          <DeleteMemberButton memberId={member.id} memberName={member.full_name} />
          <Link href={`/dashboard/pessoas/membros/${member.id}/editar`}>
            <Button size="sm" className="gap-1.5">
              <Edit className="h-4 w-4" /> Editar
            </Button>
          </Link>
        </div>
      </div>

      {/* Card principal */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={member.photo_url ?? ""} />
              <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold">{member.full_name}</h3>
              <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                <MemberStatusBadge
                  status={member.status as "baptized" | "awaiting_transfer" | "visitor" | "regular_attendee"}
                />
                {member.gender && (
                  <span className="text-sm text-muted-foreground">
                    {member.gender === "male" ? "Masculino" : "Feminino"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações de contato */}
      {infoItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Endereço completo */}
      {(member.address || member.zip_code) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Endereço</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            {member.address && <p>{member.address}</p>}
            <p>
              {[member.city, member.state, member.zip_code].filter(Boolean).join(", ")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Observações */}
      {member.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{member.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
