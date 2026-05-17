<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="page-title">Exam Management</h1>
      <Button label="New Exam" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <div class="card">
      <DataTable :value="exams" :loading="loading" paginator :rows="15"
        :globalFilterFields="['name', 'term', 'academicYear', 'className']" responsiveLayout="scroll">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-xl font-semibold">Exams</span>
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="search" placeholder="Search exams..." />
            </IconField>
          </div>
        </template>

        <Column field="name" header="Exam Name" sortable />
        <Column field="className" header="Target" sortable>
          <template #body="{ data }">
            <span v-if="data.studentName" class="text-sm">
              <Tag value="Student" severity="info" class="mr-1" />
              {{ data.studentName }}
            </span>
            <span v-else-if="data.className" class="text-sm">
              <Tag value="Class" severity="success" class="mr-1" />
              {{ data.className }}
            </span>
            <Tag v-else value="All" severity="warning" />
          </template>
        </Column>
        <Column field="term" header="Term" sortable>
          <template #body="{ data }">
            <Tag :value="`Term ${data.term}`" :severity="termSeverity(data.term)" />
          </template>
        </Column>
        <Column field="academicYear" header="Academic Year" sortable />
        <Column field="maxScore" header="Max Score" sortable />
        <Column field="startDate" header="Start Date" sortable>
          <template #body="{ data }">
            {{ formatDate(data.startDate) }}
          </template>
        </Column>
        <Column field="endDate" header="End Date" sortable>
          <template #body="{ data }">
            {{ formatDate(data.endDate) }}
          </template>
        </Column>
        <Column header="Actions" :exportable="false">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" class="p-button-sm p-button-text" @click="openEditDialog(data)" />
              <Button icon="pi pi-trash" class="p-button-sm p-button-text p-button-danger" @click="deleteExam(data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="showDialog" :header="editingExam ? 'Edit Exam' : 'Create Exam'" :modal="true" :style="{ width: '500px' }">
      <div class="space-y-4 p-2">
        <FormField v-model="form.name" label="Exam Name" placeholder="e.g. Mid-Term Examination" required />

        <div class="grid grid-cols-2 gap-4">
          <FormField v-model.number="form.term" label="Term" type="number" :min="1" :max="3" required />
          <FormField v-model="form.academicYear" label="Academic Year" placeholder="e.g. 2024-2025" />
        </div>

        <div class="p-field">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target</label>
          <SelectButton v-model="form.targetType" :options="targetTypes" optionLabel="label" optionValue="value" />
        </div>

        <div v-if="form.targetType === 'class'" class="p-field">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
          <Dropdown v-model="form.classId" :options="classes" optionLabel="name" optionValue="id"
            placeholder="Select a class" class="w-full" />
        </div>

        <div v-if="form.targetType === 'student'" class="space-y-3">
          <div class="p-field">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Class</label>
            <Dropdown v-model="form.filterClassId" :options="classes" optionLabel="name" optionValue="id"
              placeholder="Select class to filter students" class="w-full" @change="loadStudentsForClass" />
          </div>
          <div class="p-field">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student</label>
            <Dropdown v-model="form.studentId" :options="filteredStudents" optionLabel="displayName" optionValue="id"
              placeholder="Select a student" class="w-full" :disabled="!form.filterClassId" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <FormField v-model="form.startDate" label="Start Date" type="date" />
          <FormField v-model="form.endDate" label="End Date" type="date" />
        </div>
        <FormField v-model.number="form.maxScore" label="Max Score" type="number" :min="1" />
      </div>
      <template #footer>
        <Button label="Cancel" class="p-button-text" @click="showDialog = false" />
        <Button :label="editingExam ? 'Update' : 'Create'" icon="pi pi-check" :loading="saving" @click="saveExam" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../utils/supabase'
import { useAuthStore } from '../../stores/auth'
import FormField from '../../components/FormField.vue'

const authStore = useAuthStore()
const exams = ref([])
const classes = ref([])
const filteredStudents = ref([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const showDialog = ref(false)
const editingExam = ref(null)
const form = ref({
  name: '', term: 1, academicYear: '', maxScore: 100,
  startDate: '', endDate: '', targetType: 'all',
  classId: null, studentId: null, filterClassId: null,
})

const targetTypes = [
  { label: 'All', value: 'all' },
  { label: 'Class', value: 'class' },
  { label: 'Student', value: 'student' },
]

const termSeverity = (term) => {
  const map = { 1: 'info', 2: 'success', 3: 'warning' }
  return map[term] || null
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—'

const loadExams = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('Exams')
      .select('*, Classes(name), Students(admissionNumber, Users(firstName, lastName))')
    if (error) throw error
    exams.value = (data || []).map(e => ({
      ...e,
      className: e.Classes?.name,
      studentName: e.Students ? `${e.Students.Users?.firstName || ''} ${e.Students.Users?.lastName || ''}`.trim() || e.Students.admissionNumber : null,
    }))
  } catch (e) {
    console.error('Failed to load exams:', e)
  } finally {
    loading.value = false
  }
}

const loadClasses = async () => {
  const { data } = await supabase.from('Classes').select('id, name').order('name')
  classes.value = data || []
}

const loadStudentsForClass = async () => {
  if (!form.value.filterClassId) {
    filteredStudents.value = []
    return
  }
  const { data } = await supabase
    .from('Students')
    .select('id, admissionNumber, Users(firstName, lastName)')
    .eq('classId', form.value.filterClassId)
  filteredStudents.value = (data || []).map(s => ({
    ...s,
    displayName: `${s.Users?.firstName || ''} ${s.Users?.lastName || ''}`.trim() || s.admissionNumber,
  }))
}

const openCreateDialog = () => {
  editingExam.value = null
  form.value = {
    name: '', term: 1, academicYear: '', maxScore: 100,
    startDate: '', endDate: '', targetType: 'all',
    classId: null, studentId: null, filterClassId: null,
  }
  showDialog.value = true
}

const openEditDialog = (exam) => {
  editingExam.value = exam
  const targetType = exam.studentId ? 'student' : exam.classId ? 'class' : 'all'
  form.value = {
    ...exam,
    targetType,
    filterClassId: exam.classId,
  }
  if (exam.classId) loadStudentsForClass()
  showDialog.value = true
}

const saveExam = async () => {
  if (!form.value.name) return
  saving.value = true
  try {
    const payload = {
      name: form.value.name,
      term: form.value.term,
      academicYear: form.value.academicYear,
      maxScore: form.value.maxScore,
      startDate: form.value.startDate || null,
      endDate: form.value.endDate || null,
      classId: form.value.targetType === 'class' ? form.value.classId : null,
      studentId: form.value.targetType === 'student' ? form.value.studentId : null,
      createdBy: authStore.user?.id || null,
    }

    if (editingExam.value) {
      const { error } = await supabase.from('Exams').update(payload).eq('id', editingExam.value.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('Exams').insert(payload)
      if (error) throw error
    }
    showDialog.value = false
    await loadExams()
  } catch (e) {
    console.error('Failed to save exam:', e)
  } finally {
    saving.value = false
  }
}

const deleteExam = async (exam) => {
  if (!confirm(`Delete "${exam.name}"?`)) return
  try {
    const { error } = await supabase.from('Exams').delete().eq('id', exam.id)
    if (error) throw error
    await loadExams()
  } catch (e) {
    console.error('Failed to delete exam:', e)
  }
}

onMounted(async () => {
  await Promise.all([loadExams(), loadClasses()])
})
</script>
