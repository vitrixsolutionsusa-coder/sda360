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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, churches(name, slug, logo_url, primary_color, secondary_color, system_name)")
    .eq("auth_user_id", user.id)
    .single()

  const church = profile?.churches as {
    name: string
    slug: string
    logo_url: string | null
    primary_color: string
    secondary_color: string
    system_name: string
  } | null

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
