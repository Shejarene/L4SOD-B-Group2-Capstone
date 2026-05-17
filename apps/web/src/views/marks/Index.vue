<template>
  <div>
    <h1 class="page-title">Marks Entry</h1>

    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Dropdown v-model="filters.classId" :options="classes" optionLabel="name" optionValue="id" placeholder="Select Class" class="w-full" @change="loadSubjects" />
        <Dropdown v-model="filters.subjectId" :options="subjects" optionLabel="name" optionValue="id" placeholder="Select Subject" class="w-full" />
        <Dropdown v-model="filters.examId" :options="exams" optionLabel="name" optionValue="id" placeholder="Select Exam" class="w-full" />
        <Button label="Load Students" icon="pi pi-search" @click="loadStudentsForMarks" />
      </div>
    </div>

    <div v-if="students.length" class="card">
      <DataTable :value="students" :loading="loading" :paginator="false">
        <Column header="Admission No">
          <template #body="{ data }">{{ data.admissionNumber }}</template>
        </Column>
        <Column header="Name">
          <template #body="{ data }">{{ data.user?.firstName }} {{ data.user?.lastName }}</template>
        </Column>
        <Column header="Score">
          <template #body="{ data }">
            <InputNumber v-model="scores[data.id]" :min="0" :max="maxScore" class="w-24" />
          </template>
        </Column>
        <Column header="Grade">
          <template #body="{ data }">
            <Tag v-if="scores[data.id] !== null && scores[data.id] !== undefined" :value="getGrade(scores[data.id])" :severity="getGradeSeverity(scores[data.id])" />
          </template>
        </Column>
      </DataTable>
      <div class="flex justify-end mt-4">
        <Button label="Save Marks" icon="pi pi-save" @click="saveMarks" :loading="saving" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../../utils/api'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const classes = ref([])
const subjects = ref([])
const exams = ref([])
const students = ref([])
const scores = reactive({})
const loading = ref(false)
const saving = ref(false)
const maxScore = ref(100)

const filters = reactive({ classId: '', subjectId: '', examId: '' })

const gradingScale = [
  { min: 80, grade: 'A' }, { min: 70, grade: 'B' }, { min: 60, grade: 'C' },
  { min: 50, grade: 'D' }, { min: 40, grade: 'E' }, { min: 0, grade: 'F' },
]

const getGrade = (score) => {
  const g = gradingScale.find(s => score >= s.min)
  return g?.grade || 'F'
}
const getGradeSeverity = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'info'
  if (score >= 50) return 'warning'
  return 'danger'
}

const loadSubjects = async () => {
  if (!filters.classId) return
  const { data } = await api.get('/subjects', { params: { classId: filters.classId } })
  if (data.success) subjects.value = data.data
}

const loadStudentsForMarks = async () => {
  if (!filters.classId || !filters.subjectId || !filters.examId) return
  loading.value = true
  try {
    const { data } = await api.get('/students', { params: { classId: filters.classId, perPage: 100 } })
    if (data.success) {
      students.value = data.data
      data.data.forEach(s => { scores[s.id] = null })
    }
    const examData = await api.get(`/exams/${filters.examId}`)
    if (examData.data.success) maxScore.value = examData.data.data.maxScore
  } catch { /* ignore */ }
  finally { loading.value = false }
}

const saveMarks = async () => {
  saving.value = true
  try {
    const entries = Object.entries(scores)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([studentId, score]) => ({
        studentId, subjectId: filters.subjectId, examId: filters.examId,
        classId: filters.classId, score,
      }))
    await api.post('/marks/batch', { entries })
    toast.add({ severity: 'success', summary: 'Success', detail: 'Marks saved', life: 3000 })
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed', life: 3000 })
  } finally { saving.value = false }
}

onMounted(async () => {
  const [cls, ex] = await Promise.all([
    api.get('/classes'),
    api.get('/exams'),
  ])
  if (cls.data.success) classes.value = cls.data.data
  if (ex.data.success) exams.value = ex.data.data
})
</script>
