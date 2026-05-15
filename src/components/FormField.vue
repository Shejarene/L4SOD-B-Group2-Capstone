<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="name" class="text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot />
    <small v-if="error" class="text-red-500">{{ error }}</small>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  name: { type: String, default: '' },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
</script>
