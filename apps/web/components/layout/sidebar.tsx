"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Church } from "lucide-react"
import { cn } from "@/lib/utils"
import { SidebarNav } from "./sidebar-nav"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"

type SidebarProps = {
  churchName?: string
  systemName?: string
  logoUrl?: string | null
  primaryColor?: string
}

export function Sidebar({
  churchName = "SDA360",
  systemName = "SDA360",
  logoUrl,
  primaryColor,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
        style={
          primaryColor
            ? ({ "--church-primary": primaryColor } as React.CSSProperties)
            : undefined
        }
      >
        {/* Logo / Cabeçalho */}
        <div className={cn("flex h-16 items-center border-b px-4", isCollapsed && "justify-center px-2")}>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={churchName}
              width={isCollapsed ? 32 : 120}
              height={32}
              className="object-contain"
            />
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-foreground">
              <Church className="h-6 w-6 shrink-0 text-primary" />
              {!isCollapsed && (
                <span className="truncate text-sm">{systemName}</span>
              )}
            </Link>
          )}
        </div>

        {/* Navegação */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <SidebarNav collapsed={isCollapsed} />
        </div>

        <Separator />

        {/* Toggle collapse */}
        <div className={cn("flex h-12 items-center border-t px-2", isCollapsed ? "justify-center" : "justify-end")}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
