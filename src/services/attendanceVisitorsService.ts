import { supabase } from "@/supabase"

// CREATE LOG FOR VISITORS TYPE
export const createVisitorLog = async (fullName: string) => {
  const { data, error } = await supabase
    .from("attendance_logs_visitors")
    .insert([
      {
        full_name: fullName,
        time_in: new Date()
      }
    ])

  if (error) throw error
  return data
}

// GET VISITOR LOGS
export const getVisitorLogs = async () => {
  const { data, error } = await supabase
    .from("attendance_logs_visitors")
    .select("*")
    .order("time_in", { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}