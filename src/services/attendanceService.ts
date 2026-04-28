import { supabase } from '@/supabase'

export type AttendanceResult =
  | { type: 'success'; message?: string; data?: any }
  | { type: 'not_found'; message?: string }
  | { type: 'already_done'; message?: string; data?: any }
  | { type: 'no_active_time_in'; message?: string }
  | { type: 'closed'; message?: string }
  | { type: 'error'; message?: string; error?: any }

const ATTENDANCE_PAGE_TABLE = 'attendance_page'
const ATTENDANCE_PAGE_ELEMENT_NAME = 'school_info'

const getTodayRange = () => {
  const now = new Date()

  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)

  return {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString(),
  }
}

const normalizeIdNumber = (value: string) => {
  const cleaned = String(value || '').replace(/\r/g, '').replace(/\n/g, '').trim()
  const matches = cleaned.match(/\d{3}-\d{5}/g)

  if (matches && matches.length > 0) {
    return matches[matches.length - 1]
  }

  return cleaned
}

const safeParseElementForm = (value: any) => {
  if (!value || value === 'EMPTY') return {}

  if (typeof value === 'object') return value

  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return {}
    }
  }

  return {}
}

export const getAttendancePageSettings = async () => {
  try {
    const { data, error } = await supabase
      .from(ATTENDANCE_PAGE_TABLE)
      .select('element_form')
      .eq('element_name', ATTENDANCE_PAGE_ELEMENT_NAME)
      .maybeSingle()

    if (error) {
      console.error('Failed to fetch attendance_page settings:', error)
      return { time_out_enabled: true }
    }

    const parsed = safeParseElementForm(data?.element_form)

    return {
      time_out_enabled:
        typeof parsed.time_out_enabled === 'boolean' ? parsed.time_out_enabled : true,
    }
  } catch (error) {
    console.error('getAttendancePageSettings error:', error)
    return { time_out_enabled: true }
  }
}

export const getStudentByIdNumber = async (idNumber: string) => {
  const normalizedId = normalizeIdNumber(idNumber)

  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id_number', normalizedId)
    .maybeSingle()

  if (error) throw error

  return data
}

export const getActiveLibraryTimeIn = async (idNumber: string) => {
  const normalizedId = normalizeIdNumber(idNumber)
  const { start, end } = getTodayRange()

  const { data, error } = await supabase
    .from('attendance_logs')
    .select('*')
    .eq('student_id', normalizedId)
    .eq('attendance_type', 'library')
    .gte('time_in', start)
    .lte('time_in', end)
    .not('time_in', 'is', null)
    .is('time_out', null)
    .order('time_in', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error

  return data
}

export const handleAttendanceIn = async (
  rawIdNumber: string,
  _legacyStrictMode = true,
): Promise<AttendanceResult> => {
  try {
    const idNumber = normalizeIdNumber(rawIdNumber)

    if (!idNumber) {
      return {
        type: 'not_found',
        message: 'Invalid ID.',
      }
    }

    const student = await getStudentByIdNumber(idNumber)

    if (!student) {
      return {
        type: 'not_found',
        message: 'Student not found.',
      }
    }

    const settings = await getAttendancePageSettings()
    const timeOutEnabled = settings.time_out_enabled

    const activeLog = await getActiveLibraryTimeIn(idNumber)

    // Enable Time Out ON = strict
    // Student must time out first before another time in.
    if (timeOutEnabled && activeLog) {
      return {
        type: 'already_done',
        message: 'This ID already has an active time-in. Please time out first.',
        data: activeLog,
      }
    }

    // Enable Time Out OFF = non-strict
    // Student can time in again even without time out.
    const { data, error } = await supabase
      .from('attendance_logs')
      .insert({
        student_id: idNumber,
        attendance_type: 'library',
        time_in: new Date().toISOString(),
        time_out: null,
      })
      .select('*')
      .single()

    if (error) throw error

    return {
      type: 'success',
      message: timeOutEnabled
        ? 'Time-in recorded successfully.'
        : 'Time-in recorded successfully. Time-out strict mode is disabled.',
      data,
    }
  } catch (error) {
    console.error('handleAttendanceIn error:', error)

    return {
      type: 'error',
      message: 'Something went wrong while recording time-in.',
      error,
    }
  }
}

export const handleAttendanceOut = async (rawIdNumber: string): Promise<AttendanceResult> => {
  try {
    const idNumber = normalizeIdNumber(rawIdNumber)

    if (!idNumber) {
      return {
        type: 'not_found',
        message: 'Invalid ID.',
      }
    }

    const student = await getStudentByIdNumber(idNumber)

    if (!student) {
      return {
        type: 'not_found',
        message: 'Student not found.',
      }
    }

    const activeLog = await getActiveLibraryTimeIn(idNumber)

    if (!activeLog) {
      return {
        type: 'already_done',
        message: 'This ID has no active time-in record for today.',
      }
    }

    const { data, error } = await supabase
      .from('attendance_logs')
      .update({
        time_out: new Date().toISOString(),
      })
      .eq('id', activeLog.id)
      .select('*')
      .single()

    if (error) throw error

    return {
      type: 'success',
      message: 'Time-out recorded successfully.',
      data,
    }
  } catch (error) {
    console.error('handleAttendanceOut error:', error)

    return {
      type: 'error',
      message: 'Something went wrong while recording time-out.',
      error,
    }
  }
}

/**
 * Used by ACCESS-EVENT.vue.
 * This restores the missing export causing the white screen.
 *
 * Flexible parameters:
 * - createAttendanceLogEvent(idNumber, eventId)
 * - createAttendanceLogEvent(idNumber, { event_id: eventId })
 */
export const createAttendanceLogEvent = async (
  rawIdNumber: string,
  eventInput?: string | { event_id?: string; eventId?: string; id?: string } | null,
): Promise<AttendanceResult> => {
  try {
    const idNumber = normalizeIdNumber(rawIdNumber)

    if (!idNumber) {
      return {
        type: 'not_found',
        message: 'Invalid ID.',
      }
    }

    const student = await getStudentByIdNumber(idNumber)

    if (!student) {
      return {
        type: 'not_found',
        message: 'Student not found.',
      }
    }

    const eventId =
      typeof eventInput === 'string'
        ? eventInput
        : eventInput?.event_id || eventInput?.eventId || eventInput?.id || null

    const payload: Record<string, any> = {
      student_id: idNumber,
      attendance_type: 'event',
      time_in: new Date().toISOString(),
      time_out: null,
    }

    if (eventId) {
      payload.event_id = eventId
    }

    const { data, error } = await supabase
      .from('attendance_logs')
      .insert(payload)
      .select('*')
      .single()

    if (error) throw error

    return {
      type: 'success',
      message: 'Event attendance recorded successfully.',
      data,
    }
  } catch (error) {
    console.error('createAttendanceLogEvent error:', error)

    return {
      type: 'error',
      message: 'Something went wrong while recording event attendance.',
      error,
    }
  }
}

export const getAttendanceLogs = async () => {
  const { data, error } = await supabase
    .from('attendance_logs')
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
    .order('time_in', { ascending: false })

  if (error) throw error

  return data || []
}