<template>
  <div
    class="relative min-h-screen w-screen text-white flex flex-col overflow-x-hidden bg-[#0b3d1f]"
  >
    <div
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
      :style="backgroundStyle"
    ></div>

    <div class="relative z-10 flex flex-col min-h-screen w-full">
      <!-- Header -->
      <div class="flex items-center justify-center pt-4 pb-2 px-10 shrink-0">
        <div class="absolute left-10">
          <img src="/csu-logo.png" alt="Logo" class="h-20 w-20 lg:h-28 lg:w-28 object-contain" />
        </div>
        <div class="text-center">
          <h1
            class="text-5xl lg:text-7xl uppercase leading-none font-black drop-shadow-md bg-[linear-gradient(90deg,#FFC300_0%,#ffffff_50%,#1b5e20_100%)] bg-clip-text text-transparent"
            style="font-family: Impact"
          >
            CARAGA STATE UNIVERSITY
          </h1>
          <h2
            class="pb-1 text-2xl lg:text-3xl uppercase text-green-100 font-bold"
            style="font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"
          >
            HERO LEARNING COMMONS
          </h2>
          <div
            class="mt-2 inline-block bg-white/10 border border-white/20 px-6 py-1.5 rounded-md font-semibold text-sm lg:text-base opacity-100"
          >
            ATTENDANCE AND CAPACITY CSU-LIBRARY ENTRY SYSTEM (ACCES)
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="flex flex-row-reverse px-6 lg:px-10 pb-4 lg:pb-6 gap-4 lg:gap-5 flex-1 min-h-0">
        <!-- Right Column: Date/Time + Attendance Type + Camera + Featured Video -->
        <div
          class="w-[340px] lg:w-[400px] flex flex-col gap-2 shrink-0 min-h-0 overflow-y-auto hidden-scroll"
        >
          <!-- Date & Time -->
          <div
            class="bg-white/40 border border-white/10 px-6 py-2 rounded-2xl text-center shrink-0"
          >
            <div class="text-xs lg:text-sm opacity-70 uppercase font-bold">{{ formattedDate }}</div>
            <div class="text-xl lg:text-2xl font-mono font-bold text-green-400 mt-0.5">
              {{ formattedTime }}
            </div>
          </div>

          <!-- Attendance Type -->
          <div
            class="bg-white/10 border border-white/20 rounded-2xl px-4 py-2 flex flex-col items-center gap-2 shrink-0"
          >
            <span class="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40"
              >Attendance Type</span
            >
            <div class="attendance-pill-group w-full">
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

          <!-- Camera + Manual Entry -->
          <div
            class="bg-white/10 border rounded-2xl overflow-hidden flex flex-col shadow-2xl shrink-0"
          >
            <div class="p-2 bg-white/10 flex justify-between items-center px-4 shrink-0">
              <span class="text-xs font-black tracking-widest uppercase">Scan your ID here</span>
            </div>
            <div id="qr-reader" class="w-full bg-black/20" style="height: 160px"></div>
            <div class="p-3 bg-black/40 flex flex-col gap-2 shrink-0">
              <input
                ref="scannerInput"
                v-model="idInput"
                type="text"
                placeholder="Scan or type ID..."
                @keyup.enter="handleEnter"
                class="w-full p-2 rounded border border-white/80 text-white bg-transparent text-sm lg:text-base"
              />
              <button
                @click="handleLogin()"
                class="w-full py-2.5 rounded-lg font-bold transition-all bg-green-700 hover:bg-green-600 border border-green-500 shadow-md text-sm lg:text-base"
              >
                ENTER
              </button>
            </div>
          </div>

          <!-- Featured Video Card (MP4) -->
          <div
            class="bg-white/10 border border-white/20 rounded-2xl overflow-hidden shadow-2xl shrink-0"
          >
            <div class="p-2.5 bg-white/10 flex justify-between items-center px-4">
              <span class="text-xs font-black tracking-widest uppercase">Featured Video</span>
              <span class="text-[10px] text-white/50 font-semibold tracking-widest uppercase"
                >CSU Hero Learning Commons</span
              >
            </div>
            <div class="relative w-full" style="padding-top: 56.25%">
              <video
                class="absolute top-0 left-0 w-full h-full object-cover"
                src="/videos/featured.mp4"
                autoplay
                muted
                loop
                playsinline
              ></video>
            </div>
            <div class="px-4 py-2 bg-black/30">
              <div class="text-sm font-bold text-white">CSU Library Orientation 2026</div>
              <div class="text-[11px] text-white/50 mt-0.5">
                Caraga State University · Hero Learning Commons
              </div>
            </div>
          </div>
        </div>

        <!-- Left Column: Table only — fills full height, scrolls internally -->
        <div class="flex-1 min-h-0 overflow-hidden">
          <div
            class="bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-y-auto overflow-x-auto hidden-scroll h-full"
          >
            <table class="w-full text-white border-collapse">
              <thead class="sticky top-0 z-20 bg-white/40 backdrop-blur-md">
                <tr class="text-left">
                  <th
                    class="p-3 lg:p-4 uppercase text-xs lg:text-sm font-black tracking-widest border-b border-white/10 whitespace-nowrap"
                  >
                    ID Number
                  </th>
                  <th
                    class="p-3 lg:p-4 uppercase text-xs lg:text-sm font-black tracking-widest border-b border-white/10 whitespace-nowrap"
                  >
                    Name
                  </th>
                  <th
                    class="p-3 lg:p-4 uppercase text-xs lg:text-sm font-black tracking-widest border-b border-white/10 whitespace-nowrap"
                  >
                    Course
                  </th>
                  <th
                    class="p-3 lg:p-4 uppercase text-xs lg:text-sm font-black tracking-widest border-b border-white/10 whitespace-nowrap"
                  >
                    Year Level
                  </th>
                  <th
                    class="p-3 lg:p-4 uppercase text-xs lg:text-sm font-black tracking-widest border-b border-white/10 whitespace-nowrap"
                  >
                    Time-In
                  </th>
                  <th
                    class="p-3 lg:p-4 uppercase text-xs lg:text-sm font-black tracking-widest border-b border-white/10 whitespace-nowrap"
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
                  <td class="p-3 lg:p-4 font-bold text-base lg:text-xl">{{ log.student_id }}</td>
                  <td class="p-3 lg:p-4 font-bold text-base lg:text-xl uppercase">
                    {{ log.students?.first_name }} {{ log.students?.last_name }}
                  </td>
                  <td class="p-3 lg:p-4 text-sm lg:text-lg opacity-80">
                    {{ log.students?.program }}
                  </td>
                  <td class="p-3 lg:p-4 text-sm lg:text-lg opacity-80">
                    {{ log.students?.year_level || '—' }}
                  </td>
                  <td class="p-3 lg:p-4 font-mono text-sm lg:text-lg opacity-80 font-bold">
                    {{
                      log.time_in
                        ? new Date(log.time_in).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'
                    }}
                  </td>
                  <td class="p-3 lg:p-4 font-mono text-sm lg:text-lg opacity-80 font-bold">
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

  <!-- ── Already Done Modal ── -->
  <Transition name="modal">
    <div
      v-if="showAlreadyDoneModal"
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(4px)"
    >
      <div class="already-done-modal">
        <div class="already-done-icon-wrap">
          <div class="already-done-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#b45309" stroke-width="1.8" />
              <path d="M12 7v5.5" stroke="#b45309" stroke-width="2" stroke-linecap="round" />
              <circle cx="12" cy="16.5" r="1" fill="#b45309" />
            </svg>
          </div>
        </div>
        <div class="already-done-body">
          <div class="already-done-title">Already Completed</div>
          <div class="already-done-subtitle">
            You have already timed in and out today.<br />
            Please come back tomorrow.
          </div>
        </div>
        <div class="already-done-footer">
          <button @click="showAlreadyDoneModal = false" class="already-done-btn">Got it</button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- ── Global Alert Modal ── -->
  <Transition name="modal">
    <div
      v-if="alertModal.show"
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(4px)"
    >
      <div class="already-done-modal">
        <div class="already-done-icon-wrap">
          <div class="already-done-icon">
            <svg v-if="alertModal.type === 'error'" width="28" height="28" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#dc2626" stroke-width="1.8" />
              <path d="M12 7v5.5" stroke="#dc2626" stroke-width="2" stroke-linecap="round" />
              <circle cx="12" cy="16.5" r="1" fill="#dc2626" />
            </svg>
            <svg
              v-else-if="alertModal.type === 'success'"
              width="28"
              height="28"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="#16a34a" stroke-width="1.8" />
              <path
                d="M8 12l3 3 5-6"
                stroke="#16a34a"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
              />
            </svg>
            <svg v-else width="28" height="28" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#b45309" stroke-width="1.8" />
              <path d="M12 7v5.5" stroke="#b45309" stroke-width="2" stroke-linecap="round" />
              <circle cx="12" cy="16.5" r="1" fill="#b45309" />
            </svg>
          </div>
        </div>
        <div class="already-done-body">
          <div class="already-done-title">{{ alertModal.title }}</div>
          <div class="already-done-subtitle">{{ alertModal.message }}</div>
        </div>
        <div class="already-done-footer">
          <button @click="closeAlert" class="already-done-btn">
            {{ alertModal.buttonText || 'OK' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- ── Event Selection Modal ── -->
  <Transition name="modal">
    <div
      v-if="showEventModal"
      class="fixed inset-0 z-50 flex items-center justify-center"
      style="background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(4px)"
    >
      <div class="event-modal">
        <div class="event-modal-header">
          <div class="event-modal-icon">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <rect
                x="2"
                y="3.5"
                width="12"
                height="10"
                rx="1.5"
                stroke="#3B6D11"
                stroke-width="1.3"
              />
              <path
                d="M5 2v3M11 2v3M2.5 7.5h11"
                stroke="#3B6D11"
                stroke-width="1.3"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div class="event-modal-header-text">
            <div class="event-modal-title">Select event</div>
            <div class="event-modal-subtitle">Choose an event to record attendance for</div>
          </div>
          <button @click="showEventModal = false" class="event-modal-close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 2l8 8M10 2L2 10"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
        <div class="event-modal-search-wrap">
          <svg
            class="event-modal-search-icon"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle cx="6" cy="6" r="4" stroke="#aaa" stroke-width="1.3" />
            <path d="M9.5 9.5l2 2" stroke="#aaa" stroke-width="1.3" stroke-linecap="round" />
          </svg>
          <input
            v-model="eventSearch"
            type="text"
            placeholder="Search events..."
            class="event-modal-search-input"
          />
        </div>
        <div class="event-modal-body">
          <div class="event-modal-section-label">Available events</div>
          <div class="event-modal-list">
            <button
              v-for="event in filteredEvents"
              :key="event.id"
              @click="selectedEvent = event"
              :class="['event-modal-item', selectedEvent?.id === event.id ? 'active' : '']"
            >
              <div class="event-modal-item-icon">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="2"
                    y="3.5"
                    width="12"
                    height="10"
                    rx="1.5"
                    stroke="currentColor"
                    stroke-width="1.3"
                  />
                  <path
                    d="M5 2v3M11 2v3M2.5 7.5h11"
                    stroke="currentColor"
                    stroke-width="1.3"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <div class="event-modal-item-text">
                <span class="event-modal-name">{{ event.title }}</span>
              </div>
              <div class="event-modal-radio">
                <div class="event-modal-radio-dot"></div>
              </div>
            </button>
            <div v-if="filteredEvents.length === 0" class="event-modal-empty">No events found.</div>
          </div>
        </div>
        <div class="event-modal-footer">
          <span class="event-modal-selection-hint">{{
            selectedEvent ? '1 event selected' : 'No event selected'
          }}</span>
          <div class="event-modal-footer-actions">
            <button @click="showEventModal = false" class="event-modal-btn-cancel">Cancel</button>
            <button
              @click="goToEvent"
              :disabled="!selectedEvent"
              :class="['event-modal-btn-proceed', selectedEvent ? 'ready' : '']"
            >
              Proceed to event
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M2 6.5h9M8 3.5l3 3-3 3"
                  stroke="#fff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAttendanceLogs, handleAttendance } from '@/services/attendanceService'
import { getStudentById } from '@/services/studentService'
import { supabase } from '@/supabase'

/* =========================
   GLOBAL ALERT MODAL
========================= */
const alertModal = ref({
  show: false,
  title: '',
  message: '',
  type: 'info',
  buttonText: 'OK',
})

const alertTimeout = ref<any>(null)

const showAlert = (
  title: string,
  message: string,
  type: 'info' | 'success' | 'error' = 'info',
  duration: number = 2500,
) => {
  if (alertTimeout.value) clearTimeout(alertTimeout.value)
  alertModal.value = { show: true, title, message, type, buttonText: 'OK' }
  alertTimeout.value = setTimeout(() => {
    closeAlert()
  }, duration)
}

const closeAlert = () => {
  alertModal.value.show = false
  if (alertTimeout.value) {
    clearTimeout(alertTimeout.value)
    alertTimeout.value = null
  }
}

/* =========================
   ICONS
========================= */
const ICON_LIBRARY = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M5 8h6M5 5.5h6M5 10.5h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`
const ICON_EVENT = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M8 5v3.5l2 1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const ICON_VISITORS = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="5" r="2" stroke="currentColor" stroke-width="1.3"/><path d="M2 13c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="11.5" cy="5.5" r="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M13.5 13c0-1.66-1.12-3-2.5-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`

const attendanceTypes = [
  { value: 'library', label: 'Library', icon: ICON_LIBRARY },
  { value: 'event', label: 'Event', icon: ICON_EVENT },
  { value: 'visitors', label: 'Visitors', icon: ICON_VISITORS },
]

/* =========================
   STATE
========================= */
const idInput = ref('')
const scannerInput = ref<HTMLInputElement | null>(null)

const attendanceLogs = ref<any[]>([])
const isProcessing = ref(false)

const currentTime = ref(new Date())
let attendancePageChannel: any = null

const attendanceType = ref('library')
const showEventModal = ref(false)
const showAlreadyDoneModal = ref(false)

const events = ref<any[]>([])
const selectedEvent = ref<any | null>(null)
const eventSearch = ref('')

const schoolInfo = ref<any>({
  school_name: '',
  building_title: '',
  system_name: '',
  bg_path: '',
  logo_path: '',
})

const router = useRouter()

/* =========================
   COMPUTED
========================= */
const backgroundStyle = computed(() => ({
  backgroundImage: `url('${schoolInfo.value.bg_path || '/hero-outside.png'}')`,
}))

const filteredEvents = computed(() => {
  const q = eventSearch.value.toLowerCase().trim()
  if (!q) return events.value
  return events.value.filter((e) => e.title.toLowerCase().includes(q))
})

/* =========================
   FETCH DATA
========================= */
const fetchLogs = async () => {
  try {
    const logs = await getAttendanceLogs()

    const logsWithStudent = await Promise.all(
      logs.map(async (log: any) => {
        let studentData = null
        try {
          studentData = await getStudentById(log.student_id)
        } catch {}
        return { ...log, students: studentData }
      }),
    )

    attendanceLogs.value = logsWithStudent.sort((a, b) => {
      const aTime = new Date(a.time_out || a.time_in).getTime()
      const bTime = new Date(b.time_out || b.time_in).getTime()
      return bTime - aTime
    })
  } catch {
    showAlert('Error', 'Failed to load attendance logs.', 'error')
  }
}

/* =========================
   ATTENDANCE
========================= */
let lastScanTime = 0
const isScannerMode = ref(true)

const handleLogin = async (decodedText?: string) => {
  const now = Date.now()
  if (isProcessing.value) return
  if (now - lastScanTime < 500) return
  lastScanTime = now

  const rawData = (decodedText ?? idInput.value).trim()
  if (!rawData) return

  isProcessing.value = true

  try {
    const result = await handleAttendance(rawData)

    if (result?.type === 'not_found') {
      showAlert('Student Not Found', 'Invalid ID.', 'error')
      idInput.value = ''
      scannerInput.value?.focus()
      return
    }
    if (result?.type === 'closed') {
      showAlert('Closed', 'Library is closed.', 'error')
      return
    }
    if (result?.type === 'already_done') {
      showAlreadyDoneModal.value = true
      return
    }

    await fetchLogs()
    const audio = new Audio('/beep.mp3')
    audio.play().catch(() => {})
    idInput.value = ''
    scannerInput.value?.focus()
  } catch (err) {
    console.error(err)
    showAlert('Error', 'Something went wrong.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const handleEnter = () => {
  if (!idInput.value.trim()) return
  handleLogin()
}

/* =========================
   EVENTS
========================= */
const fetchEvents = async () => {
  const { data } = await supabase.from('events').select('id, title').eq('is_active', true)
  events.value = data || []
}

const setAttendanceType = async (value: string) => {
  attendanceType.value = value
  if (value === 'event') {
    await fetchEvents()
    showEventModal.value = true
  }
  if (value === 'visitors') router.push({ name: 'visitors' })
  if (value === 'library') router.push({ name: 'access' })
}

const goToEvent = () => {
  if (!selectedEvent.value) return
  router.push({ name: 'event', query: { id: selectedEvent.value.id } })
  showEventModal.value = false
}

/* =========================
   LIFECYCLE
========================= */
onMounted(async () => {
  await fetchLogs()
  scannerInput.value?.focus()

  attendancePageChannel = supabase
    .channel('attendance_page_realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'attendance_page' },
      fetchSchoolInfo,
    )
    .subscribe()
})

/* =========================
   DATE/TIME
========================= */
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
  justify-content: center;
  gap: 7px;
  flex: 1;
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.12s ease;
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

/* ── Already Done Modal ── */
.already-done-modal {
  width: 380px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18);
  animation: modal-pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 32px 28px;
}

.already-done-icon-wrap {
  margin-bottom: 18px;
}

.already-done-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fef3c7;
  border: 1.5px solid #fcd34d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.already-done-body {
  text-align: center;
  margin-bottom: 28px;
}

.already-done-title {
  font-size: 18px;
  font-weight: 800;
  color: #111;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}

.already-done-subtitle {
  font-size: 14px;
  color: #888;
  line-height: 1.65;
}

.already-done-footer {
  width: 100%;
}

.already-done-btn {
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  border: none;
  background: #111;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 0.15s,
    box-shadow 0.15s;
  letter-spacing: 0.01em;
}

.already-done-btn:hover {
  background: #333;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
}

/* ── Event Modal ── */
.event-modal {
  width: 480px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18);
  animation: modal-pop 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.event-modal-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid #f0f0f0;
}

.event-modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #eaf3de;
  border: 1px solid #c8e09a;
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
  font-weight: 800;
  color: #111;
  margin-bottom: 3px;
  letter-spacing: -0.01em;
}

.event-modal-subtitle {
  font-size: 12.5px;
  color: #999;
}

.event-modal-close {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  border: 1px solid #e8e8e8;
  background: #f5f5f5;
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s,
    color 0.15s;
}

.event-modal-close:hover {
  background: #ebebeb;
  color: #555;
}

.event-modal-search-wrap {
  position: relative;
  padding: 16px 20px 0;
}

.event-modal-search-icon {
  position: absolute;
  left: 34px;
  top: 26px;
  pointer-events: none;
}

.event-modal-search-input {
  width: 100%;
  padding: 11px 14px 11px 36px;
  font-size: 13.5px;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  background: #f7f7f7;
  color: #111;
  box-sizing: border-box;
  outline: none;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.event-modal-search-input::placeholder {
  color: #c0c0c0;
}

.event-modal-search-input:focus {
  border-color: #3b6d11;
  background: #fff;
}

.event-modal-body {
  padding: 16px 20px 6px;
}

.event-modal-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c0c0c0;
  margin-bottom: 10px;
}

.event-modal-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 240px;
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
  padding: 14px 16px;
  border-radius: 12px;
  border: 1.5px solid #efefef;
  background: #fafafa;
  color: #333;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.15s;
}

