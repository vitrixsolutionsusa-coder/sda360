import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { VisitorForm } from "@/components/pessoas/visitor-form"

export const metadata: Metadata = { title: "Novo Visitante" }

export default async function NovoVisitantePage() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("church_id")
    .eq("auth_user_id", user.user!.id)
    .single()

  const { data: responsibles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("church_id", profile!.church_id)
    .in("role", ["master", "pastor", "elder", "ministry_leader"])
    .order("full_name")

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/pessoas/visitantes"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Novo Visitante</h2>
          <p className="text-sm text-muted-foreground">
            Cadastre um novo visitante e seus interesses
          </p>
        </div>
      </div>
      <VisitorForm mode="create" responsibles={responsibles ?? []} />
    </div>
  )
}
