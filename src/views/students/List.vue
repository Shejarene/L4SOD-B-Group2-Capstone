<template>
  <div>
    <DataTable ref="dt" :value="students" :loading="loading" :totalRecords="totalRecords" :rows="perPage" @page="onPage">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Students</h2>
          <div class="flex gap-2">
            <Button label="Export" icon="pi pi-download" class="p-button-outlined" @click="exportCSV" />
            <Button label="Add Student" icon="pi pi-plus" @click="showAddDialog = true" v-if="canManage" />
          </div>
        </div>
      </template>
      <Column field="admissionNumber" header="Admission No" sortable></Column>
      <Column header="Name" sortable>
        <template #body="{ data }">
          <router-link :to="`/app/students/${data.id}`" class="text-primary-600 hover:underline font-medium">
            {{ data.user?.firstName }} {{ data.user?.lastName }}
          </router-link>
        </template>
      </Column>
      <Column field="class.name" header="Class" sortable></Column>
      <Column field="section.name" header="Section" sortable></Column>
      <Column field="status" header="Status" sortable>
        <template #body="{ data }">
          <Tag :value="data.status" :severity="data.status === 'active' ? 'success' : 'danger'" />
        </template>
      </Column>
      <Column header="Actions" style="width:100px">
        <template #body="{ data }">
          <Button icon="pi pi-eye" class="p-button-rounded p-button-text" @click="router.push(`/app/students/${data.id}`)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="showAddDialog" header="Add Student" :modal="true" class="w-full md:w-2/3">
      <StudentForm @saved="onStudentSaved" @cancel="showAddDialog = false" />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import api from '../../utils/axios'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
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

const loadStudents = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/students', { params: { page: page.value, perPage: perPage.value } })
    if (data.success) {
      students.value = data.data
      totalRecords.value = data.meta.total
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

const onPage = (event) => {
  page.value = event.page + 1
  perPage.value = event.rows
  loadStudents()
}

const onStudentSaved = () => {
  showAddDialog.value = false
  loadStudents()
}

const exportCSV = () => {
  const csv = [['Admission No','First Name','Last Name','Email','Phone','Class','Status']]
  students.value.forEach(s => {
    csv.push([s.admissionNumber, s.user?.firstName, s.user?.lastName, s.user?.email, s.user?.phone, s.class?.name, s.status])
  })
  const blob = new Blob([csv.map(r => r.join(',')).join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'students.csv'; a.click()
  URL.revokeObjectURL(url)
}

onMounted(loadStudents)
</script>
