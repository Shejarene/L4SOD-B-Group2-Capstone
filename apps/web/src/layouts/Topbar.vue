<template>
  <header class="h-16 bg-white/70 dark:bg-[#242220]/70 backdrop-blur-xl border-b border-[#e8e4de] dark:border-[#3a3632] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
    <!-- Left: sidebar toggle + greeting -->
    <div class="flex items-center gap-4">
      <button @click="store.toggleSidebar()" class="p-2 rounded-xl hover:bg-[#f5f0ea] dark:hover:bg-[#2a2826] transition-colors">
        <i class="pi pi-bars text-lg text-[#6b6560] dark:text-[#8a857d]"></i>
      </button>
      <div class="hidden sm:block">
        <p class="text-sm font-semibold text-[#2d2a26] dark:text-[#f5f0ea]">{{ greeting }}</p>
        <p class="text-xs text-[#8a857d] dark:text-[#6b6560]">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Right: actions + user -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Notifications -->
      <router-link v-if="auth.isAdmin" to="/app/invites" class="p-2 rounded-xl hover:bg-[#f5f0ea] dark:hover:bg-[#2a2826] transition-colors relative">
        <i class="pi pi-bell text-lg text-[#6b6560] dark:text-[#8a857d]"></i>
        <span v-if="pendingCount > 0" class="absolute top-1 right-1 w-4 h-4 bg-[#e07a5f] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{{ pendingCount > 9 ? '9+' : pendingCount }}</span>
      </router-link>

      <!-- Dark mode toggle -->
      <button @click="store.toggleDarkMode()" class="p-2 rounded-xl hover:bg-[#f5f0ea] dark:hover:bg-[#2a2826] transition-colors">
        <i class="pi text-lg" :class="store.darkMode ? 'pi-sun text-[#f2cc8f]' : 'pi-moon text-[#6b6560] dark:text-[#8a857d]'"></i>
      </button>

      <!-- Help -->
      <router-link to="/app/help" class="p-2 rounded-xl hover:bg-[#f5f0ea] dark:hover:bg-[#2a2826] transition-colors">
        <i class="pi pi-question-circle text-lg text-[#6b6560] dark:text-[#8a857d]"></i>
      </router-link>

      <!-- Divider -->
      <div class="hidden sm:block w-px h-8 bg-[#e8e4de] dark:bg-[#3a3632]"></div>

      <!-- User -->
      <div class="hidden sm:flex items-center gap-3 pl-2">
        <div class="text-right">
          <p class="text-sm font-semibold text-[#2d2a26] dark:text-[#f5f0ea]">{{ auth.fullName }}</p>
          <p class="text-xs text-[#8a857d] capitalize">{{ auth.userRole?.replace('_', ' ') }}</p>
        </div>
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e07a5f] to-[#f2cc8f] flex items-center justify-center text-sm font-bold text-white shadow-md shadow-[#e07a5f]/20">
          {{ auth.initials }}
        </div>
      </div>

      <!-- Sign out -->
      <button @click="logout" class="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-[#6b6560] hover:text-[#e07a5f] dark:hover:text-[#e07a5f] transition-colors" v-tooltip.left="'Sign Out'">
        <i class="pi pi-sign-out text-lg"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../utils/supabase'

const store = useAppStore()
const auth = useAuthStore()
const pendingCount = ref(0)
let realtimeChannel = null

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
})

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
