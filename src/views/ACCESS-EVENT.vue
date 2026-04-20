<template>
  <div class="relative min-h-screen w-screen text-white flex flex-col overflow-x-hidden bg-[#0b3d1f]">
    <div class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
      style="background-image: url('/hero-outside.png')"></div>

    <div class="relative z-10 flex flex-col h-full w-full">
      <!-- Header -->
      <!-- <div class="flex items-center justify-center pt-6 pb-3 px-10 shrink-0">
        <div class="absolute left-10">
          <img src="/csu-logo.png" alt="Logo" class="h-32 w-32 object-contain" />
        </div>

        <div class="text-center">
          <h1
            class="text-6xl uppercase leading-none font-black drop-shadow-md bg-[linear-gradient(90deg,#FFC300_0%,#ffffff_50%,#1b5e20_100%)] bg-clip-text text-transparent"
            style="font-family: Impact"
          >
            CARAGA STATE UNIVERSITY
          </h1>

          <h2
            class="pb-4 text-2xl uppercase text-green-100 font-bold"
            style="font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"
          >
            HERO LEARNING COMMONS
          </h2>

          <div
            class="mt-4 inline-block bg-white/10 border border-white/20 px-6 py-2 rounded-md font-semibold text-LG opacity-100"
          >
            ATTENDANCE AND CAPACITY CSU ENTRY SURVEILLANCE SYSTEM (ACCESS)
          </div>
        </div>

      </div> -->

      <div class="flex flex-row-reverse px-6 lg:px-10 pb-6 lg:pb-10 gap-6 lg:gap-8 flex-1 overflow-hidden">
        <!-- Right Column: Date/Time + Attendance Type + Camera -->
        <div class="w-[340px] lg:w-[400px] flex flex-col gap-3 shrink-0">

          <!-- Date & Time -->
          <div class="bg-white/40 border border-white/10 px-6 py-3 rounded-2xl text-center shrink-0">
            <div class="text-xs lg:text-base opacity-70 uppercase font-bold">{{ formattedDate }}</div>
            <div class="text-2xl lg:text-3xl font-mono font-bold text-green-400 mt-1">{{ formattedTime }}</div>
          </div>

          <!-- Attendance Type -->
          <div
            class="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex flex-col items-center gap-2 shrink-0">
            <span class="text-[11px] font-semibold tracking-[0.15em] uppercase text-white/40">Attendance Type</span>
            <div class="attendance-pill-group w-full">
              <button v-for="type in attendanceTypes" :key="type.value" @click="setAttendanceType(type.value)"
                :class="['attendance-pill-btn', attendanceType === type.value ? 'active' : '']">
                <span class="pill-icon" v-html="type.icon"></span>
                {{ type.label }}
              </button>
            </div>
          </div>

          <!-- Camera + Manual Entry -->
          <div class="bg-white/10 border rounded-2xl overflow-hidden flex flex-col shadow-2xl shrink-0">
            <div class="p-3 bg-white/10 flex justify-between items-center px-4 shrink-0">
              <span class="text-xs font-black tracking-widest uppercase">Live Camera Feed</span>
            </div>
            <div id="qr-reader" class="w-full bg-black/20 shrink-0" style="height: clamp(160px, 22vh, 260px);"></div>
            <div class="p-4 bg-black/40 flex flex-col gap-3 shrink-0">
              <input v-model="idInput" type="text" placeholder="Ex. 221-293842" @keyup.enter="() => handleLogin()"
                class="w-full p-2 rounded border border-white/80 text-white bg-transparent text-sm lg:text-base" />
              <button @click="handleLogin()"
                class="w-full py-3 rounded-lg font-bold transition-all bg-green-700 hover:bg-green-600 border border-green-500 shadow-md text-sm lg:text-base">
                ENTER
              </button>
            </div>
          </div>
        </div>


        <!-- Left Column: Attendance Table -->
        <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div
            class="flex-1 bg-white/10 rounded-2xl overflow-y-auto overflow-x-hidden hidden-scroll border border-white/20 shadow-2xl">
            <table class="w-full text-white border-collapse">
              <thead class="sticky top-0 z-20 bg-white/40 backdrop-blur-md">
                <tr class="text-left">
                  <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">ID Number</th>
                  <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Name</th>
                  <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Course</th>
                  <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Year Level</th>
                  <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Time-In</th>

                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="log in attendanceLogs" :key="log.id" class="hover:bg-white/5 transition-colors">
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
    <div v-if="showEventModal" class="fixed inset-0 z-50 flex items-center justify-center"
      style="background: rgba(0, 0, 0, 0.55); backdrop-filter: blur(4px)">
      <div class="event-modal">
        <!-- Header -->
        <div class="event-modal-header">
          <div class="event-modal-icon">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3.5" width="12" height="10" rx="1.5" stroke="#3B6D11" stroke-width="1.3" />
              <path d="M5 2v3M11 2v3M2.5 7.5h11" stroke="#3B6D11" stroke-width="1.3" stroke-linecap="round" />
            </svg>
          </div>
          <div class="event-modal-header-text">
            <div class="event-modal-title">Select event</div>
            <div class="event-modal-subtitle">Choose an event to record attendance for</div>
          </div>
          <button @click="showEventModal = false" class="event-modal-close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <!-- Search -->
        <div class="event-modal-search-wrap">
          <svg class="event-modal-search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4" stroke="#aaa" stroke-width="1.3" />
            <path d="M9.5 9.5l2 2" stroke="#aaa" stroke-width="1.3" stroke-linecap="round" />
          </svg>
          <input v-model="eventSearch" type="text" placeholder="Search events..." class="event-modal-search-input" />
        </div>

        <!-- Body -->
        <div class="event-modal-body">
          <div class="event-modal-section-label">Available events</div>
          <div class="event-modal-list">
            <button v-for="event in filteredEvents" :key="event.id" @click="selectedEvent = event"
              :class="['event-modal-item', selectedEvent?.id === event.id ? 'active' : '']">
              <div class="event-modal-item-icon">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3.5" width="12" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" />
                  <path d="M5 2v3M11 2v3M2.5 7.5h11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
                </svg>
              </div>
              <div class="event-modal-item-text">
                <span class="event-modal-name">{{ event.title }}</span>
                <span v-if="event.date || event.location" class="event-modal-meta">{{
                  [event.date, event.location].filter(Boolean).join(' · ')
                  }}</span>
              </div>
              <div class="event-modal-radio">
                <div class="event-modal-radio-dot"></div>
              </div>
            </button>

            <div v-if="filteredEvents.length === 0" class="event-modal-empty">No events found.</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="event-modal-footer">
          <span class="event-modal-selection-hint">
            {{ selectedEvent ? '1 event selected' : 'No event selected' }}
          </span>
          <div class="event-modal-footer-actions">
            <button @click="showEventModal = false" class="event-modal-btn-cancel">Cancel</button>
            <button @click="goToEvent" :disabled="!selectedEvent"
              :class="['event-modal-btn-proceed', selectedEvent ? 'ready' : '']">
              Proceed to event
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="#fff" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { getAttendanceLogs, createAttendanceLogEvent } from '@/services/attendanceService'
import { getStudentById } from '@/services/studentService'
import { supabase } from '@/supabase'

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

