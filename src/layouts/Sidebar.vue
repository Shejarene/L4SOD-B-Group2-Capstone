<template>
  <aside
    class="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 flex flex-col"
    :class="store.sidebarCollapsed ? 'w-20' : 'w-64'"
  >
    <div class="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <i class="pi pi-school text-2xl text-primary-600 mr-3"></i>
      <span v-if="!store.sidebarCollapsed" class="font-bold text-lg text-gray-900 dark:text-white truncate">Acadex</span>
    </div>
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <router-link v-for="item in filteredMenu" :key="item.to" :to="item.to"
        class="sidebar-link" :class="{ 'justify-center': store.sidebarCollapsed }">
        <i :class="item.icon" class="text-xl min-w-[1.25rem]"></i>
        <span v-if="!store.sidebarCollapsed" class="truncate">{{ item.label }}</span>
      </router-link>
    </nav>
    <div class="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
      <router-link to="/app/help"
        class="sidebar-link" :class="{ 'justify-center': store.sidebarCollapsed }">
        <i class="pi pi-question-circle text-xl"></i>
        <span v-if="!store.sidebarCollapsed">Help & Support</span>
      </router-link>
      <router-link to="/app/profile"
        class="sidebar-link" :class="{ 'justify-center': store.sidebarCollapsed }">
        <i class="pi pi-user text-xl"></i>
        <span v-if="!store.sidebarCollapsed" class="truncate">{{ auth.fullName || 'Profile' }}</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/app'
import { useAuthStore } from '../stores/auth'

const store = useAppStore()
const auth = useAuthStore()

const menuItems = [
  { label: 'Dashboard', icon: 'pi pi-home', to: '/app/dashboard', roles: ['*'] },
  { label: 'Students', icon: 'pi pi-users', to: '/app/students', roles: ['super_admin', 'admin', 'principal', 'dos', 'teacher'] },
  { label: 'Teachers', icon: 'pi pi-user-plus', to: '/app/teachers', roles: ['super_admin', 'admin', 'principal', 'dos'] },
  { label: 'Levels & Trades', icon: 'pi pi-sort-amount-up', to: '/app/classes', roles: ['super_admin', 'admin', 'dos'] },
  { label: 'Classrooms', icon: 'pi pi-building', to: '/app/classrooms', roles: ['super_admin', 'admin', 'dos', 'teacher'] },
  { label: 'Subjects', icon: 'pi pi-book', to: '/app/subjects', roles: ['super_admin', 'admin', 'dos'] },
  { label: 'Marks', icon: 'pi pi-chart-line', to: '/app/marks', roles: ['teacher', 'dos', 'admin'] },
  { label: 'Marks Approval', icon: 'pi pi-check-circle', to: '/app/marks/approval', roles: ['dos', 'admin', 'principal'] },
  { label: 'Attendance', icon: 'pi pi-calendar', to: '/app/attendance', roles: ['teacher', 'admin', 'principal'] },
  { label: 'Timetable', icon: 'pi pi-clock', to: '/app/timetable', roles: ['*'] },
  { label: 'Fees', icon: 'pi pi-dollar', to: '/app/fees', roles: ['accountant', 'admin', 'super_admin'] },
  { label: 'Discipline', icon: 'pi pi-shield', to: '/app/discipline', roles: ['discipline_master', 'admin', 'principal'] },
  { label: 'Lost & Found', icon: 'pi pi-search', to: '/app/lost-found', roles: ['*'] },
  { label: 'Lost & Found Admin', icon: 'pi pi-verified', to: '/app/lost-found/admin', roles: ['super_admin', 'admin'] },
  { label: 'Communication', icon: 'pi pi-envelope', to: '/app/communication', roles: ['*'] },
  { label: 'Reports', icon: 'pi pi-chart-bar', to: '/app/reports', roles: ['super_admin', 'admin', 'principal', 'dos'] },
  { label: 'Report Card', icon: 'pi pi-file-pdf', to: '/app/reports/report-card', roles: ['super_admin', 'admin', 'principal', 'dos', 'teacher'] },
  { label: 'Import Students', icon: 'pi pi-upload', to: '/app/import', roles: ['super_admin', 'admin'] },
  { label: 'Invites', icon: 'pi pi-send', to: '/app/invites', roles: ['super_admin'] },
  { label: 'Settings', icon: 'pi pi-cog', to: '/app/settings', roles: ['super_admin', 'admin'] },
]

const filteredMenu = computed(() => {
  return menuItems.filter(item => item.roles.includes('*') || item.roles.includes(auth.userRole))
})
</script>
