import { supabase } from "@/supabase"

export const getStudentById = async (id: string) => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("id_number", id)
    .single()

  if (error) throw error
  return data
}