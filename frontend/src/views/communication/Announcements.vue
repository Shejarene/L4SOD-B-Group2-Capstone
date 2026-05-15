<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Announcements</h1>
      <Button label="New Announcement" icon="pi pi-plus" @click="showDialog = true" />
    </div>

    <div v-for="ann in announcements" :key="ann.id" class="card mb-4">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-semibold">{{ ann.title }}</h3>
          <p class="text-sm text-gray-500">By {{ ann.creator?.firstName }} {{ ann.creator?.lastName }} · {{ new Date(ann.createdAt).toLocaleDateString() }}</p>
        </div>
        <Tag :value="ann.priority" :severity="ann.priority === 'urgent' ? 'danger' : ann.priority === 'high' ? 'warning' : 'info'" />
      </div>
      <p class="mt-3 text-gray-700 dark:text-gray-300">{{ ann.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../utils/axios'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const announcements = ref([])
const showDialog = ref(false)

onMounted(async () => {
  try {
    const { data } = await api.get('/communication/announcements')
    if (data.success) announcements.value = data.data
  } catch { /* ignore */ }
})
</script>
