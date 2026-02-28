import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ChevronLeft, Phone, Mail, Calendar, Baby, BookOpen,
  Church, HeartHandshake, Edit, MessageSquare,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { FollowUpNotes } from "@/components/pessoas/follow-up-notes"

export const metadata: Metadata = { title: "Ficha do Visitante" }

const VISITOR_STATUS: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "outline" }> = {
  new: { label: "Novo", variant: "default" },
  in_follow_up: { label: "Em acompanhamento", variant: "warning" },
  integrated: { label: "Integrado", variant: "success" },
  inactive: { label: "Inativo", variant: "outline" },
}

export default async function VisitantePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: visitor } = await supabase
    .from("visitors")
    .select("*")
    .eq("id", id)
    .single()

  if (!visitor) notFound()

  const { data: assignedProfile } = visitor.assigned_to_id
    ? await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", visitor.assigned_to_id)
        .single()
    : { data: null }

  const initials = visitor.full_name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  const statusConfig = VISITOR_STATUS[visitor.status] ?? VISITOR_STATUS.new

  const interests = [
    { active: visitor.interest_bible_study, icon: BookOpen, label: "Estudo Bíblico" },
    { active: visitor.interest_club, icon: Baby, label: "Clube Infantil" },
    { active: visitor.interest_ministry, icon: Church, label: "Ministério" },
    { active: visitor.interest_social_help, icon: HeartHandshake, label: "Ajuda Social" },
  ].filter((i) => i.active)

  const notes = (visitor.follow_up_notes as { date: string; note: string; author_id: string }[]) ?? []

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/pessoas/visitantes"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Visitantes</p>
          <h2 className="text-xl font-bold leading-tight">{visitor.full_name}</h2>
        </div>
        <Link href={`/dashboard/pessoas/visitantes/${id}/editar`}>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Edit className="h-4 w-4" /> Editar
          </Button>
        </Link>
      </div>

      {/* Card principal */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left space-y-3">
              <div>
                <h3 className="text-2xl font-bold">{visitor.full_name}</h3>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                  {visitor.has_children && (
                    <Badge variant="outline" className="gap-1">
                      <Baby className="h-3 w-3" /> Tem filhos
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                {visitor.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" /> {visitor.phone}
                  </div>
                )}
                {visitor.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> {visitor.email}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  1ª visita: {new Date(visitor.first_visit_date).toLocaleDateString("pt-BR")}
                </div>
              </div>

              {assignedProfile && (
                <p className="text-sm text-muted-foreground">
                  Responsável: <span className="font-medium text-foreground">{assignedProfile.full_name}</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interesses */}
      {interests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <div
                  key={interest.label}
                  className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm font-medium"
                >
                  <interest.icon className="h-4 w-4 text-primary" />
                  {interest.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pedido de oração */}
      {visitor.prayer_request && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pedido de Oração</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {visitor.prayer_request}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Acompanhamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" />
            Acompanhamento
            {notes.length > 0 && (
              <Badge variant="secondary">{notes.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FollowUpNotes visitorId={visitor.id} notes={notes} />
        </CardContent>
      </Card>
    </div>
  )
}
