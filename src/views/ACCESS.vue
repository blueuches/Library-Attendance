<template>
  <div class="relative h-screen w-screen overflow-hidden bg-[#0b3d1f] text-white">
    <div
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
      :style="backgroundStyle"
    ></div>

    <div class="relative z-10 flex h-full w-full flex-col overflow-hidden">
      <div class="shrink-0 px-3 pt-2 pb-2 sm:px-4 lg:px-8 xl:px-10">
        <div class="relative flex items-center justify-center">
          <div class="absolute left-0 top-1/2 -translate-y-1/2">
            <img
              src="/csu-logo.png"
              alt="Logo"
              class="h-20 w-20 object-contain sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36"
            />
          </div>

          <div class="absolute right-0 top-1/2 -translate-y-1/2">
            <div
              class="flex h-20 w-20 flex-col items-center justify-center rounded-full border border-white/30 bg-white/12 text-center shadow-lg backdrop-blur-md sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 xl:h-36 xl:w-36"
            >
              <div
                class="px-2 text-[7px] font-bold uppercase leading-tight tracking-wider text-white/80 sm:text-[8px] md:text-[9px]"
              >
                Active Users
              </div>
              <div
                class="mt-1 text-xl font-black leading-none text-green-300 sm:text-2xl md:text-3xl lg:text-4xl"
              >
                {{ activeInsideCount }}
              </div>
              <div
                class="mt-1 text-[7px] font-semibold uppercase tracking-wide text-white/60 sm:text-[8px] md:text-[9px]"
              >
                Today
              </div>
            </div>
          </div>

          <div class="px-24 text-center sm:px-28 md:px-32 lg:px-40">
            <h1
              class="bg-[linear-gradient(90deg,#FFC300_0%,#ffffff_50%,#1b5e20_100%)] bg-clip-text text-2xl font-black uppercase leading-none text-transparent drop-shadow-md sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl"
              style="font-family: Impact"
            >
              CARAGA STATE UNIVERSITY
            </h1>

            <h2
              class="mt-1 text-lg font-bold uppercase text-green-100 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
              style="font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"
            >
              HERO LEARNING COMMONS
            </h2>

            <div
              class="mt-2 inline-block rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold sm:text-sm md:text-base lg:px-5 lg:text-xl xl:text-2xl"
            >
              ATTENDANCE AND CAPACITY CSU-LIBRARY ENTRY SYSTEM (ACCES)
            </div>
          </div>
        </div>
      </div>

      <div
        class="grid flex-1 min-h-0 grid-cols-1 gap-3 overflow-hidden px-3 pb-3 sm:px-4 lg:grid-cols-[2.8fr_1.2fr] lg:gap-4 lg:px-8 lg:pb-4 xl:px-10 xl:pb-5"
      >
        <div class="flex min-h-0 flex-col overflow-hidden">
          <div
            class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl"
          >
            <div class="flex shrink-0 items-center justify-between bg-white/10 px-4 py-2.5">
              <span class="text-[10px] font-black uppercase tracking-widest sm:text-xs">
                Orientation Video
              </span>
              <span
                class="text-[9px] font-semibold uppercase tracking-widest text-white/50 sm:text-[10px]"
              >
                CSU Hero Learning Commons
              </span>
            </div>

            <div class="relative min-h-0 flex-1 bg-black/30">
              <video
                class="absolute inset-0 h-full w-full object-cover"
                src="/videos/qr.mp4"
                autoplay
                muted
                loop
                playsinline
                controls
              ></video>
            </div>
          </div>
        </div>

        <div class="flex min-h-0 flex-col gap-1 overflow-hidden">
          <div
            class="w-full shrink-0 rounded-2xl border border-white/10 bg-white/40 px-4 py-2 text-center"
          >
            <div class="text-[10px] font-bold uppercase opacity-70 sm:text-xs lg:text-sm">
              {{ formattedDate }}
            </div>
            <div
              class="mt-0.5 font-mono text-lg font-bold text-green-400 sm:text-xl lg:text-2xl"
            >
              {{ formattedTime }}
            </div>
          </div>

          <div
            class="w-full shrink-0 flex flex-col items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2"
          >
            <span
              class="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40 sm:text-[11px]"
            >
              Attendance Type
            </span>

            <div class="attendance-pill-group w-full">
              <button
                v-for="type in attendanceTypes"
                :key="type.value"
                @click="setAttendanceType(type.value)"
                :class="['attendance-pill-btn', attendanceType === type.value ? 'active' : '']"
              >
                <span class="pill-icon" v-html="type.icon"></span>
                <span class="truncate">{{ type.label }}</span>
              </button>
            </div>
          </div>

          <div
            class="w-full shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl"
          >
            <div class="flex items-center justify-between bg-white/10 px-4 py-2 shrink-0">
              <span class="text-[10px] font-black uppercase tracking-widest sm:text-xs">
                Scan your ID here
              </span>
            </div>

            <div class="px-3 pt-3">
              <div
                id="qr-reader"
                class="mx-auto w-full rounded-xl bg-black/20"
                style="height: clamp(120px, 16vh, 170px)"
              ></div>
            </div>

            <div class="shrink-0 bg-black/40 px-3 pb-3 pt-3">
              <div class="mx-auto flex w-full flex-col gap-2">
                <input
                  ref="scannerInput"
                  v-model="idInput"
                  type="text"
                  placeholder="Scan or type ID..."
                  @input="handleInputChange"
                  @keydown="handleScannerKeydown"
                  @keyup.enter="handleEnter"
                  class="w-full rounded border border-white/80 bg-transparent p-2 text-sm text-white placeholder:text-white/45"
                />
                <button
                  @click="handleLogin()"
                  class="w-full rounded-lg border border-green-500 bg-green-700 py-2.5 text-sm font-bold shadow-md transition-all hover:bg-green-600"
                >
                  ENTER
                </button>
              </div>
            </div>
          </div>

          <div class="flex-1 min-h-0 w-full overflow-hidden">
            <div
              class="hidden-scroll h-full overflow-auto rounded-2xl border border-white/20 bg-white/10 shadow-2xl"
            >
              <table class="w-full border-collapse text-white">
                <thead class="sticky top-0 z-20 bg-white/40 backdrop-blur-md">
                  <tr class="text-left">
                    <th
                      class="whitespace-nowrap border-b border-white/10 p-2 text-[10px] font-black uppercase tracking-widest sm:text-xs"
                    >
                      ID Number
                    </th>
                    <th
                      class="whitespace-nowrap border-b border-white/10 p-2 text-[10px] font-black uppercase tracking-widest sm:text-xs"
                    >
                      Course
                    </th>
                    <th
                      class="whitespace-nowrap border-b border-white/10 p-2 text-[10px] font-black uppercase tracking-widest sm:text-xs"
                    >
                      Year Level
                    </th>
                    <th
                      class="whitespace-nowrap border-b border-white/10 p-2 text-[10px] font-black uppercase tracking-widest sm:text-xs"
                    >
                      Time-In
                    </th>
                    <th
                      class="whitespace-nowrap border-b border-white/10 p-2 text-[10px] font-black uppercase tracking-widest sm:text-xs"
                    >
                      Time-Out
                    </th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-white/5">
                  <tr
                    v-for="log in attendanceLogs"
                    :key="log.id"
                    class="transition-colors hover:bg-white/5"
                  >
                    <td class="whitespace-nowrap p-2 text-sm font-bold sm:text-base">
                      {{ log.student_id }}
                    </td>
                    <td class="whitespace-nowrap p-2 text-xs opacity-80 sm:text-sm">
                      {{ log.students?.program }}
                    </td>
                    <td class="whitespace-nowrap p-2 text-center text-xs opacity-80 sm:text-sm">
                      {{ log.students?.year_level || '—' }}
                    </td>
                    <td class="whitespace-nowrap p-2 font-mono text-xs font-bold opacity-80 sm:text-sm">
                      {{
                        log.time_in
                          ? new Date(log.time_in).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '—'
                      }}
                    </td>
                    <td class="whitespace-nowrap p-2 font-mono text-xs font-bold opacity-80 sm:text-sm">
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

                  <tr v-if="attendanceLogs.length === 0">
                    <td colspan="5" class="p-6 text-center text-sm text-white/70">
                      No attendance records yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

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

            <div v-if="filteredEvents.length === 0" class="event-modal-empty">
              No events found.
            </div>
          </div>
        </div>

        <div class="event-modal-footer">
          <span class="event-modal-selection-hint">
            {{ selectedEvent ? '1 event selected' : 'No event selected' }}
          </span>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getAttendanceLogs, handleAttendance } from '@/services/attendanceService'
