<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" :for="name" class="text-sm font-semibold text-[#6b6560] dark:text-[#8a857d]">
      {{ label }} <span v-if="required" class="text-[#e07a5f]">*</span>
    </label>
    <slot />
    <transition name="fade-warm">
      <small v-if="error" class="text-red-500 flex items-center gap-1">
        <i class="pi pi-exclamation-circle text-xs"></i>{{ error }}
      </small>
    </transition>
    <small v-if="hint && !error" class="text-[#b5b0a8] dark:text-[#6b6560]">{{ hint }}</small>
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
