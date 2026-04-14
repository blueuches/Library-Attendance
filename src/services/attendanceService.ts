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

// CREATE LOG FOR LIBRARY TYPE
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

export const createAttendanceLogEvent = async (payload: {
  student_id: string
  attendance_type: string
  event_id?: string | null
}) => {
  const { data, error } = await supabase
    .from('attendance_logs')
    .insert([
      {
        student_id: payload.student_id,
        attendance_type: payload.attendance_type,
        event_id: payload.event_id ?? null,
        time_in: new Date().toISOString()
      }
    ])

  if (error) throw error
  return data
}

export const handleAttendance = async (studentId: string) => {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  // 1. Check existing log for today
  const { data: existingLog, error: fetchError } = await supabase
    .from("attendance_logs")
    .select("*")
    .eq("student_id", studentId)
    .gte("time_in", todayStart.toISOString())
    .lte("time_in", todayEnd.toISOString())
    .order("time_in", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (fetchError) throw fetchError

  // 2. NO RECORD → TIME IN
  if (!existingLog) {
    const { error } = await supabase.from("attendance_logs").insert([
      {
        student_id: studentId,
        attendance_type: "library",
        time_in: new Date(),
        time_out: null,
      },
    ])

    if (error) throw error
    return { type: "time_in" }
  }

  // 3. HAS RECORD but NO TIME OUT → TIME OUT
  if (existingLog && !existingLog.time_out) {
    const { error } = await supabase
      .from("attendance_logs")
      .update({
        time_out: new Date(),
      })
      .eq("id", existingLog.id)

    if (error) throw error
    return { type: "time_out" }
  }

  // 4. ALREADY TIMED OUT
  return { type: "already_done" }
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

//CREATE LOG FOR EVENT TYPE


//CREATE LOG FOR VISITORS TYPE