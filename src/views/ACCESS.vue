<template>
  <div class="relative h-screen w-screen text-white flex flex-col overflow-hidden bg-[#0b3d1f]">
    <div
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
      :style="backgroundStyle"
    ></div>

    <div class="relative z-10 flex flex-col h-full w-full">
      <!-- Header -->
      <div class="flex items-center justify-center pt-8 pb-4 px-10 relative">
        <!-- Left Logo -->
        <div class="absolute left-10">
          <img
            :src="schoolInfo.logo_path || '/csu-logo.png'"
            alt="Logo"
            class="h-32 w-32 object-contain"
          />
        </div>

        <!-- Center Title -->
        <div class="text-center">
          <h1
            class="text-6xl uppercase leading-none font-black drop-shadow-md bg-[linear-gradient(90deg,#FFC300_0%,#ffffff_50%,#1b5e20_100%)] bg-clip-text text-transparent"
            style="font-family: Impact;"
          >
            {{ schoolInfo.school_name }}
          </h1>

          <h2
            class="pb-4 text-2xl uppercase text-green-100 font-bold"
            style="font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;"
          >
            {{ schoolInfo.building_title }}
          </h2>

          <div
            class="mt-4 inline-block bg-white/10 border border-white/20 px-6 py-2 rounded-md font-semibold text-LG opacity-100"
          >
            {{
              schoolInfo.system_name
            }}
          </div>
        </div>

        <!-- Right: Pill Selector -->
        <div class="absolute right-10 flex flex-col items-center gap-2">
          <span class="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40">
            Attendance Type
          </span>
          <div class="attendance-pill-group">
            <button
              v-for="type in attendanceTypes"
              :key="type.value"
              @click="setAttendanceType(type.value)"
              :class="['attendance-pill-btn', attendanceType === type.value ? 'active' : '']"
            >
              <span class="pill-icon" v-html="type.icon"></span>
              {{ type.label }}
            </button>
          </div>
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
                  <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">ID Number</th>
                  <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Name</th>
                  <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Course</th>
                  <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Year Level</th>
                  <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Time-In</th>
                  <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Time-Out</th>
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

  <!-- Event Selection Modal -->
  <Transition name="modal">
    <div
      v-if="showEventModal"
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);"
    >
      <div class="event-modal">
        <div class="event-modal-header">
          <div class="event-modal-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="9" stroke="#4ade80" stroke-width="1.8"/>
              <path d="M11 7v4.5l2.5 2" stroke="#4ade80" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="event-modal-header-text">
            <div class="event-modal-title">Select Event</div>
            <div class="event-modal-subtitle">Choose an event to record attendance for</div>
          </div>
          <button @click="showEventModal = false" class="event-modal-close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="event-modal-body">
          <div class="event-modal-section-label">Available Events</div>
          <div class="event-modal-list">
            <button
              v-for="event in events"
              :key="event.id"
              @click="selectedEvent = event"
              :class="['event-modal-item', selectedEvent?.id === event.id ? 'active' : '']"
            >
              <span class="event-modal-dot"></span>
              <span class="event-modal-name">{{ event.title }}</span>
              <span class="event-modal-check">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M2 5.5l2.5 2.5L9 3" stroke="#4ade80" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </button>

            <div v-if="events.length === 0" class="event-modal-empty">
              No events available.
            </div>
          </div>
        </div>

        <div class="event-modal-footer">
          <button @click="showEventModal = false" class="event-modal-btn-cancel">
            Cancel
          </button>
          <button
            @click="goToEvent"
            :disabled="!selectedEvent"
            :class="['event-modal-btn-proceed', selectedEvent ? 'ready' : '']"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Proceed to Event
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { useRouter } from 'vue-router'
import { Html5Qrcode } from "html5-qrcode"
import { getAttendanceLogs, handleAttendance } from "@/services/attendanceService"
import { getStudentById } from "@/services/studentService"
import { supabase } from "@/supabase"

// ─── ICONS ────────────────────────────────────────────────────────────────────
const ICON_LIBRARY = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/>
  <path d="M5 8h6M5 5.5h6M5 10.5h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
</svg>`

const ICON_EVENT = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/>
  <path d="M8 5v3.5l2 1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`

const ICON_VISITORS = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="6" cy="5" r="2" stroke="currentColor" stroke-width="1.3"/>
  <path d="M2 13c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
  <circle cx="11.5" cy="5.5" r="1.5" stroke="currentColor" stroke-width="1.2"/>
  <path d="M13.5 13c0-1.66-1.12-3-2.5-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
