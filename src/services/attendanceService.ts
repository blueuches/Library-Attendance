import { supabase } from "@/supabase"

/**
 * Fetch latest 20 logs with student details
 */
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

/**
 * Main logic for library attendance (Multi-entry & 7PM Cutoff)
 */
export const handleAttendance = async (studentId: string) => {
  const now = new Date()
  
  // Check 7:00 PM cutoff
  const closingTime = new Date()
  closingTime.setHours(19, 0, 0, 0)

  if (now > closingTime) {
    return { type: "closed" } 
  }

  // 2. CHECK IF STUDENT EXISTS FIRST
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id_number")
    .eq("id_number", studentId)
    .maybeSingle()

  if (studentError) throw studentError
  
  if (!student) {
    return { type: "not_found" }
  }

  // 3. Set today's time range
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  // 4. Get latest log for today
  const { data: latestLog, error: fetchError } = await supabase
    .from("attendance_logs")
    .select("*")
    .eq("student_id", studentId)
    .gte("time_in", todayStart.toISOString())
    .lte("time_in", todayEnd.toISOString())
    .order("time_in", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (fetchError) throw fetchError

  /**
   * Logic:
   * If no record or already timed out -> Create new Time-In
   * If record exists without time-out -> Update with Time-Out
   */
  if (!latestLog || latestLog.time_out) {
    const { error } = await supabase.from("attendance_logs").insert([
      {
        student_id: studentId,
        attendance_type: "library",
        time_in: now.toISOString(),
        time_out: null,
      },
    ])

    if (error) throw error
    return { type: "time_in" }
  } 
  else {
    const { error } = await supabase
      .from("attendance_logs")
      .update({ time_out: now.toISOString() })
      .eq("id", latestLog.id)

    if (error) throw error
    return { type: "time_out" }
  }
}

/**
 * Manual/Direct Time-In for Library
 */
export const createAttendanceLog = async (studentId: string) => {
  const { data, error } = await supabase
    .from("attendance_logs")
    .insert([{
      student_id: studentId,
      attendance_type: "library",
      time_in: new Date().toISOString()
    }])

  if (error) throw error
  return data
}

/**
 * Create log for Event type
 */
export const createAttendanceLogEvent = async (payload: {
  student_id: string
  attendance_type: string
  event_id?: string | null
}) => {
  const { data, error } = await supabase
    .from('attendance_logs')
    .insert([{
      student_id: payload.student_id,
      attendance_type: payload.attendance_type,
      event_id: payload.event_id ?? null,
      time_in: new Date().toISOString()
    }])

  if (error) throw error
  return data
}

/**
 * Find active session and set Time-Out
 */
export const createTimeOut = async (studentId: string) => {
  const { data: latest } = await supabase
    .from("attendance_logs")
    .select("id")
    .eq("student_id", studentId)
    .is("time_out", null)
    .order("time_in", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (latest) {
    const { data, error } = await supabase
      .from("attendance_logs")
      .update({ time_out: new Date().toISOString() })
      .eq("id", latest.id)
    
    if (error) throw error
    return data
  }
}