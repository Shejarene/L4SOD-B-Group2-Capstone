<template>
  <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
    <Sidebar />
    <div
      class="flex flex-col flex-1 transition-all duration-300"
      :class="store.sidebarCollapsed ? 'ml-20' : 'ml-64'"
    >
      <Topbar />
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <Breadcrumbs />
          <router-view v-slot="{ Component }">
            <transition name="fade-warm" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
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