// ─── ATTENDANCE TYPE PILL DATA ─────────────────────────────────────────────────
const attendanceTypes = [
  { value: 'library', label: 'Library', icon: ICON_LIBRARY },
  { value: 'event', label: 'Event', icon: ICON_EVENT },
  { value: 'visitors', label: 'Visitors', icon: ICON_VISITORS },
]

// ─── TYPES ─────────────────────────────────────────────────────────────────────
interface Event {
  id: string
  title: string
  date?: string
  location?: string
}

// ─── STATE ─────────────────────────────────────────────────────────────────────
const idInput = ref('')
const attendanceLogs = ref<any[]>([])
const isScannerRunning = ref(false)
const isProcessing = ref(false)
let html5QrCode: Html5Qrcode | null = null
const currentTime = ref(new Date())
let timer: any

const attendanceType = ref<string>('event')
const showEventModal = ref<boolean>(false)
const events = ref<Event[]>([])
const selectedEvent = ref<Event | null>(null)
const eventSearch = ref<string>('')

const router = useRouter()
const route = useRoute()

watch(
  () => route.query.id,
  async (newId) => {
    if (newId) {
      selectedEvent.value = {
        id: newId as string,
        title: '',
      }

      attendanceLogs.value = [] // 🔥 clear old data immediately
      await fetchLogs() // 🔥 fetch new event logs
    }
  },
)

