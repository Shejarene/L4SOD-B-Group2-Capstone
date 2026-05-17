<template>
  <header class="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
    <div class="flex items-center gap-4">
      <button @click="store.toggleSidebar()" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <i class="pi pi-bars text-lg text-gray-600 dark:text-gray-400"></i>
      </button>
      <div class="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <i class="pi pi-map-marker text-xs"></i>
        <span>Acadex School Management</span>
      </div>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
      <router-link v-if="auth.isAdmin" to="/app/invites" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
        <i class="pi pi-bell text-lg text-gray-600 dark:text-gray-400"></i>
        <span v-if="pendingCount > 0" class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{{ pendingCount > 9 ? '9+' : pendingCount }}</span>
      </router-link>

      <button @click="store.toggleDarkMode()" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <i class="pi text-lg" :class="store.darkMode ? 'pi-sun text-yellow-500' : 'pi-moon text-gray-600 dark:text-gray-400'"></i>
      </button>

      <router-link to="/app/help" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <i class="pi pi-question-circle text-lg text-gray-600 dark:text-gray-400"></i>
      </router-link>

      <div class="hidden sm:flex items-center gap-3 pl-3 ml-1 border-l border-gray-200 dark:border-gray-700">
        <div class="text-right">
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ auth.fullName }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ auth.userRole?.replace('_', ' ') }}</p>
        </div>
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 flex items-center justify-center text-sm font-medium text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/30">
          {{ auth.initials }}
        </div>
      </div>

      <button @click="logout" class="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors" v-tooltip.left="'Sign Out'">
        <i class="pi pi-sign-out text-lg"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../utils/supabase'

const store = useAppStore()
const auth = useAuthStore()
const pendingCount = ref(0)
let realtimeChannel = null

const loadPendingCount = async () => {
  try {
    const { count } = await supabase
      .from('LoginRequests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
    pendingCount.value = count || 0
  } catch { /* ignore */ }
}

const setupRealtime = () => {
  realtimeChannel = supabase
    .channel('topbar-login-requests')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'LoginRequests' },
      () => { loadPendingCount() }
    )
    .subscribe()
}

const logout = () => {
  auth.logout()
}

onMounted(() => {
  loadPendingCount()
  if (auth.isAdmin) {
    setupRealtime()
  }
})

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }
})
</script>
