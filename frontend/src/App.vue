<template>
  <router-view />
  <Toast />
  <ConfirmDialog />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './stores/app'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

const appStore = useAppStore()

onMounted(() => {
  appStore.initTheme()
})
</script>
