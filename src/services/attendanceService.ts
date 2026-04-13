import { supabase } from "@/supabase"

// GET LOGS
export const getAttendanceLogs = async () => {
  const { data, error } = await supabase
    .from("attendance_logs")
    .select(`
      *,
      students (
        id_number,
        first_name,
        last_name,
        program,
        year_level
      )
    `)
    .order("time_in", { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}

// CREATE LOG
export const createAttendanceLog = async (studentId: string) => {
  const { data, error } = await supabase
    .from("attendance_logs")
    .insert([
      {
        student_id: studentId,
        attendance_type: "library",
        time_in: new Date()
      }
    ])

  if (error) throw error
  return data
}

export const createTimeOut = async (studentId: string) => {
  const { data, error } = await supabase
    .from("attendance_logs")
    .insert([
      {
        student_id: studentId,
        attendance_type: "library",
        time_out: new Date()
      }
    ])

  if (error) throw error
  return data
}