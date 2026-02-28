"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  Tv2,
  UserSearch,
  BookOpen,
  FileText,
  Bell,
  Settings,
  ChevronDown,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
  children?: NavItem[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Pessoas",
    href: "/dashboard/pessoas",
    icon: Users,
    children: [
      { label: "Membros", href: "/dashboard/pessoas/membros", icon: Users },
      { label: "Visitantes", href: "/dashboard/pessoas/visitantes", icon: UserSearch },
    ],
  },
  {
    label: "Ministérios",
    href: "/dashboard/ministerios",
    icon: Building2,
  },
  {
    label: "Agenda",
    href: "/dashboard/agenda",
    icon: CalendarDays,
  },
  {
    label: "Programação",
    href: "/dashboard/programacao",
    icon: Tv2,
  },
  {
    label: "Recepção",
    href: "/dashboard/recepcao",
    icon: UserSearch,
  },
  {
    label: "Secretaria",
    href: "/dashboard/secretaria",
    icon: BookOpen,
  },
  {
    label: "Relatórios",
    href: "/dashboard/relatorios",
    icon: FileText,
  },
]

type SidebarNavProps = {
  collapsed?: boolean
}

export function SidebarNav({ collapsed = false }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 p-2">
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.href}
          item={item}
          pathname={pathname}
          collapsed={collapsed}
        />
      ))}
    </nav>
  )
}

type NavItemProps = {
  item: NavItem
  pathname: string
  collapsed: boolean
  depth?: number
}

function NavItem({ item, pathname, collapsed, depth = 0 }: NavItemProps) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(item.href))
  const hasChildren = item.children && item.children.length > 0

  const itemContent = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          : "text-foreground/70",
        collapsed && "justify-center px-2",
        depth > 0 && "pl-9 text-xs"
      )}
    >
      <item.icon className={cn("shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4")} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          )}
        </>
      )}
    </Link>
  )

  return (
    <div>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      ) : (
        itemContent
      )}
      {hasChildren && !collapsed && isActive && (
        <div className="mt-1 flex flex-col gap-1">
          {item.children!.map((child) => (
            <NavItem
              key={child.href}
              item={child}
              pathname={pathname}
              collapsed={collapsed}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
