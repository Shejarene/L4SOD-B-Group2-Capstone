<template>
  <div>
    <h1 class="page-title">Marks Approval</h1>
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Dropdown v-model="filters.classId" :options="classes" optionLabel="name" optionValue="id" placeholder="Select Class" class="w-full" @change="loadSubjects" />
        <Dropdown v-model="filters.subjectId" :options="subjects" optionLabel="name" optionValue="id" placeholder="Select Subject" class="w-full" />
        <Button label="Load Submitted Marks" icon="pi pi-search" @click="loadSubmittedMarks" />
      </div>
    </div>

    <DataTable v-if="marks.length" :value="marks" :loading="loading" :paginator="true" :rows="20" selectionMode="multiple" v-model:selection="selectedMarks" dataKey="id">
      <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
      <Column header="Student">
        <template #body="{ data }">{{ data.student?.user?.firstName }} {{ data.student?.user?.lastName }}</template>
      </Column>
      <Column field="exam.name" header="Exam"></Column>
      <Column field="subject.name" header="Subject"></Column>
      <Column field="score" header="Score">
        <template #body="{ data }">{{ data.score }} / {{ data.exam?.maxScore }}</template>
      </Column>
      <Column field="grade" header="Grade"></Column>
    </DataTable>

    <div v-if="marks.length" class="flex gap-2 mt-4">
      <Button label="Approve Selected" icon="pi pi-check" class="p-button-success" @click="approveSelected" :loading="processing" />
      <Button label="Reject Selected" icon="pi pi-times" class="p-button-danger" @click="rejectSelected" :loading="processing" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../../utils/api'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const classes = ref([])
const subjects = ref([])
const marks = ref([])
const selectedMarks = ref([])
const loading = ref(false)
const processing = ref(false)
const filters = reactive({ classId: '', subjectId: '' })

const loadSubjects = async () => {
  if (!filters.classId) return
  const { data } = await api.get('/subjects', { params: { classId: filters.classId } })
  if (data.success) subjects.value = data.data
}

const loadSubmittedMarks = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/marks', { params: { classId: filters.classId, subjectId: filters.subjectId, status: 'submitted' } })
    if (data.success) marks.value = data.data
  } catch { /* ignore */ }
  finally { loading.value = false }
}

const approveSelected = async () => {
  if (!selectedMarks.value.length) return
  processing.value = true
  try {
    const ids = selectedMarks.value.map(m => m.id)
    await api.post('/marks/approve', { ids })
    toast.add({ severity: 'success', summary: 'Approved', detail: `${ids.length} marks approved`, life: 3000 })
    marks.value = marks.value.filter(m => !ids.includes(m.id))
    selectedMarks.value = []
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed', life: 3000 })
  } finally { processing.value = false }
}

const rejectSelected = async () => {
  if (!selectedMarks.value.length) return
  processing.value = true
  try {
    const ids = selectedMarks.value.map(m => m.id)
    await api.post('/marks/reject', { ids })
    toast.add({ severity: 'info', summary: 'Rejected', detail: `${ids.length} marks rejected`, life: 3000 })
    marks.value = marks.value.filter(m => !ids.includes(m.id))
    selectedMarks.value = []
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed', life: 3000 })
  } finally { processing.value = false }
}

onMounted(async () => {
  const { data } = await api.get('/classes')
  if (data.success) classes.value = data.data
})
</script>
