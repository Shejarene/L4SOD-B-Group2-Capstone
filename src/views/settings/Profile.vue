<template>
  <div>
    <h1 class="page-title">My Profile</h1>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="card lg:col-span-1 text-center">
        <div class="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
          <i class="pi pi-user text-4xl text-primary-600"></i>
        </div>
        <h2 class="text-xl font-bold">{{ authStore.fullName }}</h2>
        <Tag :value="authStore.userRole?.replace('_', ' ')" class="mt-2" />
        <p class="text-gray-500 mt-2">{{ authStore.user?.email }}</p>
      </div>
      <div class="card lg:col-span-2">
        <h2 class="text-lg font-semibold mb-4">Account Information</h2>
        <div class="grid grid-cols-2 gap-4">
          <div><span class="text-gray-500 text-sm">First Name</span><p>{{ authStore.user?.firstName }}</p></div>
          <div><span class="text-gray-500 text-sm">Last Name</span><p>{{ authStore.user?.lastName }}</p></div>
          <div><span class="text-gray-500 text-sm">Email</span><p>{{ authStore.user?.email }}</p></div>
          <div><span class="text-gray-500 text-sm">Phone</span><p>{{ authStore.user?.phone || '-' }}</p></div>
          <div><span class="text-gray-500 text-sm">Role</span><p class="capitalize">{{ authStore.userRole?.replace('_', ' ') }}</p></div>
          <div><span class="text-gray-500 text-sm">Last Login</span><p>{{ authStore.user?.lastLogin ? new Date(authStore.user.lastLogin).toLocaleString() : '-' }}</p></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
const authStore = useAuthStore()
</script>
