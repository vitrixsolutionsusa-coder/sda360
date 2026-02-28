export type Church = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  primary_color: string
  secondary_color: string
  domain: string | null
  system_name: string
  address: string | null
  city: string | null
  state: string | null
  country: string
  phone: string | null
  email: string | null
  website: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ChurchSettings = {
  id: string
  church_id: string
  timezone: string
  language: string
  enable_visitor_form: boolean
  enable_pathfinders: boolean
  enable_adventurers: boolean
  enable_treasury: boolean
  enable_communication: boolean
  created_at: string
  updated_at: string
}
