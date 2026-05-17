<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="name" class="text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot />
    <transition name="fade">
      <small v-if="error" class="text-red-500 flex items-center gap-1">
        <i class="pi pi-exclamation-circle text-xs"></i>{{ error }}
      </small>
    </transition>
    <small v-if="hint && !error" class="text-gray-400 dark:text-gray-500">{{ hint }}</small>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  name: { type: String, default: '' },
  required: { type: Boolean, default: false },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
})
</script>
