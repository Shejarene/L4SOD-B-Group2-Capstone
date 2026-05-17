<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <div>
        <h1 class="page-title mb-0">Students</h1>
        <p class="page-subtitle">{{ totalRecords }} students in your school</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <Button v-if="canManage" label="Add Student" icon="pi pi-plus" class="btn-primary" @click="showAddDialog = true" />
      </div>
    </div>

    <!-- Filters bar -->
    <div class="card mb-6">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-[#b5b0a8]"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or admission number..."
            class="input-warm pl-11"
            @input="onSearch"
          />
        </div>
        <select v-model="statusFilter" class="input-warm sm:w-40" @change="loadStudents">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button label="Export" icon="pi pi-download" class="btn-secondary" @click="exportCSV" />
      </div>
    </div>

    <!-- Table -->
    <div class="card overflow-hidden">
      <!-- Loading -->
      <div v-if="loading" class="space-y-3 py-4">
        <div v-for="i in 5" :key="i" class="flex gap-4 animate-pulse">
          <div v-for="j in 4" :key="j" class="skeleton-warm h-12 flex-1"></div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="students.length === 0" class="empty-warm">
        <div class="empty-warm-icon">
          <i class="pi pi-users text-3xl text-[#b5b0a8]"></i>
        </div>
        <h3 class="text-lg font-bold text-[#2d2a26] dark:text-[#f5f0ea] mb-2">No students found</h3>
        <p class="text-[#8a857d] max-w-sm mb-4">Try adjusting your search or filters, or add a new student to get started.</p>
        <Button v-if="canManage" label="Add Student" icon="pi pi-plus" class="btn-primary" @click="showAddDialog = true" />
      </div>

      <!-- Data -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left py-3 px-4 text-xs font-bold text-[#8a857d] uppercase tracking-wider">Student</th>
                <th class="text-left py-3 px-4 text-xs font-bold text-[#8a857d] uppercase tracking-wider">Admission No</th>
                <th class="text-left py-3 px-4 text-xs font-bold text-[#8a857d] uppercase tracking-wider">Class</th>
                <th class="text-left py-3 px-4 text-xs font-bold text-[#8a857d] uppercase tracking-wider">Status</th>
                <th class="text-right py-3 px-4 text-xs font-bold text-[#8a857d] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.id" class="border-t border-[#f0ebe5] dark:border-[#3a3632] hover:bg-[#faf8f5] dark:hover:bg-[#2a2826] transition-colors">
                <td class="py-3 px-4">
                  <router-link :to="`/app/students/${student.id}`" class="flex items-center gap-3 group">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e07a5f]/20 to-[#f2cc8f]/20 flex items-center justify-center text-sm font-bold text-[#e07a5f] flex-shrink-0">
                      {{ getInitials(student) }}
                    </div>
                    <span class="text-sm font-semibold text-[#2d2a26] dark:text-[#f5f0ea] group-hover:text-[#e07a5f] transition-colors">
                      {{ getName(student) }}
                    </span>
                  </router-link>
                </td>
                <td class="py-3 px-4">
                  <span class="font-mono text-sm text-[#8a857d]">{{ student.admissionNumber || '—' }}</span>
                </td>
                <td class="py-3 px-4">
                  <span class="text-sm text-[#6b6560] dark:text-[#8a857d]">{{ student.class?.name || '—' }}</span>
                </td>
                <td class="py-3 px-4">
                  <span class="badge-warm" :class="student.status === 'active' ? 'badge-success' : 'badge-danger'">
                    <span class="w-1.5 h-1.5 rounded-full" :class="student.status === 'active' ? 'bg-[#81b29a]' : 'bg-[#e07a5f]'"></span>
                    {{ student.status || 'active' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-right">
                  <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-sm" @click="router.push(`/app/students/${student.id}`)" v-tooltip="'View'" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between py-4 border-t border-[#f0ebe5] dark:border-[#3a3632]">
          <p class="text-sm text-[#8a857d]">
            Showing {{ ((page - 1) * perPage) + 1 }} to {{ Math.min(page * perPage, totalRecords) }} of {{ totalRecords }}
          </p>
          <div class="flex gap-2">
            <Button label="Previous" icon="pi pi-chevron-left" class="btn-secondary" :disabled="page === 1" @click="goToPage(page - 1)" />
            <Button label="Next" icon="pi pi-chevron-right" iconPos="right" class="btn-secondary" :disabled="page * perPage >= totalRecords" @click="goToPage(page + 1)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
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
