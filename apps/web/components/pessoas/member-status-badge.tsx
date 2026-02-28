import { Badge } from "@/components/ui/badge"

type MemberStatus = "baptized" | "awaiting_transfer" | "visitor" | "regular_attendee"

const STATUS_CONFIG: Record<MemberStatus, { label: string; variant: "success" | "warning" | "secondary" | "outline" }> = {
  baptized: { label: "Batizado", variant: "success" },
  awaiting_transfer: { label: "Ag. Carta", variant: "warning" },
  visitor: { label: "Visitante", variant: "secondary" },
  regular_attendee: { label: "Frequentador", variant: "outline" },
}

export function MemberStatusBadge({ status }: { status: MemberStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.visitor
  return <Badge variant={config.variant}>{config.label}</Badge>
}
