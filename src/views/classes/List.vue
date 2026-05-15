<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Classes</h1>
      <Button label="Add Class" icon="pi pi-plus" @click="showDialog = true" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="cls in classes" :key="cls.id" class="card hover:shadow-md transition-shadow cursor-pointer" @click="expanded = expanded === cls.id ? null : cls.id">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="text-lg font-semibold">{{ cls.name }}</h3>
            <p class="text-sm text-gray-500">{{ cls.code }} · {{ cls.students?.length || 0 }} students</p>
          </div>
          <Tag :value="cls.sections?.length + ' sections'" />
        </div>
        <div v-if="expanded === cls.id" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ cls.description }}</p>
          <div class="space-y-2">
            <div v-for="sec in cls.sections" :key="sec.id" class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span>{{ sec.name }} ({{ sec.code }})</span>
              <span class="text-xs text-gray-500">{{ sec.students?.length || 0 }} students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../utils/axios'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const classes = ref([])
const expanded = ref(null)
const showDialog = ref(false)

onMounted(async () => {
  try {
    const { data } = await api.get('/classes')
    if (data.success) classes.value = data.data
  } catch { /* ignore */ }
})
</script>
