<template>
  <div>
    <DataTable :value="students" :loading="loading" :totalRecords="totalRecords" :rows="perPage" @page="onPage">
      <template #header>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Students</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ totalRecords }} students total</p>
          </div>
          <div class="flex flex-wrap gap-2 w-full sm:w-auto">
            <div class="relative flex-1 sm:flex-initial">
              <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search students..."
                class="input-field pl-10 h-10"
                @input="onSearch"
              />
            </div>
            <select v-model="statusFilter" class="input-field h-10 w-full sm:w-auto" @change="loadStudents">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button label="Export" icon="pi pi-download" class="p-button-outlined h-10" @click="exportCSV" />
            <Button v-if="canManage" label="Add Student" icon="pi pi-plus" class="h-10" @click="showAddDialog = true" />
          </div>
        </div>
      </template>

      <Column field="admissionNumber" header="Admission No" sortable style="min-width: 120px">
        <template #body="{ data }">
          <span class="font-mono text-sm text-gray-600 dark:text-gray-400">{{ data.admissionNumber }}</span>
        </template>
      </Column>

      <Column header="Name" sortable style="min-width: 180px">
        <template #body="{ data }">
          <router-link :to="`/app/students/${data.id}`" class="flex items-center gap-3 group">
            <div class="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-xs font-medium text-primary-700 dark:text-primary-400 flex-shrink-0">
              {{ getInitials(data) }}
            </div>
            <span class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ getName(data) }}
            </span>
          </router-link>
        </template>
      </Column>

      <Column field="class.name" header="Class" sortable style="min-width: 100px">
        <template #body="{ data }">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ data.class?.name || '—' }}</span>
        </template>
      </Column>

      <Column field="section.name" header="Section" sortable style="min-width: 80px">
        <template #body="{ data }">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ data.section?.name || '—' }}</span>
        </template>
      </Column>

      <Column field="status" header="Status" sortable style="min-width: 100px">
        <template #body="{ data }">
          <span class="badge" :class="data.status === 'active' ? 'badge-success' : 'badge-danger'">
            <span class="w-1.5 h-1.5 rounded-full" :class="data.status === 'active' ? 'bg-green-500' : 'bg-red-500'"></span>
            {{ data.status || 'active' }}
          </span>
        </template>
      </Column>

      <Column header="Actions" style="min-width: 80px" :exportable="false">
        <template #body="{ data }">
          <div class="flex items-center gap-1">
            <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-sm" @click="router.push(`/app/students/${data.id}`)" v-tooltip="'View'" />
            <Button v-if="canManage" icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm" @click="editStudent(data)" v-tooltip="'Edit'" />
          </div>
        </template>
      </Column>
    </DataTable>

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
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
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

const onPage = (event) => {
  page.value = event.page + 1
  perPage.value = event.rows
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

const editStudent = (student) => {
  editingStudent.value = student
  showAddDialog.value = true
}

const exportCSV = () => {
  const csv = [['Admission No', 'First Name', 'Last Name', 'Email', 'Phone', 'Class', 'Status']]
  students.value.forEach(s => {
    csv.push([
      s.admissionNumber,
      s.user?.firstName || '',
      s.user?.lastName || '',
      s.user?.email || '',
      s.user?.phone || '',
      s.class?.name || '',
      s.status || 'active'
    ])
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
