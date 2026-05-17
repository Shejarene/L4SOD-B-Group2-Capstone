<template>
  <header class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
    <div class="flex items-center gap-4">
      <button @click="store.toggleSidebar()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <i class="pi pi-bars text-xl text-gray-600 dark:text-gray-400"></i>
      </button>
    </div>
    <div class="flex items-center gap-4">
      <router-link v-if="auth.user?.role === 'super_admin'" to="/app/invites" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
        <i class="pi pi-bell text-xl text-gray-600 dark:text-gray-400"></i>
        <span v-if="pendingCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">{{ pendingCount > 9 ? '9+' : pendingCount }}</span>
      </router-link>
      <button @click="store.toggleDarkMode()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
        <i class="pi text-xl" :class="store.darkMode ? 'pi-sun text-yellow-400' : 'pi-moon text-gray-600'"></i>
      </button>
      <router-link to="/app/help" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        <i class="pi pi-question-circle text-xl text-gray-600 dark:text-gray-400"></i>
      </router-link>
      <span v-if="auth.isDemo" class="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-xs font-medium">DEMO</span>
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
    const { data, error } = await supabase.rpc('get_pending_requests')
    if (error) {
      const { data: directData } = await supabase
        .from('invites')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')
        .not('reason', 'is', null)
      pendingCount.value = directData?.length || 0
    } else {
      pendingCount.value = (data || []).length
    }
  } catch { /* ignore */ }
}

const setupRealtime = () => {
  realtimeChannel = supabase
    .channel('topbar-invites')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'invites' },
      () => { loadPendingCount() }
    )
    .subscribe()
}

const logout = () => {
  auth.logout()
}

onMounted(() => {
  loadPendingCount()
  if (auth.user?.role === 'super_admin') {
    setupRealtime()
  }
})

onUnmounted(() => {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel)
  }
})
</script>
