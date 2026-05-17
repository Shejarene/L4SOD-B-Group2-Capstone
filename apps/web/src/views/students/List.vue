<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
      <div>
        <h1 class="page-title mb-0">Students</h1>
        <p class="page-subtitle">{{ totalRecords }} students</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button v-if="canManage" label="Add Student" icon="pi pi-plus" class="btn-primary text-sm h-9" @click="showAddDialog = true" />
      </div>
    </div>

    <div class="card mb-5">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <i class="pi pi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search students..."
            class="input-warm pl-10"
            @input="onSearch"
          />
        </div>
        <select v-model="statusFilter" class="input-warm sm:w-36" @change="loadStudents">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button label="Export" icon="pi pi-download" class="btn-secondary text-sm h-9" @click="exportCSV" />
      </div>
    </div>

    <div class="card overflow-hidden">
      <div v-if="loading" class="space-y-3 py-4">
        <div v-for="i in 5" :key="i" class="flex gap-4 animate-pulse">
          <div v-for="j in 4" :key="j" class="skeleton-warm h-10 flex-1"></div>
        </div>
      </div>

      <div v-else-if="students.length === 0" class="empty-warm">
        <div class="empty-warm-icon">
          <i class="pi pi-users text-2xl text-slate-400"></i>
        </div>
        <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">No students found</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">Try adjusting your search or filters.</p>
        <Button v-if="canManage" label="Add Student" icon="pi pi-plus" class="btn-primary text-sm" @click="showAddDialog = true" />
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Admission No</th>
                <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</th>
                <th class="text-left py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th class="text-right py-2.5 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.id" class="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td class="py-2.5 px-4">
                  <router-link :to="`/app/students/${student.id}`" class="flex items-center gap-2.5 group">
                    <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-400 flex-shrink-0">
                      {{ getInitials(student) }}
                    </div>
                    <span class="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {{ getName(student) }}
                    </span>
                  </router-link>
                </td>
                <td class="py-2.5 px-4">
                  <span class="font-mono text-sm text-slate-500 dark:text-slate-400">{{ student.admissionNumber || '—' }}</span>
                </td>
                <td class="py-2.5 px-4">
                  <span class="text-sm text-slate-600 dark:text-slate-400">{{ student.class?.name || '—' }}</span>
                </td>
                <td class="py-2.5 px-4">
                  <span class="badge-warm" :class="student.status === 'active' ? 'badge-success' : 'badge-danger'">
                    <span class="w-1.5 h-1.5 rounded-full" :class="student.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'"></span>
                    {{ student.status || 'active' }}
                  </span>
                </td>
                <td class="py-2.5 px-4 text-right">
                  <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-sm" @click="router.push(`/app/students/${student.id}`)" v-tooltip="'View'" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-700">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Showing {{ ((page - 1) * perPage) + 1 }} to {{ Math.min(page * perPage, totalRecords) }} of {{ totalRecords }}
          </p>
          <div class="flex gap-2">
            <Button label="Previous" icon="pi pi-chevron-left" class="btn-secondary text-sm h-8" :disabled="page === 1" @click="goToPage(page - 1)" />
            <Button label="Next" icon="pi pi-chevron-right" iconPos="right" class="btn-secondary text-sm h-8" :disabled="page * perPage >= totalRecords" @click="goToPage(page + 1)" />
          </div>
        </div>
      </div>
    </div>

    <Dialog v-model:visible="showAddDialog" :header="editingStudent ? 'Edit Student' : 'Add Student'" :modal="true" class="w-full md:w-2/3 max-h-[90vh] overflow-y-auto">
      <StudentForm :student="editingStudent" @saved="onStudentSaved" @cancel="showAddDialog = false; editingStudent = null" />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../utils/api'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import StudentForm from './Form.vue'

const router = useRouter()
const authStore = useAuthStore()
const canManage = computed(() => ['super_admin', 'admin'].includes(authStore.userRole))

const students = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const page = ref(1)
const perPage = ref(10)
const showAddDialog = ref(false)
const editingStudent = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
let searchTimeout = null

const getInitials = (student) => {
  const name = getName(student)
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getName = (student) => {
  if (student.user) return `${student.user.firstName || ''} ${student.user.lastName || ''}`.trim()
  if (student.Users) return `${student.Users.firstName || ''} ${student.Users.lastName || ''}`.trim()
  return student.name || student.admissionNumber || 'Unknown'
}

const loadStudents = async () => {
  loading.value = true
  try {
    const params = { page: page.value, perPage: perPage.value }
    if (statusFilter.value) params.status = statusFilter.value
    const { data } = await api.get('/students', { params })
    if (data.success) {
      students.value = data.data
      totalRecords.value = data.meta?.total || data.data.length
    }
  } catch (e) {
    console.error('Failed to load students:', e)
  } finally {
    loading.value = false
  }
}

const goToPage = (p) => {
  page.value = p
  loadStudents()
}

const onSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    loadStudents()
  }, 300)
}

const onStudentSaved = () => {
  showAddDialog.value = false
  editingStudent.value = null
  loadStudents()
}

const exportCSV = () => {
  const csv = [['Name', 'Admission No', 'Class', 'Status']]
  students.value.forEach(s => {
    csv.push([getName(s), s.admissionNumber || '', s.class?.name || '', s.status || 'active'])
  })
  const blob = new Blob([csv.map(r => r.join(',')).join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `students_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(loadStudents)
</script>
