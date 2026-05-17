<template>
  <header class="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
    <div class="flex items-center gap-4">
      <button @click="store.toggleSidebar()" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
        <i class="pi pi-bars text-sm text-slate-500 dark:text-slate-400"></i>
      </button>
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
      <router-link v-if="auth.isAdmin" to="/app/invites" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative">
        <i class="pi pi-bell text-sm text-slate-500 dark:text-slate-400"></i>
        <span v-if="pendingCount > 0" class="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{{ pendingCount > 9 ? '9+' : pendingCount }}</span>
      </router-link>

      <button @click="store.toggleDarkMode()" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
        <i class="pi text-sm" :class="store.darkMode ? 'pi-sun text-amber-400' : 'pi-moon text-slate-500 dark:text-slate-400'"></i>
      </button>

      <router-link to="/app/help" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
        <i class="pi pi-question-circle text-sm text-slate-500 dark:text-slate-400"></i>
      </router-link>

      <div class="hidden sm:flex items-center gap-2.5 pl-3 ml-1 border-l border-slate-200 dark:border-slate-700">
        <div class="text-right">
          <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ auth.fullName }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 capitalize">{{ auth.userRole?.replace('_', ' ') }}</p>
        </div>
        <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
          {{ auth.initials }}
        </div>
      </div>

      <button @click="logout" class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors" v-tooltip.left="'Sign Out'">
        <i class="pi pi-sign-out text-sm"></i>
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
