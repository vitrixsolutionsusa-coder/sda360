import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Verifica onboarding via user metadata (não depende de RLS)
  const hasProfile = user.user_metadata?.has_profile === true
  if (!hasProfile) {
    redirect("/onboarding")
  }

  const churchId = user.user_metadata?.church_id as string | undefined

  // Busca dados da igreja para o white-label (sem RLS block pois é
  // filtrado pelo church_id que veio do JWT — confiável)
  let church: {
    name: string
    slug: string
    logo_url: string | null
    primary_color: string
    secondary_color: string
    system_name: string
  } | null = null

  if (churchId) {
    const { data } = await supabase
      .from("churches")
      .select("name, slug, logo_url, primary_color, secondary_color, system_name")
      .eq("id", churchId)
      .maybeSingle()
    church = data
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        churchName={church?.name}
        systemName={church?.system_name}
        logoUrl={church?.logo_url}
        primaryColor={church?.primary_color}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
