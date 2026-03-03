<template>
  <div class="relative h-screen w-screen text-white flex flex-col">
    
    <div 
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
      style="background-image: url('/hero-outside.jpg');">
    </div>

    <div class="relative z-10 flex flex-col h-full w-full">
      
      <div class="flex items-center justify-center pt-8 pb-6 px-10 relative">
        <div class="absolute left-10">
          <img src="/csu-logo.png" alt="CSU Logo" class="h-50 w-40 object-contain drop-shadow-lg" />
        </div>
        <div class="text-center">
        <h1
          class="text-7xl uppercase leading-none drop-shadow-md
                bg-[linear-gradient(90deg,#FFC300_0%,#ffffff_50%,#1b5e20_100%)]
                bg-clip-text text-transparent"
          style="font-family: Impact, 'Poppins', sans-serif; letter-spacing: -0.01em;"
        >
          CARAGA STATE UNIVERSITY
        </h1>
          <h2
<<<<<<< HEAD
              class="text-3xl uppercase leading-none text-green-100"
              style="font-family: Impact, 'Poppins', sans-serif; letter-spacing: -0.01em;"
            >
              HERO LEARNING COMMONS
            </h2>
            <br>
=======
  class="text-3xl uppercase leading-none text-green-100"
  style="font-family: Impact, 'Poppins', sans-serif; letter-spacing: -0.01em;"
>
  HERO LEARNING COMMONS
</h2>
<br>
>>>>>>> 48266d42b78d023ed7e2e14979142e317cac7c1c
          <div class="mt-5 inline-block bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-3 rounded-md text-lg font-bold shadow-md">
            LIBRARY OCCUPANCY AND ATTENDANCE MONITORING SYSTEM
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-row-reverse px-10 pb-15 gap-10 overflow-hidden">
        
        <div class="w-[350px] flex flex-col justify-center gap-6">
          
        <div class="bg-black/30 border border-white/10 text-white w-full px-5 py-6 rounded-2xl shadow-xl text-center">
            <div class="text-2xl opacity-70 tracking-widest uppercase text-bold">{{ formattedDate }}</div>
            <div class="text-4xl font-mono font-bold text-green-400 mt-1">{{ formattedTime }}</div>
          </div>

          <div class="w-full bg-white/10 p-6 rounded-2xl border border-white/20 shadow-2xl">
            <div class="flex flex-col items-center gap-4">
              <label class="block text-center text-xs font-bold tracking-[0.2em] uppercase text-green-300 opacity-80">
                Scan Student ID
              </label>
              <input
                v-model="idInput"
                type="text"
                placeholder="000-00000"
                class="w-full text-center bg-black/40 text-white text-2xl py-4 rounded-xl border-2 border-green-600 focus:outline-none focus:ring-4 focus:ring-green-400 transition-all"
                @keyup.enter="handleLogin"
              />
              <button
                @click="handleLogin"
                class="w-full bg-green-700 hover:bg-green-600 py-4 rounded-xl text-xl font-bold shadow-xl transition-all active:scale-95"
              >
                LOGIN
              </button>
            </div>
          </div>


        </div>

        <div class="flex-1 flex flex-col min-h-0">
          <div class="flex-1 bg-white/10 rounded-lg overflow-auto border border-white/20 shadow-2xl">
            <table class="w-full text-white border-collapse">
              <thead class="bg-white/20 sticky top-0 z-20">
                <tr>
                  <th class="border border-white/10 p-4 font-bold text-lg uppercase tracking-wider">ID Number</th>
                  <th class="border border-white/10 p-4 font-bold text-lg uppercase tracking-wider">Name</th>
                  <th class="border border-white/10 p-4 font-bold text-lg uppercase tracking-wider">Course</th>
                  <th class="border border-white/10 p-4 font-bold text-lg uppercase tracking-wider">Year</th>
                  <th class="border border-white/10 p-4 font-bold text-lg uppercase tracking-wider">Log Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/10">
                <tr v-for="(student, index) in students" :key="index" class="text-center hover:bg-white/5 transition-colors">
                  <td class="p-3 border border-white/10 font-bold text-lg">{{ student.id }}</td>
                  <td class="p-3 border border-white/10 font-bold text-lg">{{ student.name }}</td>
                  <td class="p-3 border border-white/10 font-bold text-lg">{{ student.course }}</td>
                  <td class="p-3 border border-white/10 font-bold text-lg">{{ student.year }}</td>
<<<<<<< HEAD
                  <td class="p-3 border border-white/10 font-bold text-lg">{{ student.logTime }}</td>
=======
                  <td class="p-3 border border-white/10 font-bold font-bold text-lg">{{ student.logTime }}</td>
>>>>>>> 48266d42b78d023ed7e2e14979142e317cac7c1c
                </tr>
              </tbody>
            </table>
          </div>
          <div class="pt-3 mt-4 flex justify-start">
            <a 
              href="https://carsu-library.vercel.app/" 
              class="group flex items-center gap-3 px-8 py-3
                    bg-white/5 hover:bg-[#1b5e20]
                    border border-white/20
                    rounded-lg text-sm font-black tracking-[0.2em] uppercase
                    transition-all duration-300
                    !text-white hover:!text-white
                    shadow-lg"
            >
              See More Records
              <span class="!text-white transform group-hover:translate-x-2 transition-transform duration-300">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"

import { db } from "@/firebase"

console.log("Firestore instance:", db)

/* =============================
   STUDENT TYPE (Fix TS Error)
============================= */
interface Student {
  id: string
  name: string
  course: string
  year: string
  logTime: string
}

/* =============================
   STUDENTS DATA
============================= */
const students = ref<Student[]>([
  {
    id: "221-00521",
    name: "Juan Dela Cruz",
    course: "BSIT",
    year: "3",
    logTime: "12:30 PM"
  },
  {
    id: "221-00411",
    name: "Maria Santos",
    course: "BSED",
    year: "2",
    logTime: "12:33 PM"
  }
])

/* =============================
   LOGIN
============================= */
const idInput = ref<string>("")

const handleLogin = () => {
  if (!idInput.value.trim()) return

  const now = new Date()

  students.value.unshift({
    id: idInput.value,
    name: "New Student",
    course: "BSCE",
    year: "1",
    logTime: now.toLocaleTimeString()
  })

  idInput.value = ""
}

/* =============================
   DATE & TIME
============================= */
const currentTime = ref<Date>(new Date())
let timer: number

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const formattedDate = computed(() =>
  currentTime.value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
)

const formattedTime = computed(() =>
  currentTime.value.toLocaleTimeString("en-US")
)
</script>