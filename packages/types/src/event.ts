export type EventStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "published"
  | "cancelled"

export type EventType =
  | "worship_service"
  | "youth_meeting"
  | "prayer_vigil"
  | "special"
  | "internal"
  | "community"

export type Event = {
  id: string
  church_id: string
  title: string
  description: string | null
  type: EventType
  status: EventStatus
  start_date: string
  end_date: string
  location: string | null
  is_recurring: boolean
  recurrence_rule: string | null
  responsible_ids: string[]
  ministry_ids: string[]
  checklist: ChecklistItem[]
  attachments: string[]
  notes: string | null
  created_by_id: string
  approved_by_id: string | null
  created_at: string
  updated_at: string
}

export type ChecklistItem = {
  id: string
  text: string
  is_done: boolean
  done_by_id: string | null
  done_at: string | null
}

export type ServiceProgram = {
  id: string
  church_id: string
  event_id: string | null
  date: string
  type: "worship_service" | "youth_meeting" | "prayer_vigil" | "special"
  title: string
  blocks: ProgramBlock[]
  notes: string | null
  total_estimated_minutes: number
  total_real_minutes: number | null
  created_by_id: string
  created_at: string
  updated_at: string
}

export type ProgramBlock = {
  id: string
  order: number
  name: string
  responsible_id: string | null
  ministry_id: string | null
  estimated_minutes: number
  real_minutes: number | null
  subtasks: string[]
  notes: string | null
}