// ─── FILTERED EVENTS ──────────────────────────────────────────────────────────
const filteredEvents = computed(() => {
  const q = eventSearch.value.toLowerCase().trim()
  if (!q) return events.value
  return events.value.filter((e) => e.title.toLowerCase().includes(q))
})

// ─── FETCH ATTENDANCE WITH STUDENT INFO ───────────────────────────────────────
const fetchLogs = async () => {
  try {
    let query = supabase
      .from('attendance_logs')
      .select(
        `
        *,
        students (
          first_name,
          last_name,
          program,
          year_level
        )
      `,
      )
      .order('time_in', { ascending: false })

    // 🔥 FILTER HERE
    if (attendanceType.value === 'event' && selectedEvent.value) {
      query = query.eq('attendance_type', 'event').eq('event_id', selectedEvent.value.id)
    }

    if (attendanceType.value === 'library') {
      query = query.eq('attendance_type', 'library')
    }

    const { data, error } = await query

    if (error) throw error

    attendanceLogs.value = data || []
  } catch (err) {
    console.error('Failed to fetch attendance logs:', err)
  }
}

// ─── HANDLE LOGIN ──────────────────────────────────────────────────────────────
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

    if (attendanceType.value === 'event' && !selectedEvent.value) {
      console.warn("No event selected")
      return
    }

    await createAttendanceLogEvent({
      student_id: studentId,
      attendance_type: attendanceType.value === 'event' ? 'event' : 'library',
      event_id: attendanceType.value === 'event' ? selectedEvent.value?.id : null
    })
    await fetchLogs()

    const audio = new Audio('/beep.mp3')
    audio.play().catch(() => { })

    idInput.value = ''
  } catch (err) {
    console.error('Attendance error:', err)
  } finally {
    setTimeout(() => {
      isProcessing.value = false
    }, 2000)
  }
}

// ─── CAMERA SCANNER ────────────────────────────────────────────────────────────
const startScanner = async () => {
  if (!html5QrCode) return
  isScannerRunning.value = true
  html5QrCode
    .start(
      { facingMode: 'environment' },
      { fps: 15, qrbox: { width: 250, height: 250 } },
      (decodedText) => handleLogin(decodedText),
      () => { },
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

// ─── FETCH EVENTS ─────────────────────────────────────────────────────────────
const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('id, title, date, location')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching events:', error)
    return
  }

  events.value = data as Event[]
}

// ─── ATTENDANCE TYPE HANDLERS ─────────────────────────────────────────────────
const setAttendanceType = async (value: string) => {
  attendanceType.value = value
  await handleAttendanceChange()
}

const handleAttendanceChange = async () => {
  if (attendanceType.value === 'event') {
    await fetchEvents()
    eventSearch.value = ''
    selectedEvent.value = null
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

// ─── LIFECYCLE ─────────────────────────────────────────────────────────────────
onMounted(() => {
  const eventId = route.query.id as string

  if (eventId) {
    attendanceType.value = 'event' // force correct type
    selectedEvent.value = { id: eventId, title: '' } // minimal object
  }

  fetchLogs()
  html5QrCode = new Html5Qrcode('qr-reader')
  timer = setInterval(() => (currentTime.value = new Date()), 1000)
})

onUnmounted(() => {
  clearInterval(timer)
  if (html5QrCode?.isScanning) html5QrCode.stop()
})

// ─── DATE / TIME ───────────────────────────────────────────────────────────────
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

/* Search */
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

/* Body */
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

/* Event Items */
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
  display: flex;
  flex-direction: column;
  gap: 2px;
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

.event-modal-meta {
  font-size: 11px;
  color: #aaa;
  transition: color 0.15s;
}

.event-modal-item.active .event-modal-meta {
  color: #3b6d11;
}

/* Radio button */
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

/* Footer */
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
