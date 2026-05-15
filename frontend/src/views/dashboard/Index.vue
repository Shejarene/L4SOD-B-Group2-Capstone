<template>
  <div>
    <h1 class="page-title">Welcome, {{ authStore.fullName }}</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard label="Total Students" :value="stats.totalStudents" icon="pi-users" bgClass="bg-blue-100 dark:bg-blue-900" iconClass="text-blue-600 dark:text-blue-300" />
      <StatCard label="Total Teachers" :value="stats.totalTeachers" icon="pi-user-plus" bgClass="bg-green-100 dark:bg-green-900" iconClass="text-green-600 dark:text-green-300" />
      <StatCard label="Total Classes" :value="stats.totalClasses" icon="pi-building" bgClass="bg-purple-100 dark:bg-purple-900" iconClass="text-purple-600 dark:text-purple-300" />
      <StatCard label="Active Users" :value="stats.totalUsers" icon="pi-users" bgClass="bg-orange-100 dark:bg-orange-900" iconClass="text-orange-600 dark:text-orange-300" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-3">
          <Button v-for="action in quickActions" :key="action.label" :label="action.label" :icon="action.icon" class="p-button-outlined justify-start" @click="router.push(action.to)" />
        </div>
      </div>
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div class="text-center py-8 text-gray-400">
          <i class="pi pi-clock text-4xl mb-3"></i>
          <p>Activity log coming soon</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../utils/axios'
import StatCard from '../../components/StatCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const stats = ref({
  totalStudents: 0,
  totalTeachers: 0,
  totalClasses: 0,
  totalUsers: 0,
})

const quickActions = [
  { label: 'Add Student', icon: 'pi pi-user-plus', to: '/app/students' },
  { label: 'Enter Marks', icon: 'pi pi-chart-line', to: '/app/marks' },
  { label: 'Take Attendance', icon: 'pi pi-calendar', to: '/app/attendance' },
  { label: 'Record Payment', icon: 'pi pi-dollar', to: '/app/fees/payments' },
  { label: 'Lost & Found', icon: 'pi pi-search', to: '/app/lost-found' },
]

onMounted(async () => {
  try {
    const { data } = await api.get('/dashboard/admin')
    if (data.success) stats.value = data.data
  } catch { /* ignore */ }
})
</script>
