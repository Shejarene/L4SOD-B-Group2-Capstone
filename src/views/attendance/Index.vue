<template>
  <div>
    <h1 class="page-title">Attendance</h1>

    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Dropdown v-model="filters.classId" :options="classes" optionLabel="name" optionValue="id" placeholder="Select Class" class="w-full" @change="loadSections" />
        <Dropdown v-model="filters.sectionId" :options="sections" optionLabel="name" optionValue="id" placeholder="Select Section" class="w-full" />
        <Calendar v-model="filters.date" dateFormat="yy-mm-dd" placeholder="Select Date" class="w-full" />
      </div>
      <Button label="Load" icon="pi pi-search" class="mt-4" @click="loadStudentsForAttendance" />
    </div>

    <div v-if="students.length" class="card">
      <DataTable :value="students" :paginator="false">
        <Column header="Student">
          <template #body="{ data }">{{ data.user?.firstName }} {{ data.user?.lastName }}</template>
        </Column>
        <Column header="Status">
          <template #body="{ data }">
            <SelectButton v-model="attendanceStatus[data.id]" :options="statusOptions" optionLabel="label" optionValue="value" />
          </template>
        </Column>
        <Column header="Remark">
          <template #body="{ data }">
            <InputText v-model="remarks[data.id]" placeholder="Optional" class="w-full" />
          </template>
        </Column>
      </DataTable>
      <div class="flex justify-end mt-4">
        <Button label="Save Attendance" icon="pi pi-save" @click="saveAttendance" :loading="saving" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../utils/axios'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const classes = ref([])
const sections = ref([])
const students = ref([])
const attendanceStatus = reactive({})
const remarks = reactive({})
const loading = ref(false)
const saving = ref(false)

const filters = reactive({ classId: '', sectionId: '', date: new Date().toISOString().split('T')[0] })

const statusOptions = [
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
  { label: 'Excused', value: 'excused' },
]

const loadSections = async () => {
  if (!filters.classId) return
  const cls = classes.value.find(c => c.id === filters.classId)
  sections.value = cls?.sections || []
}

const loadStudentsForAttendance = async () => {
  if (!filters.classId) return
  loading.value = true
  try {
    const { data } = await api.get('/students', { params: { classId: filters.classId, sectionId: filters.sectionId, perPage: 100 } })
    if (data.success) {
      students.value = data.data
      data.data.forEach(s => { attendanceStatus[s.id] = 'present'; remarks[s.id] = '' })
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

const saveAttendance = async () => {
  saving.value = true
  try {
    const entries = students.value.map(s => ({
      studentId: s.id, classId: filters.classId, sectionId: filters.sectionId,
      date: filters.date, status: attendanceStatus[s.id], remark: remarks[s.id],
    }))
    await api.post('/attendance', { entries })
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Attendance recorded', life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Failed', life: 3000 })
  } finally { saving.value = false }
}

onMounted(async () => {
  const { data } = await api.get('/classes')
  if (data.success) classes.value = data.data
})
</script>
