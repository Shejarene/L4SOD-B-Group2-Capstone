<template>
  <div>
    <h1 class="page-title">Classrooms</h1>

    <div class="card mb-6">
      <div class="flex gap-4 mb-4">
        <div v-for="lvl in levels" :key="lvl.number">
          <Button
            :label="'Level ' + lvl.number"
            :class="selectedLevel === lvl.number ? 'p-button-primary' : 'p-button-outlined'"
            @click="selectedLevel = lvl.number"
            class="mr-2"
          />
        </div>
      </div>
    </div>

    <div v-if="filteredClassrooms.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="cls in filteredClassrooms" :key="cls.id" class="card hover:shadow-lg transition-shadow cursor-pointer">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ cls.name }}</h3>
            <p class="text-xs text-gray-500">{{ cls.trade?.fullName || cls.trade?.name }}</p>
          </div>
          <Tag :value="'Level ' + cls.level?.number" :severity="cls.level?.number === 3 ? 'info' : cls.level?.number === 4 ? 'success' : 'warning'" />
        </div>
        <div class="flex justify-between text-sm text-gray-500">
          <span><i class="pi pi-user mr-1"></i>{{ cls.students?.length || 0 }} students</span>
          <span v-if="cls.section"><i class="pi pi-tag mr-1"></i>Section {{ cls.section }}</span>
        </div>
      </div>
    </div>
    <div v-else class="card text-center py-12 text-gray-400">
      <i class="pi pi-inbox text-5xl mb-4"></i>
      <p>Select a level to view classrooms</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../utils/axios'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const levels = ref([])
const classrooms = ref([])
const selectedLevel = ref(3)

const filteredClassrooms = computed(() =>
  classrooms.value.filter(c => c.level?.number === selectedLevel.value)
)

onMounted(async () => {
  try {
    const [clsRes, lvlRes] = await Promise.all([
      api.get('/classes'),
      api.get('/school/levels'),
    ])
    if (clsRes.data.success) classrooms.value = clsRes.data.data
    if (lvlRes.data.success) levels.value = lvlRes.data.data
  } catch { /* ignore */ }
})
</script>
