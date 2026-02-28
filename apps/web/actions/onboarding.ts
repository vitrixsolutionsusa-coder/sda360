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

  const existingProfile = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single()

  if (existingProfile.data) {
    return { success: false, error: "Você já possui uma igreja cadastrada." }
  }

  const slug = data.church.slug
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  const { data: existingChurch } = await supabase
    .from("churches")
    .select("id")
    .eq("slug", slug)
    .single()

  if (existingChurch) {
    return {
      success: false,
      error: "Já existe uma igreja com esse identificador. Tente outro nome.",
    }
  }

  const { data: church, error: churchError } = await supabase
    .from("churches")
    .insert({
      name: data.church.name,
      slug,
      city: data.church.city,
      state: data.church.state,
      country: data.church.country,
      phone: data.church.phone || null,
      email: data.church.email,
      address: data.church.address || null,
      system_name: data.theme.systemName,
      primary_color: data.theme.primaryColor,
      secondary_color: data.theme.secondaryColor,
      is_active: true,
    })
    .select("id")
    .single()

  if (churchError || !church) {
    return { success: false, error: "Erro ao criar a igreja. Tente novamente." }
  }

  await supabase.from("church_settings").insert({
    church_id: church.id,
    timezone: data.church.country === "US" ? "America/New_York" : "America/Sao_Paulo",
    language: "pt-BR",
    enable_visitor_form: true,
    enable_pathfinders: false,
    enable_adventurers: false,
    enable_treasury: false,
    enable_communication: true,
  })

  const defaultMinistries = [
    { name: "Música", type: "music", modules: { agenda: true, scale: true, documents: false, reports: true, notifications: true } },
    { name: "Mídia", type: "media", modules: { agenda: true, scale: true, documents: false, reports: false, notifications: true } },
    { name: "Som", type: "sound", modules: { agenda: true, scale: true, documents: false, reports: false, notifications: true } },
    { name: "Transmissão", type: "broadcast", modules: { agenda: true, scale: true, documents: false, reports: false, notifications: true } },
    { name: "Recepção", type: "reception", modules: { agenda: true, scale: true, documents: false, reports: true, notifications: true } },
    { name: "Jovens (JA)", type: "youth", modules: { agenda: true, scale: true, documents: true, reports: true, notifications: true } },
    { name: "Secretaria", type: "secretariat", modules: { agenda: false, scale: false, documents: true, reports: true, notifications: true } },
    { name: "Ancionato", type: "eldership", modules: { agenda: true, scale: true, documents: true, reports: true, notifications: true } },
    { name: "Programação", type: "programming", modules: { agenda: true, scale: false, documents: false, reports: true, notifications: true } },
  ]

  await supabase.from("ministries").insert(
    defaultMinistries.map((m) => ({
      church_id: church.id,
      name: m.name,
      type: m.type,
      is_active: true,
      modules: m.modules,
    }))
  )

  const { error: profileError } = await supabase.from("profiles").insert({
    auth_user_id: user.id,
    church_id: church.id,
    full_name: data.admin.fullName,
    phone: data.admin.phone || null,
    role: "master",
    status: "active",
    is_verified: true,
  })

  if (profileError) {
    await supabase.from("churches").delete().eq("id", church.id)
    return { success: false, error: "Erro ao criar perfil do administrador." }
  }

  redirect("/dashboard")
}

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
