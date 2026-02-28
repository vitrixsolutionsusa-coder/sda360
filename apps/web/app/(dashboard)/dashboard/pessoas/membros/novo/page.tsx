import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { MemberForm } from "@/components/pessoas/member-form"

export const metadata: Metadata = { title: "Novo Membro" }

export default function NovoMembroPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/pessoas/membros" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold">Novo Membro</h2>
          <p className="text-sm text-muted-foreground">Preencha os dados para cadastrar um novo membro</p>
        </div>
      </div>
      <MemberForm mode="create" />
    </div>
  )
}
