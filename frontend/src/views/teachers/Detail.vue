<template>
  <div v-if="loading" class="flex justify-center py-12"><i class="pi pi-spin pi-spinner text-4xl text-primary-600"></i></div>
  <div v-else-if="teacher">
    <div class="card mb-6">
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <i class="pi pi-user text-3xl text-green-600"></i>
        </div>
        <div>
          <h2 class="text-2xl font-bold">{{ teacher.user?.firstName }} {{ teacher.user?.lastName }}</h2>
          <p class="text-gray-500">{{ teacher.staffNumber }} · {{ teacher.department?.name }}</p>
          <Tag :value="teacher.employmentStatus" :severity="teacher.employmentStatus === 'active' ? 'success' : 'warning'" />
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="card lg:col-span-2">
        <h3 class="text-lg font-semibold mb-4">Details</h3>
        <div class="grid grid-cols-2 gap-4">
          <div><span class="text-gray-500 text-sm">Email</span><p>{{ teacher.user?.email }}</p></div>
          <div><span class="text-gray-500 text-sm">Phone</span><p>{{ teacher.user?.phone || '-' }}</p></div>
          <div><span class="text-gray-500 text-sm">Qualification</span><p>{{ teacher.qualification || '-' }}</p></div>
          <div><span class="text-gray-500 text-sm">Specialization</span><p>{{ teacher.specialization || '-' }}</p></div>
          <div><span class="text-gray-500 text-sm">Employment Date</span><p>{{ teacher.employmentDate }}</p></div>
          <div><span class="text-gray-500 text-sm">Salary</span><p>{{ teacher.salary ? `$${teacher.salary}` : '-' }}</p></div>
        </div>
      </div>
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Subject Allocations</h3>
        <div v-if="teacher.subjectAllocations?.length" class="space-y-2">
          <div v-for="a in teacher.subjectAllocations" :key="a.id" class="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
            <p class="font-medium">{{ a.subject?.name }}</p>
            <p class="text-gray-500">{{ a.class?.name }} {{ a.section?.name }}</p>
          </div>
        </div>
        <p v-else class="text-gray-400 text-sm">No allocations yet</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../utils/axios'
import Tag from 'primevue/tag'

const route = useRoute()
const teacher = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { data } = await api.get(`/teachers/${route.params.id}`)
    if (data.success) teacher.value = data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
})
</script>