import { supabase } from '@/supabase'

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

const ICON_LIBRARY = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M5 8h6M5 5.5h6M5 10.5h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`
const ICON_EVENT = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M8 5v3.5l2 1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const ICON_VISITORS = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="5" r="2" stroke="currentColor" stroke-width="1.3"/><path d="M2 13c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="11.5" cy="5.5" r="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M13.5 13c0-1.66-1.12-3-2.5-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`

const attendanceTypes = [
  { value: 'library', label: 'Library', icon: ICON_LIBRARY },
  { value: 'event', label: 'Event', icon: ICON_EVENT },
  { value: 'visitors', label: 'Visitors', icon: ICON_VISITORS },
]

const beepAudio = new Audio('/beep.mp3')

const idInput = ref('')
const scannerInput = ref<HTMLInputElement | null>(null)
const attendanceLogs = ref<any[]>([])
const activeInsideCount = ref(0)
const isProcessing = ref(false)
const currentTime = ref(new Date())
const attendanceType = ref('library')
const showEventModal = ref(false)
const showAlreadyDoneModal = ref(false)
const events = ref<any[]>([])
const selectedEvent = ref<any | null>(null)
const eventSearch = ref('')
const router = useRouter()

const schoolInfo = ref<any>({
  school_name: '',
  building_title: '',
  system_name: '',
  bg_path: '',
  logo_path: '',
})

