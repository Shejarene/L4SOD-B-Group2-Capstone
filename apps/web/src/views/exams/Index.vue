<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="page-title">Exam Management</h1>
      <Button label="New Exam" icon="pi pi-plus" @click="openCreateDialog" />
    </div>

    <div class="card">
      <DataTable :value="exams" :loading="loading" paginator :rows="15"
        :globalFilterFields="['name', 'term', 'academic_year', 'class_name']" responsiveLayout="scroll">
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
        <Column field="class_name" header="Target" sortable>
          <template #body="{ data }">
            <span v-if="data.student_name" class="text-sm">
              <Tag value="Student" severity="info" class="mr-1" />
              {{ data.student_name }}
            </span>
            <span v-else-if="data.class_name" class="text-sm">
              <Tag value="Class" severity="success" class="mr-1" />
              {{ data.class_name }}
            </span>
            <Tag v-else value="All" severity="warning" />
          </template>
        </Column>
        <Column field="term" header="Term" sortable>
          <template #body="{ data }">
            <Tag :value="`Term ${data.term}`" :severity="termSeverity(data.term)" />
          </template>
        </Column>
        <Column field="academic_year" header="Academic Year" sortable />
        <Column field="max_score" header="Max Score" sortable />
        <Column field="start_date" header="Start Date" sortable>
          <template #body="{ data }">
            {{ formatDate(data.start_date) }}
          </template>
        </Column>
        <Column field="end_date" header="End Date" sortable>
          <template #body="{ data }">
            {{ formatDate(data.end_date) }}
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
          <FormField v-model="form.academic_year" label="Academic Year" placeholder="e.g. 2024-2025" />
        </div>

        <div class="p-field">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target</label>
          <SelectButton v-model="form.targetType" :options="targetTypes" optionLabel="label" optionValue="value" />
        </div>

        <div v-if="form.targetType === 'class'" class="p-field">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
          <Dropdown v-model="form.class_id" :options="classes" optionLabel="name" optionValue="id"
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
            <Dropdown v-model="form.student_id" :options="filteredStudents" optionLabel="display_name" optionValue="id"
              placeholder="Select a student" class="w-full" :disabled="!form.filterClassId" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <FormField v-model="form.start_date" label="Start Date" type="date" />
          <FormField v-model="form.end_date" label="End Date" type="date" />
        </div>
        <FormField v-model.number="form.max_score" label="Max Score" type="number" :min="1" />
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
  name: '', term: 1, academic_year: '', max_score: 100,
  start_date: '', end_date: '', targetType: 'all',
  class_id: null, student_id: null, filterClassId: null,
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
      .from('exams')
      .select('*, classes(name), students(admission_number, users(first_name, last_name))')
    if (error) throw error
    exams.value = (data || []).map(e => ({
      ...e,
      class_name: e.classes?.name,
      student_name: e.students ? `${e.students.users?.first_name || ''} ${e.students.users?.last_name || ''}`.trim() || e.students.admission_number : null,
    }))
  } catch (e) {
    console.error('Failed to load exams:', e)
  } finally {
    loading.value = false
  }
}

const loadClasses = async () => {
  const { data } = await supabase.from('classes').select('id, name').order('name')
  classes.value = data || []
}

const loadStudentsForClass = async () => {
  if (!form.value.filterClassId) {
    filteredStudents.value = []
    return
  }
  const { data } = await supabase
    .from('students')
    .select('id, admission_number, users(first_name, last_name)')
    .eq('class_id', form.value.filterClassId)
  filteredStudents.value = (data || []).map(s => ({
    ...s,
    display_name: `${s.users?.first_name || ''} ${s.users?.last_name || ''}`.trim() || s.admission_number,
  }))
}

const openCreateDialog = () => {
  editingExam.value = null
  form.value = {
    name: '', term: 1, academic_year: '', max_score: 100,
    start_date: '', end_date: '', targetType: 'all',
    class_id: null, student_id: null, filterClassId: null,
  }
  showDialog.value = true
}

const openEditDialog = (exam) => {
  editingExam.value = exam
  const targetType = exam.student_id ? 'student' : exam.class_id ? 'class' : 'all'
  form.value = {
    ...exam,
    targetType,
    filterClassId: exam.class_id,
  }
  if (exam.class_id) loadStudentsForClass()
  showDialog.value = true
}

const saveExam = async () => {
  if (!form.value.name) return
  saving.value = true
  try {
    const payload = {
      name: form.value.name,
      term: form.value.term,
      academic_year: form.value.academic_year,
      max_score: form.value.max_score,
      start_date: form.value.start_date || null,
      end_date: form.value.end_date || null,
      class_id: form.value.targetType === 'class' ? form.value.class_id : null,
      student_id: form.value.targetType === 'student' ? form.value.student_id : null,
      created_by: authStore.user?.id || null,
    }

    if (editingExam.value) {
      const { error } = await supabase.from('exams').update(payload).eq('id', editingExam.value.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from('exams').insert(payload)
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
    const { error } = await supabase.from('exams').delete().eq('id', exam.id)
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