.event-modal-item:hover {
  background: #f3f3f3;
  border-color: #e0e0e0;
}

.event-modal-item.active {
  background: #f0f7e6;
  border: 1.5px solid #b8d98a;
  box-shadow: 0 0 0 3px rgba(59, 109, 17, 0.06);
}

.event-modal-item-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: #f0f0f0;
  border: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #bbb;
  transition:
    background 0.15s,
    color 0.15s;
}

.event-modal-item.active .event-modal-item-icon {
  background: #c8e09a;
  border-color: #97c459;
  color: #27500a;
}

.event-modal-item-text {
  flex: 1;
  min-width: 0;
}

.event-modal-name {
  font-size: 14px;
  font-weight: 700;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.01em;
  transition: color 0.15s;
}

.event-modal-item.active .event-modal-name {
  color: #1e4a0a;
}

.event-modal-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #d8d8d8;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.event-modal-item.active .event-modal-radio {
  border-color: #3b6d11;
  background: #fff;
}

.event-modal-radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
  transition: background 0.15s;
}

.event-modal-item.active .event-modal-radio-dot {
  background: #3b6d11;
}

.event-modal-empty {
  padding: 32px 0;
  text-align: center;
  font-size: 13px;
  color: #bbb;
}

.event-modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 16px 20px 22px;
  border-top: 1px solid #f0f0f0;
  margin-top: 10px;
}

.event-modal-selection-hint {
  font-size: 12.5px;
  color: #bbb;
}

.event-modal-footer-actions {
  display: flex;
  gap: 8px;
}

.event-modal-btn-cancel {
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
  background: #f5f5f5;
  color: #555;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.event-modal-btn-cancel:hover {
  background: #ebebeb;
  color: #222;
}

.event-modal-btn-proceed {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: #3b6d11;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: not-allowed;
  opacity: 0.35;
  transition: all 0.15s;
}

.event-modal-btn-proceed.ready {
  opacity: 1;
  cursor: pointer;
}

.event-modal-btn-proceed.ready:hover {
  background: #2d560d;
  box-shadow: 0 3px 14px rgba(59, 109, 17, 0.32);
}

@keyframes modal-pop {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
