<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
    <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
      <div class="flex items-center gap-4">
        <span>&copy; {{ new Date().getFullYear() }} Acadex. All rights reserved.</span>
        <router-link to="/app/help" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <i class="pi pi-question-circle mr-1"></i>Help
        </router-link>
      </div>
      <div class="flex items-center gap-4">
        <span class="hidden sm:inline">Contact: admin@school.com</span>
        <span class="hidden sm:inline">|</span>
        <span class="hidden sm:inline">v1.0.0</span>
      </div>
    </div>
  </footer>
</template>
