<template>
  <div class="relative h-screen w-screen text-white flex flex-col overflow-hidden bg-[#0b3d1f]">
    <div
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
      style="background-image: url('/hero-outside.jpg')"
    ></div>

    <div class="relative z-10 flex flex-col h-full w-full">
      <!-- Header -->
      <div class="flex items-center justify-center pt-8 pb-4 px-10 relative">
        <!-- Left Logo -->
        <div class="absolute left-10">
          <img src="/csu-logo.png" alt="Logo" class="h-32 w-32 object-contain" />
        </div>

        <!-- Center Title -->
        <div class="text-center">
          <h1
            class="text-6xl uppercase leading-none font-black drop-shadow-md bg-[linear-gradient(90deg,#FFC300_0%,#ffffff_50%,#1b5e20_100%)] bg-clip-text text-transparent"
            style="font-family: Impact"
          >
            {{ schoolInfo.school_name }}
          </h1>

          <h2
            class="pb-4 text-2xl uppercase text-green-100 font-bold"
            style="font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"
          >
            {{ schoolInfo.building_title }}
          </h2>

          <div
            class="mt-4 inline-block bg-white/10 border border-white/20 px-6 py-2 rounded-md font-semibold text-LG opacity-100"
          >
            {{ schoolInfo.system_name }}
          </div>
        </div>

        <!-- Right Dropdown -->
        <div class="absolute right-10">
          <select
            v-model="attendanceType"
            @change="handleAttendanceChange"
            class="access-dropdown bg-white/10 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-md font-semibold shadow-md hover:bg-white/20 transition"
          >
            <option disabled value="">Select Attendance</option>
            <option value="library">Library Attendance</option>
            <option value="event">Event Attendance</option>
            <option value="visitors">Visitors' Attendance</option>
          </select>
        </div>
      </div>

      <div class="flex-1 flex flex-row-reverse px-10 pb-10 gap-8 overflow-hidden">
        <!-- Left Column: Camera + Manual Entry -->
        <div class="w-[400px] flex flex-col gap-4">
          <div class="bg-white/40 border border-white/10 p-6 rounded-2xl text-center">
            <div class="text-xl opacity-70 uppercase font-bold">{{ formattedDate }}</div>
            <div class="text-4xl font-mono font-bold text-green-400 mt-1">{{ formattedTime }}</div>
          </div>

          <div
            class="flex-1 bg-white/10 border rounded-2xl overflow-hidden relative flex flex-col shadow-2xl"
          >
            <div class="p-3 bg-white/10 flex justify-between items-center px-4">
              <span class="text-xs font-black tracking-widest uppercase">Live Camera Feed</span>
              <button
                v-if="isScannerRunning"
                @click="stopScanner"
                class="text-[10px] bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-bold transition-all border border-red-400 shadow-lg"
              >
                STOP CAMERA
              </button>
            </div>

            <div id="qr-reader" class="flex-1 w-full bg-black/20"></div>

            <div class="p-4 bg-black/40 flex flex-col gap-3">
              <input
                v-model="idInput"
                type="text"
                placeholder="Manual Entry..."
                @keyup.enter="(e: KeyboardEvent) => handleLogin()"
                class="w-full p-2 rounded border border-white/80 text-white"
              />
              <button
                v-if="!isScannerRunning"
                @click="startScanner"
                class="w-full py-3 rounded-lg font-bold transition-all bg-green-700 hover:bg-green-600 border border-green-500 shadow-md"
              >
                START CAMERA
              </button>
              <div
                v-else
                class="w-full py-3 text-center text-green-400 font-bold animate-pulse text-sm tracking-widest"
              >
                SCANNER IS ACTIVE...
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Attendance Table -->
        <div class="flex-1 flex flex-col min-h-0">
          <div
            class="flex-1 bg-white/10 rounded-2xl overflow-y-auto overflow-x-hidden hidden-scroll border border-white/20 shadow-2xl"
          >
            <table class="w-full text-white border-collapse">
              <thead class="sticky top-0 z-20 bg-white/40 backdrop-blur-md">
                <tr class="text-left">
                  <th
                    class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10"
                  >
                    ID Number
                  </th>
                  <th
                    class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10"
                  >
                    Name
                  </th>
                  <th
                    class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10"
                  >
                    Course
                  </th>
                  <th
                    class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10"
                  >
                    Year Level
                  </th>
                  <th
                    class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10"
                  >
                    Time-In
                  </th>
                  <th
                    class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10"
                  >
                    Time-Out
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr
                  v-for="log in attendanceLogs"
                  :key="log.id"
                  class="hover:bg-white/5 transition-colors"
                >
                  <td class="p-4 font-bold text-xl">{{ log.student_id }}</td>
                  <td class="p-4 font-bold text-xl uppercase">
                    {{ log.students?.first_name }} {{ log.students?.last_name }}
                  </td>
                  <td class="p-4 text-lg opacity-80">{{ log.students?.program }}</td>
                  <td class="p-4 text-lg opacity-80">{{ log.students?.year_level || '—' }}</td>
                  <td class="p-4 font-mono text-lg opacity-80 font-bold">
                    {{
                      log.time_in
                        ? new Date(log.time_in).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'
                    }}
                  </td>
                  <td class="p-4 font-mono text-lg opacity-80 font-bold">
                    {{
                      log.time_out
                        ? new Date(log.time_out).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showEventModal"
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
  >
    <div class="bg-white rounded-lg p-6 w-[400px] shadow-xl">
      <h2 class="text-xl font-bold mb-4">Select Event</h2>
      <select v-model="selectedEvent" class="w-full border p-2 rounded mb-4">
        <option disabled value="">Choose an event</option>
        <option v-for="event in events" :key="event.id" :value="event">
          {{ event.name }}
        </option>
      </select>
      <div class="flex justify-end gap-2">
        <button @click="showEventModal = false" class="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
        <button @click="goToEvent" class="px-4 py-2 bg-green-600 text-white rounded">
          Proceed
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Html5Qrcode } from 'html5-qrcode'
import { getAttendanceLogs, createAttendanceLog } from '@/services/attendanceService'
import { getStudentById } from '@/services/studentService'
import { supabase } from '@/supabase'

// STATE
const idInput = ref('')
const attendanceLogs = ref<any[]>([])
const isScannerRunning = ref(false)
const isProcessing = ref(false)
let html5QrCode: Html5Qrcode | null = null
const currentTime = ref(new Date())
let timer: any
let schoolInfoTimer: any

// SCHOOL INFO STATE
const schoolInfo = ref({
  id: '',
  element_name: '',
  school_name: '',
  building_title: '',
  system_name: '',
  bg_path: '',
  max_capacity: 0,
  opening_time: '',
  closing_time: '',
  address: '',
  edited_by: '',
  edited_at: '',
})

// FETCH SCHOOL INFO FROM attendance_page
const fetchSchoolInfo = async () => {
  const { data, error } = await supabase
    .from('attendance_page')
    .select('*')
    .eq('element_name', 'school_info')
    .single()

  if (error) {
    console.error('School info fetch error:', error.message)
    return
  }

  if (!data) return

  try {
    const parsed =
      typeof data.element_form === 'string'
        ? JSON.parse(data.element_form)
        : data.element_form || {}

    schoolInfo.value = {
      ...schoolInfo.value,
      id: data.id || '',
      element_name: data.element_name || '',
      edited_by: data.edited_by || '',
      edited_at: data.edited_at || '',
      ...parsed,
    }
  } catch (e) {
    console.error('JSON parse error:', e)
  }
}

// FETCH ATTENDANCE WITH STUDENT INFO
const fetchLogs = async () => {
  try {
    const logs = await getAttendanceLogs()
    const logsWithStudent = await Promise.all(
      logs.map(async (log: any) => {
        let studentData = null
        try {
          studentData = await getStudentById(log.student_id)
        } catch (e) {
          console.warn('Student not found for ID:', log.student_id)
        }

        return {
          ...log,
          students: studentData,
          log_time: log.time_in
            ? new Date(log.time_in).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : null,
          time_in_formatted: log.time_in
            ? new Date(log.time_in).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : null,
          time_out_formatted: log.time_out
            ? new Date(log.time_out).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : null,
        }
      }),
    )
    attendanceLogs.value = logsWithStudent
  } catch (err) {
    console.error('Failed to fetch attendance logs:', err)
  }
}

// HANDLE LOGIN
const handleLogin = async (decodedText?: string) => {
  if (isProcessing.value) return

  const rawData = decodedText || idInput.value
  if (!rawData.trim()) return

  isProcessing.value = true

  try {
    const studentId = rawData.trim()
    const student = await getStudentById(studentId)

    if (!student) {
      console.warn('Student not found')
      return
    }

    await createAttendanceLog(studentId)
    await fetchLogs()

    const audio = new Audio('/beep.mp3')
    audio.play().catch(() => {})

    idInput.value = ''
  } catch (err) {
    console.error('Attendance error:', err)
  } finally {
    setTimeout(() => {
      isProcessing.value = false
    }, 2000)
  }
}

// CAMERA SCANNER LOGIC
const startScanner = async () => {
  if (!html5QrCode) return
  isScannerRunning.value = true
  html5QrCode
    .start(
      { facingMode: 'environment' },
      { fps: 15, qrbox: { width: 250, height: 250 } },
      (decodedText) => handleLogin(decodedText),
      () => {},
    )
    .catch((err) => {
      console.error('Camera start error:', err)
      isScannerRunning.value = false
    })
}

const stopScanner = async () => {
  if (html5QrCode && isScannerRunning.value) {
    await html5QrCode.stop()
    isScannerRunning.value = false
  }
}

// DATE & TIME + MOUNT
onMounted(() => {
  fetchSchoolInfo()
  fetchLogs()
  html5QrCode = new Html5Qrcode('qr-reader')
  timer = setInterval(() => (currentTime.value = new Date()), 1000)
  schoolInfoTimer = setInterval(() => fetchSchoolInfo(), 5000)

  supabase
    .channel('attendance_page_realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'attendance_page',
      },
      () => {
        fetchSchoolInfo()
      },
    )
    .subscribe()
})

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(schoolInfoTimer)
  if (html5QrCode?.isScanning) html5QrCode.stop()
  supabase.removeAllChannels()
})

