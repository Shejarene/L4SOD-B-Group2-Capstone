<template>
  <div v-if="loading" class="flex justify-center py-12">
    <i class="pi pi-spin pi-spinner text-4xl text-primary-600"></i>
  </div>
  <div v-else-if="student">
    <div class="card mb-6">
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          <i class="pi pi-user text-3xl text-primary-600"></i>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ student.user?.firstName }} {{ student.user?.lastName }}</h2>
          <p class="text-gray-500">{{ student.admissionNumber }} · {{ student.class?.name }} {{ student.section?.name }}</p>
          <Tag :value="student.status" :severity="student.status === 'active' ? 'success' : 'danger'" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="card lg:col-span-2">
        <h3 class="text-lg font-semibold mb-4">Personal Information</h3>
        <div class="grid grid-cols-2 gap-4">
          <div><span class="text-gray-500 text-sm">Email</span><p>{{ student.user?.email }}</p></div>
          <div><span class="text-gray-500 text-sm">Phone</span><p>{{ student.user?.phone || '-' }}</p></div>
          <div><span class="text-gray-500 text-sm">Date of Birth</span><p>{{ student.dateOfBirth || '-' }}</p></div>
          <div><span class="text-gray-500 text-sm">Gender</span><p class="capitalize">{{ student.gender || '-' }}</p></div>
          <div><span class="text-gray-500 text-sm">Enrollment Date</span><p>{{ student.enrollmentDate }}</p></div>
        </div>
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Parents / Guardians</h3>
        <div v-if="student.parents?.length" class="space-y-3">
          <div v-for="p in student.parents" :key="p.id" class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <i class="pi pi-user text-xl text-gray-400"></i>
            <div>
              <p class="font-medium">{{ p.user?.firstName }} {{ p.user?.lastName }}</p>
              <p class="text-xs text-gray-500">{{ p.relationship }}</p>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-400 text-sm">No parents linked</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../utils/api'
import Tag from 'primevue/tag'

const route = useRoute()
const student = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get(`/students/${route.params.id}`)
    if (data.success) student.value = data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>
