<template>
  <div>
    <h1 class="page-title mb-6">Attendance Analytics</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="card">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Attendance</h3>
          <i class="pi pi-chart-line text-gray-400"></i>
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ overallRate }}%</p>
        <p class="text-sm text-gray-500 mt-1">Last 30 days</p>
      </div>
      <div class="card">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Present Today</h3>
          <i class="pi pi-check-circle text-green-500"></i>
        </div>
        <p class="text-3xl font-bold text-green-600">{{ todayStats.present }}</p>
        <p class="text-sm text-gray-500 mt-1">of {{ todayStats.total }} recorded</p>
      </div>
      <div class="card">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Absent Today</h3>
          <i class="pi pi-times-circle text-red-500"></i>
        </div>
        <p class="text-3xl font-bold text-red-600">{{ todayStats.absent }}</p>
        <p class="text-sm text-gray-500 mt-1">of {{ todayStats.total }} recorded</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Trend (Last 30 Days)</h2>
        <div style="height: 300px">
          <Line :data="trendChartData" :options="chartOptions" />
        </div>
      </div>
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h2>
        <div style="height: 300px">
          <Doughnut :data="doughnutData" :options="doughnutOptions" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">By Class</h2>
        <div style="height: 300px">
          <Bar :data="classBarData" :options="chartOptions" />
        </div>
      </div>
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Low Attendance Students</h2>
        <DataTable :value="lowAttendanceStudents" :loading="loading" paginator :rows="10" responsiveLayout="scroll">
          <Column field="name" header="Student" sortable />
          <Column field="class_name" header="Class" sortable />
          <Column field="attendance_rate" header="Rate" sortable>
            <template #body="{ data }">
              <Tag :value="`${data.attendance_rate}%`" :severity="data.attendance_rate < 75 ? 'danger' : data.attendance_rate < 85 ? 'warning' : 'success'" />
            </template>
          </Column>
          <Column field="days_present" header="Present" />
          <Column field="days_absent" header="Absent" />
        </DataTable>
      </div>
    </div>

    <div class="card">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter & Analyze</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
          <Dropdown v-model="filters.classId" :options="classes" optionLabel="name" optionValue="id"
            placeholder="All Classes" class="w-full" @change="applyFilters" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date From</label>
          <InputText v-model="filters.dateFrom" type="date" class="w-full" @change="applyFilters" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date To</label>
          <InputText v-model="filters.dateTo" type="date" class="w-full" @change="applyFilters" />
        </div>
        <div class="flex items-end">
          <Button label="Apply Filters" icon="pi pi-filter" class="w-full" @click="applyFilters" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../../utils/supabase'
import { Line, Doughnut, Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, BarElement, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, BarElement, ArcElement)

const classes = ref([])
const attendance = ref([])
const loading = ref(false)
const filters = ref({ classId: null, dateFrom: '', dateTo: '' })

const today = new Date().toISOString().split('T')[0]
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const filteredAttendance = computed(() => {
  let data = attendance.value
  if (filters.value.classId) {
    data = data.filter(a => a.class_id === filters.value.classId)
  }
  if (filters.value.dateFrom) {
    data = data.filter(a => a.date >= filters.value.dateFrom)
  }
  if (filters.value.dateTo) {
    data = data.filter(a => a.date <= filters.value.dateTo)
  }
  return data
})

const overallRate = computed(() => {
  if (!filteredAttendance.value.length) return 0
  const present = filteredAttendance.value.filter(a => a.status === 'present').length
  return Math.round((present / filteredAttendance.value.length) * 100)
})

const todayStats = computed(() => {
  const todayRecords = attendance.value.filter(a => a.date === today)
  return {
    present: todayRecords.filter(a => a.status === 'present').length,
    absent: todayRecords.filter(a => a.status === 'absent').length,
    late: todayRecords.filter(a => a.status === 'late').length,
    total: todayRecords.length,
  }
})

const trendChartData = computed(() => {
  const dateMap = {}
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split('T')[0]
    dateMap[key] = { present: 0, total: 0 }
  }
  filteredAttendance.value.forEach(a => {
    if (dateMap[a.date]) {
      dateMap[a.date].total++
      if (a.status === 'present' || a.status === 'late') dateMap[a.date].present++
    }
  })
  const labels = Object.keys(dateMap).map(d => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' }))
  const rates = Object.values(dateMap).map(d => d.total ? Math.round((d.present / d.total) * 100) : 0)
  return {
    labels,
    datasets: [{
      label: 'Attendance Rate %',
      data: rates,
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  }
})

const doughnutData = computed(() => {
  const present = filteredAttendance.value.filter(a => a.status === 'present').length
  const absent = filteredAttendance.value.filter(a => a.status === 'absent').length
  const late = filteredAttendance.value.filter(a => a.status === 'late').length
  const excused = filteredAttendance.value.filter(a => a.status === 'excused').length
  return {
    labels: ['Present', 'Absent', 'Late', 'Excused'],
    datasets: [{
      data: [present, absent, late, excused],
      backgroundColor: ['#10B981', '#EF4444', '#F59E0B', '#6B7280'],
    }],
  }
})

const classBarData = computed(() => {
  const classMap = {}
  filteredAttendance.value.forEach(a => {
    if (!classMap[a.class_id]) classMap[a.class_id] = { present: 0, total: 0, name: a.class_name || 'Unknown' }
    classMap[a.class_id].total++
    if (a.status === 'present' || a.status === 'late') classMap[a.class_id].present++
  })
  const names = Object.values(classMap).map(c => c.name)
  const rates = Object.values(classMap).map(c => c.total ? Math.round((c.present / c.total) * 100) : 0)
  return {
    labels: names,
    datasets: [{
      label: 'Attendance Rate %',
      data: rates,
      backgroundColor: '#3B82F6',
    }],
  }
})

const lowAttendanceStudents = computed(() => {
  const studentMap = {}
  filteredAttendance.value.forEach(a => {
    if (!studentMap[a.student_id]) {
      studentMap[a.student_id] = { name: a.student_name || 'Unknown', class_name: a.class_name || '', present: 0, total: 0 }
    }
    studentMap[a.student_id].total++
    if (a.status === 'present' || a.status === 'late') studentMap[a.student_id].present++
  })
  return Object.values(studentMap)
    .map(s => ({
      ...s,
      days_present: s.present,
      days_absent: s.total - s.present,
      attendance_rate: s.total ? Math.round((s.present / s.total) * 100) : 0,
    }))
    .filter(s => s.attendance_rate < 85)
    .sort((a, b) => a.attendance_rate - b.attendance_rate)
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { beginAtZero: true, max: 100 } },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

const loadClasses = async () => {
  const { data } = await supabase.from('classes').select('id, name').order('name')
  classes.value = data || []
}

const loadAttendance = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*, classes(name), students(admission_number, users(first_name, last_name))')
      .gte('date', thirtyDaysAgo)
      .order('date', { ascending: false })
    if (error) throw error
    attendance.value = (data || []).map(a => ({
      ...a,
      class_name: a.classes?.name,
      student_name: a.students ? `${a.students.users?.first_name || ''} ${a.students.users?.last_name || ''}`.trim() || a.students.admission_number : null,
    }))
  } catch (e) {
    console.error('Failed to load attendance:', e)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {}

onMounted(async () => {
  await Promise.all([loadClasses(), loadAttendance()])
})
</script>
