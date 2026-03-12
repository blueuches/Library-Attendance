<template>
    <div class="relative h-screen w-screen text-white flex flex-col overflow-hidden bg-[#0b3d1f]">
        <div class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
            style="background-image: url('/hero-outside.jpg');"></div>

        <div class="relative z-10 flex flex-col h-full w-full">
            <div class="flex items-center justify-center pt-8 pb-4 px-10 relative">
                <div class="absolute left-10">
                    <img src="/csu-logo.png" alt="Logo" class="h-32 w-32 object-contain" />
                </div>
                <div class="text-center">
                    <h1 class="text-6xl uppercase leading-none font-black drop-shadow-md bg-[linear-gradient(90deg,#FFC300_0%,#ffffff_50%,#1b5e20_100%)] bg-clip-text text-transparent"
                        style="font-family: Impact;">CARAGA STATE UNIVERSITY</h1>
                    <h2 class="text-2xl uppercase text-green-100 font-bold">HERO LEARNING COMMONS</h2>
                    <div
                        class="mt-4 inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-2 rounded-md font-semibold text-xl">
                        LIBRARY ATTENDANCE MONITORING (ACCESS)</div>
                </div>
            </div>

            <div class="flex-1 flex flex-row-reverse px-10 pb-10 gap-8 overflow-hidden">
                
                <div class="w-[400px] flex flex-col gap-4">
                    <div class="bg-black/40 border border-white/10 p-6 rounded-2xl text-center backdrop-blur-md">
                        <div class="text-xl opacity-70 uppercase font-bold">{{ formattedDate }}</div>
                        <div class="text-4xl font-mono font-bold text-green-400 mt-1">{{ formattedTime }}</div>
                    </div>

                    <div class="flex-1 bg-black/60 rounded-2xl border-2 border-green-600 overflow-hidden relative flex flex-col shadow-2xl">
                        <div class="p-3 bg-green-900/50 flex justify-between items-center px-4">
                            <span class="text-xs font-black tracking-widest uppercase">Live Camera Feed</span>
                            <button 
                                v-if="isScannerRunning" 
                                @click="stopScanner"
                                class="text-[10px] bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-bold transition-all border border-red-400 shadow-lg">
                                STOP CAMERA
                            </button>
                        </div>

                        <div id="qr-reader" class="flex-1 w-full bg-black/20"></div>

                        <div class="p-4 bg-black/40 flex flex-col gap-3">
                            <input v-model="idInput" type="text" placeholder="Manual Entry..."
                                @keyup.enter="(e: KeyboardEvent) => handleLogin()"
                                class="w-full text-center bg-white/5 text-white py-3 rounded-lg border border-white/20 focus:outline-none focus:border-green-400 mb-2" />
                            
                            <button 
                                v-if="!isScannerRunning"
                                @click="startScanner" 
                                class="w-full py-3 rounded-lg font-bold transition-all bg-green-700 hover:bg-green-600 border border-green-500 shadow-md">
                                START CAMERA
                            </button>
                            
                            <div v-else class="w-full py-3 text-center text-green-400 font-bold animate-pulse text-sm tracking-widest">
                                SCANNER IS ACTIVE...
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex-1 flex flex-col min-h-0">
                    <div class="flex-1 bg-white/10 rounded-2xl overflow-auto border border-white/20 backdrop-blur-sm shadow-2xl">
                        <table class="w-full text-white border-collapse">
                            <thead class="bg-green-900/80 sticky top-0 z-20">
                                <tr class="text-left">
                                    <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">ID Number</th>
                                    <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Name</th>
                                    <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Course</th>
                                    <th class="p-4 uppercase text-sm font-black tracking-widest border-b border-white/10">Log Time</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                <tr v-for="log in attendanceLogs" :key="log.id" class="hover:bg-white/5 transition-colors">
                                    <td class="p-4 font-bold text-xl">{{ log.student_id }}</td>
                                    <td class="p-4 font-bold text-xl uppercase">{{ log.full_name }}</td>
                                    <td class="p-4 text-lg opacity-80">{{ log.course }}</td>
                                    <td class="p-4 font-mono text-green-400 font-bold">{{ log.log_time }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import { Html5Qrcode } from "html5-qrcode"
import { supabase } from '@/supabase'

// 1. STATE
const idInput = ref("")
const attendanceLogs = ref<any[]>([])
const isScannerRunning = ref(false)
const isProcessing = ref(false) 
let html5QrCode: Html5Qrcode | null = null

// 2. FETCH DATA FROM SUPABASE
const fetchLogs = async () => {
    const { data, error } = await supabase
        .from('attendance_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

    if (data) {
        attendanceLogs.value = data.map(log => ({
            ...log,
            log_time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }))
    }
    if (error) console.error("Fetch error:", error.message)
}

// 3. HANDLE LOGIN (SCAN OR MANUAL)
const handleLogin = async (decodedText?: string) => {
    if (isProcessing.value) return

    const rawData = typeof decodedText === 'string' ? decodedText : idInput.value
    if (!rawData.trim()) return

    isProcessing.value = true 

    try {
        let studentId = ""
        let fullName = "Unregistered Name"
        let course = "N/A"

        if (rawData.includes('|')) {
            const parts = rawData.split('|')
            const idString = parts[0] || ""
            const idPart = idString.split(':')
            studentId = idPart.length > 1 ? idPart[1]?.trim() ?? "" : idString.trim()

            const nameString = parts[1] || ""
            if (nameString.includes('NAME:')) {
                fullName = nameString.split(':')[1]?.trim() ?? "Unknown Student"
            }

            const progString = parts[3] || ""
            if (progString.includes('PROG:')) {
                course = progString.split(':')[1]?.trim() ?? "BSIT"
            }
        } else {
            studentId = rawData.trim()
        }

        const { error } = await supabase
            .from('attendance_logs')
            .insert([{
                student_id: studentId,
                full_name: fullName,
                course: course
            }])

        if (!error) {
            idInput.value = ""
            fetchLogs() 
            const audio = new Audio('/beep.mp3')
            audio.play().catch(() => console.warn("Audio play blocked"))
        } else {
            console.error("Supabase Error:", error.message)
        }
    } catch (err) {
        console.error("Processing Error:", err)
    } finally {
        setTimeout(() => { isProcessing.value = false }, 3000)
    }
}

// 4. CAMERA SCANNER LOGIC
const startScanner = async () => {
    if (!html5QrCode) return
    
    isScannerRunning.value = true
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 15,
            qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
            handleLogin(decodedText)
        },
        () => { }
    ).catch((err) => {
        console.error("Camera Start Error:", err)
        isScannerRunning.value = false
    })
}

const stopScanner = async () => {
    if (html5QrCode && isScannerRunning.value) {
        await html5QrCode.stop()
        isScannerRunning.value = false
    }
}

// 5. DATE & TIME LOGIC
const currentTime = ref(new Date())
let timer: any

onMounted(() => {
    fetchLogs()
    html5QrCode = new Html5Qrcode("qr-reader")
    timer = setInterval(() => currentTime.value = new Date(), 1000)

    const channel = supabase
        .channel('attendance_logs_realtime')
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'attendance_logs' },
            () => fetchLogs()
        )
        .subscribe()
})

onUnmounted(() => {
    clearInterval(timer)
    if (html5QrCode?.isScanning) html5QrCode.stop()
    supabase.removeAllChannels()
})

const formattedDate = computed(() => currentTime.value.toLocaleDateString("en-US", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}))

const formattedTime = computed(() => currentTime.value.toLocaleTimeString("en-US", {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
}))
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
</style>