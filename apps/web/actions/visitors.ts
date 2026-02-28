"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { ActionResponse } from "@sda360/types"

export type VisitorFormData = {
  full_name: string
  phone?: string | null
  email?: string | null
  first_visit_date: string
  has_children: boolean
  prayer_request?: string | null
  interest_bible_study: boolean
  interest_club: boolean
  interest_ministry: boolean
  interest_social_help: boolean
  assigned_to_id?: string | null
}

export type FollowUpNoteData = {
  note: string
}

export const createVisitor = async (
  data: VisitorFormData
): Promise<ActionResponse<{ id: string }>> => {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("church_id, id")
    .eq("auth_user_id", user.user!.id)
    .single()

  if (!profile) return { success: false, error: "Perfil não encontrado." }

  const { data: visitor, error } = await supabase
    .from("visitors")
    .insert({
      ...data,
      church_id: profile.church_id,
      status: "new",
      follow_up_notes: [],
    })
    .select("id")
    .single()

  if (error) return { success: false, error: "Erro ao cadastrar visitante." }

  revalidatePath("/dashboard/pessoas/visitantes")
  return { success: true, data: { id: visitor.id } }
}

export const updateVisitor = async (
  id: string,
  data: Partial<VisitorFormData> & { status?: string }
): Promise<ActionResponse> => {
  const supabase = await createClient()

  const { error } = await supabase
    .from("visitors")
    .update(data)
    .eq("id", id)

  if (error) return { success: false, error: "Erro ao atualizar visitante." }

  revalidatePath("/dashboard/pessoas/visitantes")
  revalidatePath(`/dashboard/pessoas/visitantes/${id}`)
  return { success: true, data: undefined }
}

export const addFollowUpNote = async (
  visitorId: string,
  data: FollowUpNoteData
): Promise<ActionResponse> => {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.user!.id)
    .single()

  if (!profile) return { success: false, error: "Perfil não encontrado." }

  const { data: visitor } = await supabase
    .from("visitors")
    .select("follow_up_notes")
    .eq("id", visitorId)
    .single()

  const currentNotes = (visitor?.follow_up_notes as unknown[]) ?? []
  const newNote = {
    date: new Date().toISOString(),
    note: data.note,
    author_id: profile.id,
  }

  const { error } = await supabase
    .from("visitors")
    .update({
      follow_up_notes: [...currentNotes, newNote],
      status: "in_follow_up",
    })
    .eq("id", visitorId)

  if (error) return { success: false, error: "Erro ao adicionar nota." }

  revalidatePath(`/dashboard/pessoas/visitantes/${visitorId}`)
  return { success: true, data: undefined }
}

export const deleteVisitor = async (id: string): Promise<ActionResponse> => {
  const supabase = await createClient()

  const { error } = await supabase.from("visitors").delete().eq("id", id)

  if (error) return { success: false, error: "Erro ao remover visitante." }

  revalidatePath("/dashboard/pessoas/visitantes")
  return { success: true, data: undefined }
}
