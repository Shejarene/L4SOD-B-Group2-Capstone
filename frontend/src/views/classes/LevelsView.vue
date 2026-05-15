<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Levels & Trades</h1>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="level in levels" :key="level.id" class="card text-center hover:shadow-lg transition-shadow">
        <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
          <span class="text-2xl font-bold text-primary-600">{{ level.number }}</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ level.name }}</h3>
        <p class="text-sm text-gray-500">{{ level.description }}</p>
        <div class="mt-4 flex flex-wrap gap-2 justify-center">
          <Tag v-for="trade in trades" :key="trade.code" :value="trade.code" :class="level.number === 3 ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : level.number === 4 ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'" />
        </div>
      </div>
    </div>

    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Trades</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="trade in trades" :key="trade.code" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              :class="trade.code === 'SOD' ? 'bg-blue-600' : trade.code === 'NIT' ? 'bg-green-600' : 'bg-purple-600'">
              {{ trade.code }}
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 dark:text-white">{{ trade.name }}</h4>
              <p class="text-xs text-gray-500">{{ trade.fullName }}</p>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">{{ trade.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../utils/axios'
import Tag from 'primevue/tag'

const levels = ref([])
const trades = ref([])

onMounted(async () => {
  try {
    const [lvlRes, trdRes] = await Promise.all([
      api.get('/school/levels'),
      api.get('/school/trades'),
    ])
    if (lvlRes.data.success) levels.value = lvlRes.data.data
    if (trdRes.data.success) trades.value = trdRes.data.data
  } catch { /* ignore */ }
})
</script>
