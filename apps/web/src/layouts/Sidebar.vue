<template>
  <aside
    class="fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 z-30 flex flex-col"
    :class="store.sidebarCollapsed ? 'w-20' : 'w-64'"
  >
    <div class="flex items-center h-16 px-4 border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-200 dark:shadow-primary-900/30">
          <i class="pi pi-graduation-cap text-white text-lg"></i>
        </div>
        <span v-if="!store.sidebarCollapsed" class="font-bold text-lg text-gray-900 dark:text-white truncate">Acadex</span>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <template v-for="(group, groupIndex) in groupedMenu" :key="groupIndex">
        <div v-if="group.label && !store.sidebarCollapsed" class="px-3 pt-4 pb-2">
          <p class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{{ group.label }}</p>
        </div>
        <router-link v-for="item in group.items" :key="item.to" :to="item.to"
          class="sidebar-link" :class="{ 'justify-center': store.sidebarCollapsed }"
          v-tooltip.right="store.sidebarCollapsed ? item.label : undefined">
          <i :class="item.icon" class="text-lg min-w-[1.25rem]"></i>
          <span v-if="!store.sidebarCollapsed" class="truncate">{{ item.label }}</span>
        </router-link>
      </template>
    </nav>

    <div class="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
      <router-link to="/app/help"
        class="sidebar-link" :class="{ 'justify-center': store.sidebarCollapsed }"
        v-tooltip.right="store.sidebarCollapsed ? 'Help & Support' : undefined">
        <i class="pi pi-question-circle text-lg"></i>
        <span v-if="!store.sidebarCollapsed">Help & Support</span>
      </router-link>
      <router-link to="/app/profile"
        class="sidebar-link" :class="{ 'justify-center': store.sidebarCollapsed }"
        v-tooltip.right="store.sidebarCollapsed ? auth.fullName : undefined">
        <div class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-xs font-medium text-primary-700 dark:text-primary-400 flex-shrink-0">
          {{ auth.initials }}
        </div>
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

const menuGroups = [
  {
    label: '',
    items: [
      { label: 'Dashboard', icon: 'pi pi-home', to: '/app/dashboard', roles: ['*'] },
    ]
  },
  {
    label: 'Academics',
    items: [
      { label: 'Students', icon: 'pi pi-users', to: '/app/students', roles: ['super_admin', 'admin', 'principal', 'dos', 'teacher'] },
      { label: 'Teachers', icon: 'pi pi-user-plus', to: '/app/teachers', roles: ['super_admin', 'admin', 'principal', 'dos'] },
      { label: 'Classes', icon: 'pi pi-building', to: '/app/classes', roles: ['super_admin', 'admin', 'dos'] },
      { label: 'Subjects', icon: 'pi pi-book', to: '/app/subjects', roles: ['super_admin', 'admin', 'dos'] },
      { label: 'Exams', icon: 'pi pi-file-edit', to: '/app/exams', roles: ['super_admin', 'admin', 'principal', 'dos', 'teacher'] },
      { label: 'Marks', icon: 'pi pi-chart-line', to: '/app/marks', roles: ['teacher', 'dos', 'admin'] },
      { label: 'Marks Approval', icon: 'pi pi-check-circle', to: '/app/marks/approval', roles: ['dos', 'admin', 'principal'] },
    ]
  },
  {
    label: 'Daily Operations',
    items: [
      { label: 'Attendance', icon: 'pi pi-calendar', to: '/app/attendance', roles: ['teacher', 'admin', 'principal'] },
      { label: 'Analytics', icon: 'pi pi-chart-bar', to: '/app/attendance/analytics', roles: ['super_admin', 'admin', 'principal', 'dos', 'teacher'] },
      { label: 'Timetable', icon: 'pi pi-clock', to: '/app/timetable', roles: ['*'] },
    ]
  },
  {
    label: 'Finance',
    items: [
      { label: 'Fees', icon: 'pi pi-dollar', to: '/app/fees', roles: ['accountant', 'admin', 'super_admin'] },
      { label: 'Payments', icon: 'pi pi-credit-card', to: '/app/fees/payments', roles: ['accountant', 'admin', 'super_admin'] },
    ]
  },
  {
    label: 'Community',
    items: [
      { label: 'Discipline', icon: 'pi pi-shield', to: '/app/discipline', roles: ['discipline_master', 'admin', 'principal'] },
      { label: 'Lost & Found', icon: 'pi pi-search', to: '/app/lost-found', roles: ['*'] },
      { label: 'Messages', icon: 'pi pi-envelope', to: '/app/communication', roles: ['*'] },
      { label: 'Announcements', icon: 'pi pi-bullhorn', to: '/app/communication/announcements', roles: ['*'] },
    ]
  },
  {
    label: 'Reports & Admin',
    items: [
      { label: 'Reports', icon: 'pi pi-chart-pie', to: '/app/reports', roles: ['super_admin', 'admin', 'principal', 'dos'] },
      { label: 'Report Cards', icon: 'pi pi-file-pdf', to: '/app/reports/report-card', roles: ['super_admin', 'admin', 'principal', 'dos', 'teacher'] },
      { label: 'Import Data', icon: 'pi pi-upload', to: '/app/import', roles: ['super_admin', 'admin'] },
      { label: 'Invites', icon: 'pi pi-send', to: '/app/invites', roles: ['super_admin'] },
      { label: 'Settings', icon: 'pi pi-cog', to: '/app/settings', roles: ['super_admin', 'admin'] },
    ]
  },
]

const groupedMenu = computed(() => {
  return menuGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes('*') || item.roles.includes(auth.userRole))
    }))
    .filter(group => group.items.length > 0)
})
</script>
