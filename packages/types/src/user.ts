export type UserRole =
  | "master"
  | "pastor"
  | "elder"
  | "ministry_leader"
  | "team_member"
  | "parent"
  | "member"
  | "public"

export type UserStatus = "active" | "inactive" | "pending"

export type Profile = {
  id: string
  auth_user_id: string
  church_id: string
  full_name: string
  avatar_url: string | null
  phone: string | null
  role: UserRole
  status: UserStatus
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type Permission = {
  id: string
  name: string
  description: string | null
  module: string
  action: "view" | "create" | "edit" | "delete" | "approve" | "publish"
}

export type RolePermission = {
  id: string
  role: UserRole
  permission_id: string
  church_id: string
}
