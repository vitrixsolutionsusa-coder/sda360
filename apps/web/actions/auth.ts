"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { ActionResponse } from "@sda360/types"

export const signIn = async (
  email: string,
  password: string
): Promise<ActionResponse> => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export const signUp = async (
  email: string,
  password: string,
  fullName: string
): Promise<ActionResponse> => {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: undefined }
}

export const signOut = async (): Promise<void> => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
