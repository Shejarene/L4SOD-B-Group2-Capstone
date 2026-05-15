<template>
  <header class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
    <div class="flex items-center gap-4">
      <button @click="store.toggleSidebar()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <i class="pi pi-bars text-xl text-gray-600 dark:text-gray-400"></i>
      </button>
    </div>
    <div class="flex items-center gap-4">
      <button @click="store.toggleDarkMode()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
        <i class="pi text-xl" :class="store.darkMode ? 'pi-sun text-yellow-400' : 'pi-moon text-gray-600'"></i>
      </button>
      <router-link to="/app/help" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <i class="pi pi-question-circle text-xl text-gray-600 dark:text-gray-400"></i>
      </router-link>
      <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium capitalize">
        {{ auth.userRole?.replace('_', ' ') }}
      </span>
      <button @click="logout" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 transition-colors" v-tooltip.left="'Sign Out'">
        <i class="pi pi-sign-out text-xl"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useAppStore } from '../stores/app'
import { useAuthStore } from '../stores/auth'

const store = useAppStore()
const auth = useAuthStore()

const logout = () => {
  auth.logout()
}
</script>
