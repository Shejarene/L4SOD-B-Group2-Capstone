<template>
  <aside
    class="fixed left-0 top-0 h-full bg-white dark:bg-[#242220] border-r border-[#e8e4de] dark:border-[#3a3632] transition-all duration-300 z-30 flex flex-col"
    :class="store.sidebarCollapsed ? 'w-20' : 'w-72'"
  >
    <!-- Logo -->
    <div class="flex items-center h-16 px-4 border-b border-[#e8e4de] dark:border-[#3a3632]">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#e07a5f] to-[#f2cc8f] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#e07a5f]/20">
          <i class="pi pi-graduation-cap text-white text-lg"></i>
        </div>
        <span v-if="!store.sidebarCollapsed" class="font-bold text-xl text-[#2d2a26] dark:text-[#f5f0ea]">Acadex</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
      <template v-for="(group, groupIndex) in groupedMenu" :key="groupIndex">
        <!-- Group label -->
        <div v-if="group.label && !store.sidebarCollapsed" class="px-3">
          <p class="text-[10px] font-bold text-[#b5b0a8] dark:text-[#6b6560] uppercase tracking-widest">{{ group.label }}</p>
        </div>

        <!-- Menu items -->
        <div class="space-y-1">
          <router-link v-for="item in group.items" :key="item.to" :to="item.to"
            class="sidebar-link" :class="{ 'justify-center': store.sidebarCollapsed }"
            v-tooltip.right="store.sidebarCollapsed ? item.label : undefined">
            <i :class="item.icon" class="text-base min-w-[1.25rem]"></i>
            <span v-if="!store.sidebarCollapsed" class="truncate text-sm">{{ item.label }}</span>
          </router-link>
        </div>
      </template>
    </nav>

    <!-- Bottom section -->
    <div class="p-3 border-t border-[#e8e4de] dark:border-[#3a3632] space-y-1">
      <router-link to="/app/help"
        class="sidebar-link" :class="{ 'justify-center': store.sidebarCollapsed }"
        v-tooltip.right="store.sidebarCollapsed ? 'Help' : undefined">
        <i class="pi pi-question-circle text-base"></i>
        <span v-if="!store.sidebarCollapsed" class="text-sm">Help & Support</span>
      </router-link>
      <router-link to="/app/profile"
        class="sidebar-link" :class="{ 'justify-center': store.sidebarCollapsed }"
        v-tooltip.right="store.sidebarCollapsed ? auth.fullName : undefined">
        <div class="w-7 h-7 rounded-xl bg-gradient-to-br from-[#e07a5f] to-[#f2cc8f] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
          {{ auth.initials }}
        </div>
        <span v-if="!store.sidebarCollapsed" class="truncate text-sm">{{ auth.fullName || 'Profile' }}</span>
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
    label: 'Daily',
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
    label: 'Admin',
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
