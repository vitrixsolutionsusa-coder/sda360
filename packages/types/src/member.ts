export type MemberStatus =
  | "baptized"
  | "awaiting_transfer"
  | "visitor"
  | "regular_attendee"

export type Member = {
  id: string
  church_id: string
  profile_id: string | null
  full_name: string
  photo_url: string | null
  status: MemberStatus
  baptism_date: string | null
  birth_date: string | null
  gender: "male" | "female" | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  phone: string | null
  email: string | null
  responsible_elder_id: string | null
  transfer_history: TransferRecord[]
  notes: string | null
  created_at: string
  updated_at: string
}

export type TransferRecord = {
  date: string
  from_church: string
  to_church: string
  reason: string | null
}

export type Visitor = {
  id: string
  church_id: string
  full_name: string
  phone: string | null
  email: string | null
  first_visit_date: string
  has_children: boolean
  prayer_request: string | null
  interest_bible_study: boolean
  interest_club: boolean
  interest_ministry: boolean
  interest_social_help: boolean
  assigned_to_id: string | null
  follow_up_notes: FollowUpNote[]
  status: "new" | "in_follow_up" | "integrated" | "inactive"
  created_at: string
  updated_at: string
}

export type FollowUpNote = {
  date: string
  note: string
  author_id: string
}
