export type MinistryType =
  | "music"
  | "media"
  | "sound"
  | "broadcast"
  | "reception"
  | "asa"
  | "womens"
  | "mens"
  | "youth"
  | "pathfinders"
  | "adventurers"
  | "secretariat"
  | "treasury"
  | "eldership"
  | "programming"
  | "custom"

export type Ministry = {
  id: string
  church_id: string
  name: string
  type: MinistryType
  description: string | null
  leader_id: string | null
  responsible_elder_id: string | null
  is_active: boolean
  modules: MinistryModules
  created_at: string
  updated_at: string
}

export type MinistryModules = {
  agenda: boolean
  scale: boolean
  documents: boolean
  reports: boolean
  notifications: boolean
}

export type MinistryMember = {
  id: string
  ministry_id: string
  profile_id: string
  role: "leader" | "co_leader" | "member"
  joined_at: string
}

export type Scale = {
  id: string
  ministry_id: string
  church_id: string
  date: string
  event_id: string | null
  assignments: ScaleAssignment[]
  notes: string | null
  created_at: string
  updated_at: string
}

export type ScaleAssignment = {
  profile_id: string
  function: string
  status: "pending" | "confirmed" | "declined"
}