</svg>`

// ─── ATTENDANCE TYPE PILL DATA ────────────────────────────────────────────────
const attendanceTypes = [
  { value: 'library', label: 'Library', icon: ICON_LIBRARY },
  { value: 'event', label: 'Event', icon: ICON_EVENT },
  { value: 'visitors', label: 'Visitors', icon: ICON_VISITORS },
]

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Event {
  id: string
  title: string
}

interface SchoolInfo {
  school_name: string
  building_title: string
  system_name: string
  bg_path: string
  logo_path: string
  max_capacity: number
  opening_time: string
  closing_time: string
  address: string
}

// ─── STATE ────────────────────────────────────────────────────────────────────
const idInput = ref("")
const attendanceLogs = ref<any[]>([])
const isScannerRunning = ref(false)
const isProcessing = ref(false)
let html5QrCode: Html5Qrcode | null = null
const currentTime = ref(new Date())
let timer: any
let schoolInfoTimer: any
let attendancePageChannel: any = null

const attendanceType = ref<string>('library')
const showEventModal = ref<boolean>(false)
const events = ref<Event[]>([])
const selectedEvent = ref<Event | null>(null)

const schoolInfo = ref<SchoolInfo>({
  school_name: '',
  building_title: '',
  system_name: '',
  bg_path: '',
  logo_path: '',
  max_capacity: 0,
  opening_time: '',
  closing_time: '',
  address: '',
})

const router = useRouter()

// ─── COMPUTED ─────────────────────────────────────────────────────────────────
const backgroundStyle = computed(() => ({
  backgroundImage: `url('${schoolInfo.value.bg_path || '/hero-outside.jpg'}')`,
}))

// ─── FETCH PAGE DATA FROM attendance_page ────────────────────────────────────
const fetchSchoolInfo = async () => {
  const { data, error } = await supabase
    .from('attendance_page')
    .select('element_form')
    .eq('element_name', 'school_info')
    .single()

  if (error) {
    console.error('Error fetching attendance page school_info:', error)
    return
  }

  if (!data?.element_form) return

  try {
    const parsed =
      typeof data.element_form === 'string'
        ? JSON.parse(data.element_form)
        : data.element_form

    schoolInfo.value = {
      ...schoolInfo.value,
      ...parsed,
    }
  } catch (err) {
    console.error('Failed to parse attendance_page.element_form:', err)
  }
}

// ─── FETCH ATTENDANCE WITH STUDENT INFO ──────────────────────────────────────
const fetchLogs = async () => {
  try {
    const logs = await getAttendanceLogs()
    const logsWithStudent = await Promise.all(
      logs.map(async (log: any) => {
        let studentData = null
        try {
          studentData = await getStudentById(log.student_id)
        } catch (e) {
          console.warn("Student not found for ID:", log.student_id)
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
            : null
        }
      })
    )

    attendanceLogs.value = logsWithStudent
  } catch (err) {
    console.error("Failed to fetch attendance logs:", err)
  }
}

let lastScanTime = 0

// ─── HANDLE LOGIN ─────────────────────────────────────────────────────────────
const handleLogin = async (decodedText?: string) => {
  const now = Date.now()

  if (isProcessing.value) return
  if (now - lastScanTime < 3000) return
  lastScanTime = now

  const rawData = decodedText || idInput.value
  if (!rawData.trim()) return

  isProcessing.value = true

  try {
    const studentId = rawData.trim()
    const student = await getStudentById(studentId)

    if (!student) {
      console.warn("Student not found")
      return
    }

    const result = await handleAttendance(studentId)

    if (result?.type === "already_done") {
      alert("You have already timed in and out today.")
    }

    await fetchLogs()

    const audio = new Audio("/beep.mp3")
    audio.play().catch(() => {})

    idInput.value = ""
  } catch (err) {
    console.error("Attendance error:", err)
  } finally {
    setTimeout(() => {
      isProcessing.value = false
    }, 2000)
  }
}

// ─── CAMERA SCANNER ───────────────────────────────────────────────────────────
const startScanner = async () => {
  if (!html5QrCode) return
  isScannerRunning.value = true

  html5QrCode
    .start(
      { facingMode: "environment" },
      { fps: 15, qrbox: { width: 250, height: 250 } },
      (decodedText) => handleLogin(decodedText),
      () => {}
    )
    .catch((err) => {
      console.error("Camera start error:", err)
      isScannerRunning.value = false
    })
}

const stopScanner = async () => {
  if (html5QrCode && isScannerRunning.value) {
    await html5QrCode.stop()
    isScannerRunning.value = false
  }
}

// ─── FETCH EVENTS ─────────────────────────────────────────────────────────────
const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('id, title')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching events:', error)
    return
  }

  events.value = (data || []) as Event[]
}

// ─── ATTENDANCE TYPE HANDLERS ─────────────────────────────────────────────────
const setAttendanceType = async (value: string) => {
  attendanceType.value = value
  await handleAttendanceChange()
}

const handleAttendanceChange = async () => {
  if (attendanceType.value === 'event') {
    await fetchEvents()
    showEventModal.value = true
  }

  if (attendanceType.value === 'visitors') {
    goToVisitors()
  }

  if (attendanceType.value === 'library') {
    goToLibrary()
  }
}

const goToEvent = () => {
  if (!selectedEvent.value) return

  router.push({
    name: 'event',
    query: { id: selectedEvent.value.id }
  })

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

// ─── LIFECYCLE ────────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchSchoolInfo()
  await fetchLogs()

  html5QrCode = new Html5Qrcode("qr-reader")
  timer = setInterval(() => (currentTime.value = new Date()), 1000)

  schoolInfoTimer = setInterval(() => {
    fetchSchoolInfo()
  }, 5000)

  attendancePageChannel = supabase
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
      }
    )
    .subscribe()
})

onUnmounted(() => {
  clearInterval(timer)
  clearInterval(schoolInfoTimer)

  if (html5QrCode?.isScanning) {
    html5QrCode.stop()
  }

  if (attendancePageChannel) {
    supabase.removeChannel(attendancePageChannel)
  }
})

// ─── DATE / TIME ──────────────────────────────────────────────────────────────
const formattedDate = computed(() =>
  currentTime.value.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
)

const formattedTime = computed(() =>
  currentTime.value.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
)
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

/* ── Pill Group ── */
.attendance-pill-group {
  display: flex;
  background: rgba(255, 255, 255, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  padding: 4px;
  gap: 4px;
}

.attendance-pill-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 18px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, transform 0.12s ease;
  white-space: nowrap;
  outline: none;
}

.attendance-pill-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.attendance-pill-btn:active {
  transform: scale(0.97);
}

.attendance-pill-btn.active {
  background: #16a34a;
  color: #ffffff;
  box-shadow: 0 2px 12px rgba(22, 163, 74, 0.4);
}

.pill-icon {
  display: flex;
  align-items: center;
  line-height: 0;
}

/* ── Event Modal ── */
.event-modal {
  width: 480px;
  background: rgba(11, 61, 31, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  animation: modal-pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.event-modal-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.event-modal-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(22, 163, 74, 0.15);
  border: 1px solid rgba(22, 163, 74, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.event-modal-header-text {
  flex: 1;
}

.event-modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 3px;
}

.event-modal-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.event-modal-close {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

.event-modal-close:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
}

.event-modal-body {
  padding: 18px 20px;
}

.event-modal-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  margin-bottom: 10px;
}

.event-modal-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 280px;
  overflow-y: auto;
  scrollbar-width: none;
}

.event-modal-list::-webkit-scrollbar {
  display: none;
}

.event-modal-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.15s;
}

.event-modal-item:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.18);
}

.event-modal-item.active {
  background: rgba(22, 163, 74, 0.18);
  border: 1.5px solid rgba(22, 163, 74, 0.65);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.08);
}

.event-modal-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
  transition: background 0.15s;
}

.event-modal-item.active .event-modal-dot {
  background: #4ade80;
}

.event-modal-name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  transition: color 0.15s;
}

.event-modal-item.active .event-modal-name {
  color: #ffffff;
}

.event-modal-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(22, 163, 74, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s;
}

.event-modal-item.active .event-modal-check {
  opacity: 1;
}

.event-modal-empty {
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.28);
}

.event-modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 14px 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.event-modal-btn-cancel {
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.event-modal-btn-cancel:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.event-modal-btn-proceed {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: #16a34a;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: not-allowed;
  opacity: 0.35;
  transition: all 0.15s;
}

.event-modal-btn-proceed.ready {
  opacity: 1;
  cursor: pointer;
}

.event-modal-btn-proceed.ready:hover {
  background: #15803d;
  box-shadow: 0 2px 12px rgba(22, 163, 74, 0.4);
}

@keyframes modal-pop {
  from { opacity: 0; transform: scale(0.92) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>