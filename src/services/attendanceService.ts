import { supabase } from "@/supabase"

export const getAttendanceLogs = async () => {
  const { data, error } = await supabase
    .from("attendance_logs")
    .select(`
      *,
      students (
        id_number,
        full_name,
        course
      )
    `)
    .order("time_in", { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}