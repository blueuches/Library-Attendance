<template>
  <div class="h-screen w-screen bg-[#0b3d1f] text-white flex flex-col overflow-hidden">

    <!-- HEADER -->
    <div class="text-center pt-8 pb-6">
      <!-- <h1 class="text-5xl font-extrabold tracking-wide">
        CARAGA STATE UNIVERSITY
      </h1> -->

      <h2 class="text-3xl font-bold mt-2">
        H.E.R.O LEARNING COMMONS
      </h2>

      <p class="mt-1 text-lg">
        Ampayon, Butuan City
      </p>

      <div class="mt-5 inline-block bg-[#c7d1be] text-black px-8 py-3 rounded-md text-lg font-bold shadow-md">
        LIBRARY OCCUPANCY AND ATTENDANCE MONITORING SYSTEM
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="flex-1 flex px-10 pb-10 gap-10">

      <!-- LEFT SIDE -->
      <div class="flex-1 bg-[#14532d] rounded-xl p-5 shadow-2xl flex flex-col">

        <div class="flex-1 bg-white rounded-lg overflow-hidden">
          <table class="w-full h-full text-black border-collapse">
            <thead class="bg-gray-200 text-base">
              <tr>
                <th class="border p-3">ID Number</th>
                <th class="border p-3">Name</th>
                <th class="border p-3">Course</th>
                <th class="border p-3">Year</th>
                <th class="border p-3">Log Time</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(student, index) in students"
                :key="index"
                class="text-center text-sm"
              >
                <td class="border p-2">{{ student.id }}</td>
                <td class="border p-2">{{ student.name }}</td>
                <td class="border p-2">{{ student.course }}</td>
                <td class="border p-2">{{ student.year }}</td>
                <td class="border p-2">{{ student.logTime }}</td>
              </tr>

              <!-- Empty rows -->
              <tr v-for="n in 6" :key="'empty-'+n">
                <td class="border p-2">&nbsp;</td>
                <td class="border p-2"></td>
                <td class="border p-2"></td>
                <td class="border p-2"></td>
                <td class="border p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Bottom -->
        <div class="flex justify-between items-center mt-3 text-white">
          <button
            @click="openModal"
            class="bg-gray-200 text-black px-4 py-1 rounded text-sm font-semibold hover:bg-gray-300 transition"
          >
            See more ▼
          </button>

          <div class="font-semibold">
            Total Students: {{ students.length }}
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE -->
      <div class="w-[350px] flex flex-col justify-center items-center gap-6">

        <input
          v-model="idInput"
          type="text"
          placeholder="000-00000"
          class="w-full text-center text-black text-lg py-3 rounded-md shadow-md"
        />

        <button
          @click="handleLogin"
          class="w-full bg-[#1f7a3b] hover:bg-[#14532d] py-3 rounded-md text-lg font-bold shadow-md transition"
        >
          LOGIN
        </button>

        <div class="bg-white text-black px-5 py-3 rounded-md font-bold shadow-md text-center">
          <div>{{ formattedDate }}</div>
          <div>{{ formattedTime }}</div>
        </div>
      </div>

    </div>

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div class="bg-white text-black p-6 rounded-lg w-96">
        <h3 class="text-lg font-bold mb-4">More Attendance Details</h3>

        <button
          @click="showModal = false"
          class="mt-4 bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
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

/* =============================
   MODAL
============================= */
const showModal = ref<boolean>(false)

const openModal = () => {
  showModal.value = true
}
</script>