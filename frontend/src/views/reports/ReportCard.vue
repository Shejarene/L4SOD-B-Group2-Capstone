<template>
  <div>
    <h1 class="page-title">Report Card</h1>

    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Dropdown v-model="selectedClass" :options="classes" optionLabel="name" optionValue="id" placeholder="Select Class" class="w-full" @change="loadStudents" />
        <Dropdown v-model="selectedStudent" :options="students" optionLabel="label" optionValue="id" placeholder="Select Student" class="w-full" :disabled="!students.length" />
        <Button label="Load Report" icon="pi pi-search" @click="loadReport" :disabled="!selectedStudent" />
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <i class="pi pi-spin pi-spinner text-4xl text-primary-600"></i>
    </div>

    <div v-else-if="reportData" class="space-y-6">
      <div class="card">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <i class="pi pi-user text-3xl text-primary-600"></i>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ reportData.student.user?.firstName }} {{ reportData.student.user?.lastName }}</h2>
            <p class="text-gray-500">{{ reportData.student.admissionNumber }} · {{ reportData.student.class?.name }}</p>
            <Tag :value="reportData.student.status" :severity="reportData.student.status === 'active' ? 'success' : 'danger'" />
          </div>
        </div>
      </div>

      <div class="card">
        <DataTable :value="reportData.marks" :paginator="false">
          <Column header="Subject">
            <template #body="{ data }">{{ data.subject?.name || '-' }}</template>
          </Column>
          <Column field="score" header="Score" sortable>
            <template #body="{ data }">{{ parseFloat(data.score).toFixed(2) }}</template>
          </Column>
          <Column field="grade" header="Grade" sortable>
            <template #body="{ data }">
              <Tag :value="data.grade" :severity="getGradeSeverity(data.grade)" />
            </template>
          </Column>
          <Column header="Exam">
            <template #body="{ data }">{{ data.exam?.name || '-' }}</template>
          </Column>
          <Column field="remark" header="Remark" />
        </DataTable>
      </div>

      <div class="flex gap-3 justify-end">
        <Button label="Download PDF" icon="pi pi-file-pdf" @click="downloadPdf" />
        <Button label="Email Report Card" icon="pi pi-envelope" @click="emailReport" :loading="emailing" v-if="canEmail" />
      </div>
    </div>

    <div v-else-if="!loading" class="card text-center py-12 text-gray-400">
      <i class="pi pi-file-pdf text-4xl mb-3"></i>
      <p>Select a student and click "Load Report" to view their report card</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '../../utils/axios'
import { useAuthStore } from '../../stores/auth'
import { useToast } from 'primevue/usetoast'
import DataTable from '../../components/DataTable.vue'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const toast = useToast()
const authStore = useAuthStore()
const canEmail = computed(() => ['super_admin', 'admin', 'dos'].includes(authStore.userRole))

const classes = ref([])
const students = ref([])
const selectedClass = ref('')
const selectedStudent = ref('')
const reportData = ref(null)
const loading = ref(false)
const emailing = ref(false)

const loadStudents = async () => {
  if (!selectedClass.value) { students.value = []; return }
  const { data } = await api.get('/students', { params: { classId: selectedClass.value, perPage: 500 } })
  if (data.success) {
    students.value = data.data.map(s => ({
      id: s.id,
      label: `${s.user?.firstName} ${s.user?.lastName} (${s.admissionNumber})`,
    }))
  }
}

const loadReport = async () => {
  if (!selectedStudent.value) return
  loading.value = true
  try {
    const { data } = await api.get(`/reports/report-card/${selectedStudent.value}`)
    if (data.success) reportData.value = data.data
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Failed to load report', life: 3000 })
  } finally { loading.value = false }
}

const getGradeSeverity = (grade) => {
  if (!grade) return 'info'
  if (['A', 'B'].includes(grade)) return 'success'
  if (['C', 'D'].includes(grade)) return 'warning'
  return 'danger'
}

const downloadPdf = () => {
  if (!reportData.value) return
  const { student, marks } = reportData.value
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  doc.setFontSize(20)
  doc.text('REPORT CARD', pageWidth / 2, 25, { align: 'center' })
  doc.setFontSize(12)
  doc.text('Acadex', pageWidth / 2, 33, { align: 'center' })

  let y = 45
  doc.setFontSize(11)
  doc.setFont('Helvetica', 'bold')
  doc.text('Student Name:', 14, y)
  doc.setFont('Helvetica', 'normal')
  doc.text(`${student.user?.firstName} ${student.user?.lastName}`, 60, y)
  y += 8
  doc.setFont('Helvetica', 'bold')
  doc.text('Admission No:', 14, y)
  doc.setFont('Helvetica', 'normal')
  doc.text(student.admissionNumber, 60, y)
  y += 8
  doc.setFont('Helvetica', 'bold')
  doc.text('Class:', 14, y)
  doc.setFont('Helvetica', 'normal')
  doc.text(student.class?.name || '-', 60, y)
  y += 15

  const tableData = marks.filter(m => m.status === 'approved').map(m => [
    m.subject?.name || '-',
    parseFloat(m.score).toFixed(2),
    m.grade || '-',
    m.exam?.name || '-',
    m.remark || '-',
  ])

  if (tableData.length) {
    doc.autoTable({
      startY: y,
      head: [['Subject', 'Score', 'Grade', 'Exam', 'Remark']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    })
    y = doc.lastAutoTable.finalY + 15

    const totalScore = marks.reduce((sum, m) => sum + parseFloat(m.score || 0), 0)
    const avg = (totalScore / marks.length).toFixed(2)
    doc.setFont('Helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`Average Score: ${avg}`, 14, y)
    y += 8
    doc.text(`Total Subjects: ${marks.length}`, 14, y)
  }

  doc.save(`report-card-${student.admissionNumber}.pdf`)
}

const emailReport = async () => {
  if (!selectedStudent.value) return
  emailing.value = true
  try {
    const { data } = await api.post(`/reports/report-card/${selectedStudent.value}/email`)
    if (data.success) {
      toast.add({ severity: 'success', summary: 'Sent', detail: 'Report card emailed successfully', life: 3000 })
    }
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Failed to email', life: 3000 })
  } finally { emailing.value = false }
}

onMounted(async () => {
  const { data } = await api.get('/classes')
  if (data.success) classes.value = data.data
})
</script>
