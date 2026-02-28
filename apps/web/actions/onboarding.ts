"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { ActionResponse } from "@sda360/types"

type OnboardingData = {
  church: {
    name: string
    slug: string
    city: string
    state: string
    country: string
    phone: string
    email: string
    address: string
  }
  theme: {
    systemName: string
    primaryColor: string
    secondaryColor: string
  }
  admin: {
    fullName: string
    phone: string
  }
}

export const completeOnboarding = async (
  data: OnboardingData
): Promise<ActionResponse> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Usuário não autenticado." }
  }

  const { data: result, error } = await supabase.rpc(
    "complete_church_onboarding",
    {
      p_church_name:      data.church.name,
      p_church_slug:      data.church.slug,
      p_church_city:      data.church.city,
      p_church_state:     data.church.state,
      p_church_country:   data.church.country,
      p_church_phone:     data.church.phone ?? "",
      p_church_email:     data.church.email,
      p_church_address:   data.church.address ?? "",
      p_system_name:      data.theme.systemName,
      p_primary_color:    data.theme.primaryColor,
      p_secondary_color:  data.theme.secondaryColor,
      p_admin_full_name:  data.admin.fullName,
      p_admin_phone:      data.admin.phone ?? "",
    }
  )

  if (error) {
    return { success: false, error: "Erro ao processar cadastro. Tente novamente." }
  }

  const rpcResult = result as { success: boolean; error?: string }

  if (!rpcResult.success) {
    return { success: false, error: rpcResult.error ?? "Erro desconhecido." }
  }

  redirect("/dashboard")
}
