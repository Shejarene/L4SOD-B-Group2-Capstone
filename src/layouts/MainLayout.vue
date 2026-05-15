<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
    <Sidebar />
    <div
      class="flex flex-col flex-1 transition-all duration-300"
      :class="store.sidebarCollapsed ? 'ml-20' : 'ml-64'"
    >
      <Topbar />
      <main class="flex-1 overflow-y-auto p-6">
        <Breadcrumbs />
        <router-view />
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/app'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import AppFooter from '../components/AppFooter.vue'

const store = useAppStore()
</script>
