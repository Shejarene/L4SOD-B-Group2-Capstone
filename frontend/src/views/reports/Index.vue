<template>
  <div>
    <h1 class="page-title">Reports</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="report in reports" :key="report.title" class="card hover:shadow-md transition-shadow cursor-pointer" @click="handleReport(report)">
        <i :class="report.icon" class="text-3xl mb-3" :style="{ color: report.color }"></i>
        <h3 class="text-lg font-semibold">{{ report.title }}</h3>
        <p class="text-gray-500 text-sm">{{ report.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const reports = [
  { title: 'Student Performance', desc: 'View performance analytics by class and subject', icon: 'pi pi-chart-line', color: '#3b82f6', route: '/app/marks' },
  { title: 'Attendance Report', desc: 'Monthly attendance summaries and statistics', icon: 'pi pi-calendar', color: '#10b981', route: '/app/attendance/report' },
  { title: 'Fee Collection', desc: 'Payment summaries and outstanding balances', icon: 'pi pi-dollar', color: '#f59e0b', route: '/app/fees' },
  { title: 'Grade Summary', desc: 'Class grade distribution and averages', icon: 'pi pi-chart-bar', color: '#8b5cf6', route: '/app/marks' },
  { title: 'Discipline Report', desc: 'Conduct records and case summaries', icon: 'pi pi-shield', color: '#ef4444', route: '/app/discipline' },
  { title: 'Lost & Found', desc: 'Browse and report missing items', icon: 'pi pi-search', color: '#14b8a6', route: '/app/lost-found' },
  { title: 'Report Card', desc: 'Generate and download student report cards as PDF', icon: 'pi pi-file-pdf', color: '#ef4444', route: '/app/reports/report-card' },
]

const handleReport = (report) => {
  router.push(report.route)
}
</script>
