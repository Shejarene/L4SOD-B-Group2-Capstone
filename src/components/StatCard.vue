<template>
  <div class="stat-card">
    <div class="w-14 h-14 rounded-xl flex items-center justify-center" :class="bgClass">
      <i :class="`pi ${icon} text-2xl ${iconClass}`"></i>
    </div>
    <div>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</p>
      <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  value: { type: [String, Number], default: 0 },
  icon: { type: String, default: 'pi-users' },
  bgClass: { type: String, default: 'bg-blue-100 dark:bg-blue-900' },
  iconClass: { type: String, default: 'text-blue-600 dark:text-blue-300' },
})
</script>
