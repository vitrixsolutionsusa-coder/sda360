import { redirect } from "next/navigation"
import { Church } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function OnboardingLayout({
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
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle()

  if (profile) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Church className="h-6 w-6 text-primary" />
            <span>SDA360</span>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            Configuração inicial
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo ao SDA360
          </h1>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Vamos configurar sua Igreja em menos de 2 minutos. Você poderá
            personalizar tudo depois.
          </p>
        </div>
        {children}
      </main>
    </div>
  )
}