const backgroundStyle = computed(() => ({
  backgroundImage: `url('${schoolInfo.value.bg_path || '/hero-outside.png'}')`,
}))

const filteredEvents = computed(() => {
  const q = eventSearch.value.toLowerCase().trim()
  if (!q) return events.value
  return events.value.filter((e) => e.title.toLowerCase().includes(q))
})

const fetchLogs = async () => {
  try {
    const logs = await getAttendanceLogs()
    attendanceLogs.value = (logs || []).sort((a: any, b: any) => {
      const aTime = new Date(a.time_out || a.time_in).getTime()
      const bTime = new Date(b.time_out || b.time_in).getTime()
      return bTime - aTime
    })
  } catch {
    showAlert('Error', 'Failed to load attendance logs.', 'error')
  }
}

const fetchActiveInsideCount = async () => {
  try {
    const now = new Date()

    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)

    const { count, error } = await supabase
      .from('attendance_logs')
      .select('*', { count: 'exact', head: true })
      .eq('attendance_type', 'library')
      .gte('time_in', startOfDay.toISOString())
      .lte('time_in', endOfDay.toISOString())
      .not('time_in', 'is', null)
      .is('time_out', null)

    if (error) {
      console.error('Failed to fetch active inside count:', error)
      return
    }

    activeInsideCount.value = count || 0
  } catch (err) {
    console.error('Failed to fetch active inside count:', err)
  }
}

const refreshAttendanceData = async () => {
  await Promise.all([fetchLogs(), fetchActiveInsideCount()])
}

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

let lastScanTime = 0
let clockInterval: number | undefined

const SCANNER_INTERVAL_MS = 40
let scannerBuffer = ''
let scannerSession = false
let pendingScannerStart = false
let pendingFirstChar = ''
let pendingTimer: ReturnType<typeof setTimeout> | null = null
let lastKeyTime = 0

const normalizeScannedValue = (value: string) => {
  return value.replace(/\r/g, '').replace(/\n/g, '').trim()
}

const clearScannerField = () => {
  idInput.value = ''
}

const focusScannerInput = () => {
  setTimeout(() => scannerInput.value?.focus(), 50)
}

const clearAndRefocusScanner = () => {
  idInput.value = ''
  resetScannerState()
  focusScannerInput()
}

const resetScannerState = () => {
  scannerBuffer = ''
  scannerSession = false
  pendingScannerStart = false
  pendingFirstChar = ''
  lastKeyTime = 0
  if (pendingTimer) {
    clearTimeout(pendingTimer)
    pendingTimer = null
  }
}

const handleInputChange = () => {
  if (isProcessing.value) {
    clearScannerField()
    return
  }

  const cleaned = normalizeScannedValue(idInput.value)
  if (cleaned !== idInput.value) {
    idInput.value = cleaned
  }
}

