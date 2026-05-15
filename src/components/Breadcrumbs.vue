<template>
  <nav class="mb-4" v-if="$route.meta.title">
    <ol class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <li><router-link to="/app/dashboard" class="hover:text-primary-600">Home</router-link></li>
      <li class="pi pi-chevron-right text-xs"></li>
      <li class="text-gray-900 dark:text-white font-medium">{{ $route.meta.title }}</li>
    </ol>
  </nav>
</template>
