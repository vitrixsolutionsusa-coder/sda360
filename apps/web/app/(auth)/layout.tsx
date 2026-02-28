import { Church } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Lado esquerdo - Branding */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-primary p-12 text-primary-foreground">
        <div className="flex items-center gap-3 mb-8">
          <Church className="h-12 w-12" />
          <span className="text-3xl font-bold">SDA360</span>
        </div>
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-semibold">
            Sistema Operacional Ministerial
          </h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Plataforma completa para gestão operacional de igrejas adventistas
            locais. Organize pessoas, ministérios, agenda e muito mais.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8 text-sm">
            {[
              { label: "Membros", icon: "👥" },
              { label: "Ministérios", icon: "⛪" },
              { label: "Agenda", icon: "📅" },
              { label: "Programação", icon: "📺" },
              { label: "Recepção", icon: "🤝" },
              { label: "Relatórios", icon: "📊" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-1 rounded-lg bg-primary-foreground/10 p-3"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Church className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SDA360</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
