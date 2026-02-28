import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { MemberForm } from "@/components/pessoas/member-form"

export const metadata: Metadata = { title: "Editar Membro" }

export default async function EditarMembroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single()

  if (!member) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/pessoas/membros/${id}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Editar Membro</h2>
          <p className="text-sm text-muted-foreground">{member.full_name}</p>
        </div>
      </div>
      <MemberForm
        mode="edit"
        memberId={id}
        defaultValues={{
          full_name: member.full_name,
          status: member.status as "baptized" | "awaiting_transfer" | "visitor" | "regular_attendee",
          baptism_date: member.baptism_date ?? undefined,
          birth_date: member.birth_date ?? undefined,
          gender: member.gender as "male" | "female" | undefined ?? undefined,
          phone: member.phone ?? undefined,
          email: member.email ?? undefined,
          address: member.address ?? undefined,
          city: member.city ?? undefined,
          state: member.state ?? undefined,
          zip_code: member.zip_code ?? undefined,
          notes: member.notes ?? undefined,
        }}
      />
    </div>
  )
}
