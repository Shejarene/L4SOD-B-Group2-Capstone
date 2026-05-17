<template>
  <div class="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
    <Sidebar />
    <div
      class="flex flex-col flex-1 transition-all duration-300"
      :class="store.sidebarCollapsed ? 'ml-20' : 'ml-64'"
    >
      <Topbar />
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-7xl mx-auto p-4 sm:p-6">
          <Breadcrumbs />
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
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

<style scoped>
.page-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
