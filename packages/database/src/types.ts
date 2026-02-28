export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      churches: {
        Row: {
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
        Insert: Omit<Database["public"]["Tables"]["churches"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["churches"]["Insert"]>
      }
      profiles: {
        Row: {
          id: string
          auth_user_id: string
          church_id: string
          full_name: string
          avatar_url: string | null
          phone: string | null
          role: string
          status: string
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>
      }
      members: {
        Row: {
          id: string
          church_id: string
          profile_id: string | null
          full_name: string
          photo_url: string | null
          status: string
          baptism_date: string | null
          birth_date: string | null
          gender: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          phone: string | null
          email: string | null
          responsible_elder_id: string | null
          transfer_history: Json
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["members"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["members"]["Insert"]>
      }
      ministries: {
        Row: {
          id: string
          church_id: string
          name: string
          type: string
          description: string | null
          leader_id: string | null
          responsible_elder_id: string | null
          is_active: boolean
          modules: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["ministries"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["ministries"]["Insert"]>
      }
      events: {
        Row: {
          id: string
          church_id: string
          title: string
          description: string | null
          type: string
          status: string
          start_date: string
          end_date: string
          location: string | null
          is_recurring: boolean
          recurrence_rule: string | null
          responsible_ids: string[]
          ministry_ids: string[]
          checklist: Json
          attachments: string[]
          notes: string | null
          created_by_id: string
          approved_by_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["events"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>
      }
      visitors: {
        Row: {
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
          follow_up_notes: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["visitors"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["visitors"]["Insert"]>
      }
      audit_logs: {
        Row: {
          id: string
          church_id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at">
        Update: never
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "master" | "pastor" | "elder" | "ministry_leader" | "team_member" | "parent" | "member" | "public"
      member_status: "baptized" | "awaiting_transfer" | "visitor" | "regular_attendee"
      event_status: "draft" | "pending_approval" | "approved" | "published" | "cancelled"
      visitor_status: "new" | "in_follow_up" | "integrated" | "inactive"
    }
  }
}