const commitPendingManualChar = () => {
  if (!pendingFirstChar) return
  idInput.value = normalizeScannedValue(idInput.value + pendingFirstChar)
  pendingFirstChar = ''
  pendingScannerStart = false
  if (pendingTimer) {
    clearTimeout(pendingTimer)
    pendingTimer = null
  }
}

const handleScannerKeydown = (e: KeyboardEvent) => {
  if (isProcessing.value) {
    e.preventDefault()
    return
  }

  const key = e.key

  if (
    key === 'Shift' ||
    key === 'Control' ||
    key === 'Alt' ||
    key === 'Meta' ||
    key === 'CapsLock' ||
    key === 'Tab'
  ) {
    return
  }

  const now = Date.now()
  const diff = lastKeyTime ? now - lastKeyTime : 999
  lastKeyTime = now

  if (key === 'Enter') {
    if (scannerSession && scannerBuffer) {
      e.preventDefault()
      const value = scannerBuffer
      clearScannerField()
      resetScannerState()
      handleLogin(value)
      return
    }

    if (pendingScannerStart) {
      commitPendingManualChar()
    }

    return
  }

  if (key === 'Backspace' || key === 'Delete' || key.startsWith('Arrow')) {
    resetScannerState()
    return
  }

  if (key.length !== 1) return

  if (scannerSession) {
    e.preventDefault()
    scannerBuffer += key
    idInput.value = scannerBuffer
    return
  }

  if (pendingScannerStart) {
    if (diff <= SCANNER_INTERVAL_MS) {
      e.preventDefault()

      if (pendingTimer) {
        clearTimeout(pendingTimer)
        pendingTimer = null
      }

      scannerSession = true
      pendingScannerStart = false
      scannerBuffer = pendingFirstChar + key
      pendingFirstChar = ''
      idInput.value = scannerBuffer
      return
    }

    commitPendingManualChar()
    return
  }

  if (idInput.value && diff > SCANNER_INTERVAL_MS) {
    e.preventDefault()
    pendingScannerStart = true
    pendingFirstChar = key

    if (pendingTimer) clearTimeout(pendingTimer)
    pendingTimer = setTimeout(() => {
      commitPendingManualChar()
    }, SCANNER_INTERVAL_MS + 10)

    return
  }
}

const handleLogin = async (decodedText?: string) => {
  const now = Date.now()

  if (isProcessing.value) {
    clearAndRefocusScanner()
    return
  }

  if (now - lastScanTime < 10000) {
    clearAndRefocusScanner()
    return
  }

  if (pendingScannerStart) {
    commitPendingManualChar()
  }

  const rawData = normalizeScannedValue(decodedText ?? idInput.value)
  if (!rawData) {
    clearAndRefocusScanner()
    return
  }

  lastScanTime = now

  idInput.value = ''
  resetScannerState()
  isProcessing.value = true

  try {
    const result = await handleAttendance(rawData)

    if (result?.type === 'not_found') {
      showAlert('Student Not Found', 'Invalid ID.', 'error')
    } else if (result?.type === 'closed') {
      showAlert('Closed', 'Library is closed.', 'error')
    } else if (result?.type === 'already_done') {
      showAlreadyDoneModal.value = true
    } else {
      beepAudio.play().catch(() => {})
      await refreshAttendanceData()
    }
  } catch (err) {
    console.error(err)
    showAlert('Error', 'Something went wrong.', 'error')
  } finally {
    isProcessing.value = false
    clearAndRefocusScanner()
  }
}

const handleEnter = () => {
  if (scannerSession) return
  handleLogin()
}

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
    second: '2-digit',
    hour12: true,
  }),
)

onMounted(async () => {
  await refreshAttendanceData()
  focusScannerInput()

  clockInterval = window.setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  if (alertTimeout.value) clearTimeout(alertTimeout.value)
  if (clockInterval) clearInterval(clockInterval)
  resetScannerState()
})
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

.attendance-pill-group {
  display: flex;
  background: rgba(255, 255, 255, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  padding: 4px;
  gap: 4px;
  overflow: hidden;
}

.attendance-pill-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  flex: 1;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
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

@media (min-width: 640px) {
  .attendance-pill-btn {
    font-size: 13px;
    padding: 8px 12px;
  }
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
  flex-shrink: 0;
}

.already-done-modal {
  width: 380px;
  max-width: calc(100vw - 24px);
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

.event-modal {
  width: 480px;
  max-width: calc(100vw - 24px);
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