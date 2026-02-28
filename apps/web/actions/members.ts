"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { ActionResponse } from "@sda360/types"

export type MemberFormData = {
  full_name: string
  status: "baptized" | "awaiting_transfer" | "visitor" | "regular_attendee"
  baptism_date?: string | null
  birth_date?: string | null
  gender?: "male" | "female" | null
  phone?: string | null
  email?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  responsible_elder_id?: string | null
  notes?: string | null
}

export const createMember = async (
  data: MemberFormData
): Promise<ActionResponse<{ id: string }>> => {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("church_id")
    .eq("auth_user_id", (await supabase.auth.getUser()).data.user!.id)
    .single()

  if (!profile) return { success: false, error: "Perfil não encontrado." }

  const { data: member, error } = await supabase
    .from("members")
    .insert({ ...data, church_id: profile.church_id })
    .select("id")
    .single()

  if (error) return { success: false, error: "Erro ao cadastrar membro." }

  revalidatePath("/dashboard/pessoas/membros")
  return { success: true, data: { id: member.id } }
}

export const updateMember = async (
  id: string,
  data: Partial<MemberFormData>
): Promise<ActionResponse> => {
  const supabase = await createClient()

  const { error } = await supabase
    .from("members")
    .update(data)
    .eq("id", id)

  if (error) return { success: false, error: "Erro ao atualizar membro." }

  revalidatePath("/dashboard/pessoas/membros")
  revalidatePath(`/dashboard/pessoas/membros/${id}`)
  return { success: true, data: undefined }
}

export const deleteMember = async (id: string): Promise<ActionResponse> => {
  const supabase = await createClient()

  const { error } = await supabase.from("members").delete().eq("id", id)

  if (error) return { success: false, error: "Erro ao remover membro." }

  revalidatePath("/dashboard/pessoas/membros")
  return { success: true, data: undefined }
}
