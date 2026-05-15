<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="page-title mb-0">Timetable</h1>
      <Button v-if="canManage" label="Add Entry" icon="pi pi-plus" @click="openDialog()" />
    </div>

    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Dropdown v-model="filters.classId" :options="classes" optionLabel="name" optionValue="id" placeholder="Select Class" class="w-full" />
        <Dropdown v-model="filters.dayOfWeek" :options="days" optionLabel="label" optionValue="value" placeholder="Select Day" class="w-full" />
        <Button label="Load Timetable" icon="pi pi-search" @click="loadTimetable" :loading="loading" />
        <Button label="Clear" icon="pi pi-filter-slash" class="p-button-outlined" @click="clearFilters" />
      </div>
    </div>

    <div v-if="entries.length" class="card">
      <DataTable :value="entries" :paginator="false" class="p-datatable-sm">
        <Column field="dayOfWeek" header="Day" sortable>
          <template #body="{ data }">{{ dayNames[data.dayOfWeek] }}</template>
        </Column>
        <Column field="startTime" header="Start" sortable></Column>
        <Column field="endTime" header="End" sortable></Column>
        <Column header="Subject">
          <template #body="{ data }">{{ data.subject?.name }}</template>
        </Column>
        <Column header="Teacher">
          <template #body="{ data }">{{ data.teacher?.user?.firstName }} {{ data.teacher?.user?.lastName }}</template>
        </Column>
        <Column field="room" header="Room"></Column>
        <Column v-if="canManage" header="Actions" class="w-24">
          <template #body="{ data }">
            <div class="flex gap-1">
              <Button icon="pi pi-pencil" class="p-button-text p-button-sm p-button-rounded" @click="openDialog(data)" />
              <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-rounded p-button-danger" @click="deleteEntry(data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <div v-else-if="!loading" class="card text-center py-12 text-gray-400">
      <i class="pi pi-calendar-times text-5xl mb-4"></i>
      <p>No timetable entries found for the selected criteria</p>
    </div>

    <!-- Timetable Entry Dialog -->
    <Dialog v-model:visible="showDialog" :header="editMode ? 'Edit Entry' : 'Add Entry'" :modal="true" class="w-full max-w-2xl">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">Class</label>
          <Dropdown v-model="form.classId" :options="classes" optionLabel="name" optionValue="id" class="w-full" @change="loadClassData" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Section (Optional)</label>
          <Dropdown v-model="form.sectionId" :options="sections" optionLabel="name" optionValue="id" class="w-full" placeholder="Select section" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Subject</label>
          <Dropdown v-model="form.subjectId" :options="subjects" optionLabel="name" optionValue="id" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Teacher</label>
          <Dropdown v-model="form.teacherId" :options="teachers" optionLabel="label" optionValue="id" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Day of Week</label>
          <Dropdown v-model="form.dayOfWeek" :options="days" optionLabel="label" optionValue="value" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Room</label>
          <InputText v-model="form.room" class="w-full" placeholder="e.g. Lab 101" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Start Time</label>
          <InputText v-model="form.startTime" class="w-full" type="time" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">End Time</label>
          <InputText v-model="form.endTime" class="w-full" type="time" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium mb-1">Type</label>
          <Dropdown v-model="form.type" :options="['lecture', 'lab', 'tutorial', 'exam', 'other']" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" class="p-button-text" @click="showDialog = false" />
        <Button label="Save Entry" :loading="saving" @click="saveEntry" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../../utils/axios'
import { useAuthStore } from '../../stores/auth'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const authStore = useAuthStore()
const classes = ref([])
const sections = ref([])
const subjects = ref([])
const teachers = ref([])
const entries = ref([])
const loading = ref(false)
const saving = ref(false)
const showDialog = ref(false)
const editMode = ref(false)
const filters = reactive({ classId: '', dayOfWeek: '' })

const canManage = computed(() => ['super_admin', 'admin', 'principal', 'dos'].includes(authStore.user?.role))

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const days = dayNames.map((name, value) => ({ label: name, value })).filter(d => d.value !== 0)

const form = ref({
  classId: '',
  sectionId: '',
  subjectId: '',
  teacherId: '',
  dayOfWeek: 1,
  startTime: '08:00',
  endTime: '09:00',
  room: '',
  type: 'lecture',
  academicYear: new Date().getFullYear().toString(),
  term: 'Term 1'
})

const clearFilters = () => {
  filters.classId = ''
  filters.dayOfWeek = ''
  loadTimetable()
}

const loadTimetable = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/timetable', { params: filters })
    if (data.success) entries.value = data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
}

const loadClassData = async () => {
  if (!form.value.classId) return
  try {
    const { data } = await api.get(`/classes/${form.value.classId}`)
    if (data.success) {
      sections.value = data.data.sections || []
      subjects.value = data.data.subjects || []
    }
  } catch { /* ignore */ }
}

const loadTeachers = async () => {
  try {
    const { data } = await api.get('/teachers')
    if (data.success) {
      teachers.value = data.data.map(t => ({
        id: t.id,
        label: `${t.user?.firstName} ${t.user?.lastName}`
      }))
    }
  } catch { /* ignore */ }
}

const openDialog = (entry = null) => {
  if (entry) {
    form.value = { ...entry }
    editMode.value = true
    loadClassData()
  } else {
    form.value = {
      classId: filters.classId || '',
      sectionId: '',
      subjectId: '',
      teacherId: '',
      dayOfWeek: filters.dayOfWeek || 1,
      startTime: '08:00',
      endTime: '09:00',
      room: '',
      type: 'lecture',
      academicYear: new Date().getFullYear().toString(),
      term: 'Term 1'
    }
    editMode.value = false
  }
  showDialog.value = true
}

const saveEntry = async () => {
  saving.value = true
  try {
    if (editMode.value) {
      await api.put(`/timetable/${form.value.id}`, form.value)
    } else {
      await api.post('/timetable', form.value)
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'Timetable entry saved', life: 3000 })
    showDialog.value = false
    loadTimetable()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Conflict', detail: err.response?.data?.message, life: 5000 })
  } finally { saving.value = false }
}

const deleteEntry = async (id) => {
  if (!confirm('Are you sure you want to delete this entry?')) return
  try {
    await api.delete(`/timetable/${id}`)
    toast.add({ severity: 'success', summary: 'Deleted', life: 3000 })
    loadTimetable()
  } catch { /* ignore */ }
}

onMounted(async () => {
  const { data } = await api.get('/classes')
  if (data.success) classes.value = data.data
  loadTeachers()
  loadTimetable()
})
</script>
