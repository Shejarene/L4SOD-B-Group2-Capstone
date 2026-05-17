<template>
  <nav class="mb-5" v-if="breadcrumbs.length">
    <ol class="flex items-center gap-1.5 text-sm">
      <li>
        <router-link to="/app/dashboard" class="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <i class="pi pi-home text-xs"></i>
          <span>Home</span>
        </router-link>
      </li>
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <li class="pi pi-chevron-right text-[10px] text-slate-300 dark:text-slate-600"></li>
        <li v-if="index === breadcrumbs.length - 1" class="text-slate-900 dark:text-slate-100 font-medium">
          {{ crumb.label }}
        </li>
        <li v-else>
          <router-link :to="crumb.to" class="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {{ crumb.label }}
          </router-link>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const title = route.meta.title
  if (!title) return []

  const pathParts = route.path.split('/').filter(Boolean)
  const crumbs = []

  if (pathParts.length > 1) {
    const section = pathParts[1]
    const sectionLabels = {
      students: 'Students',
      teachers: 'Teachers',
      classes: 'Classes',
      classrooms: 'Classrooms',
      subjects: 'Subjects',
      exams: 'Exams',
      marks: 'Marks',
      attendance: 'Attendance',
      fees: 'Fees',
      timetable: 'Timetable',
      discipline: 'Discipline',
      communication: 'Communication',
      'lost-found': 'Lost & Found',
      reports: 'Reports',
      settings: 'Settings',
      invites: 'Invites',
      import: 'Import',
      help: 'Help',
      profile: 'Profile',
    }

    if (sectionLabels[section]) {
      crumbs.push({ label: sectionLabels[section], to: `/app/${section}` })
    }
  }

  crumbs.push({ label: title })
  return crumbs
})
</script>