// FORMATTED DATE/TIME
const formattedDate = computed(() =>
  currentTime.value.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

const formattedTime = computed(() =>
  currentTime.value.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }),
)

// Types
interface Event {
  id: string
  name: string
}

// State
const attendanceType = ref<string>('')
const showEventModal = ref<boolean>(false)
const events = ref<Event[]>([])
const selectedEvent = ref<Event | null>(null)

const router = useRouter()

// Methods
const handleAttendanceChange = async () => {
  if (attendanceType.value === 'event') {
    await fetchEvents()
    showEventModal.value = true
  }
  if (attendanceType.value === 'visitors') {
    goToVisitors()
    showEventModal.value = true
  }
  if (attendanceType.value === 'library') {
    goToLibrary()
    showEventModal.value = true
  }
}

const fetchEvents = async () => {
  const { data, error } = await supabase.from('events').select('*')
  if (error) {
    console.error('Error fetching events:', error)
    return
  }
  events.value = data as Event[]
}

const goToEvent = () => {
  if (!selectedEvent.value) return
  router.push({ name: 'event', query: { id: selectedEvent.value.id } })
  showEventModal.value = false
}

const goToVisitors = () => {
  router.push({ name: 'visitors' })
  showEventModal.value = false
}

const goToLibrary = () => {
  router.push({ name: 'access' })
  showEventModal.value = false
}
</script>

<style>
#qr-reader img {
  display: none;
}

#qr-reader video {
  object-fit: cover !important;
  width: 100% !important;
  height: 100% !important;
  border-radius: 12px;
}

.hidden-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hidden-scroll::-webkit-scrollbar {
  display: none;
}

.access-dropdown {
  appearance: none;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
  padding: 10px 40px 10px 16px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
  transition: all 0.25s ease;
  position: relative;
}

.access-dropdown:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.access-dropdown:focus {
  outline: none;
  border: 1px solid #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.4);
}

.access-dropdown-wrapper {
  position: relative;
}

.access-dropdown-wrapper::after {
  content: '▾';
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 14px;
  pointer-events: none;
  opacity: 0.8;
}
</style>