<template>
  <div class="min-h-screen flex bg-[#faf8f5] dark:bg-[#1a1816]">
    <!-- Left side -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-[#e07a5f] via-[#d4694f] to-[#f2cc8f]">
      <div class="absolute inset-0">
        <div class="absolute top-24 left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-24 right-24 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-float-delay"></div>
      </div>

      <div class="relative text-white px-16 max-w-lg">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-8">
          <i class="pi pi-user-plus text-4xl"></i>
        </div>
        <h2 class="text-5xl font-bold mb-6 leading-tight">Join<br/>Acadex</h2>
        <p class="text-white/80 text-lg mb-10 leading-relaxed">
          Request access and our team will set up your account. It only takes a moment.
        </p>

        <div class="space-y-3">
          <div v-for="tip in tips" :key="tip" class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3">
            <i class="pi pi-check-circle text-green-300"></i>
            <span class="text-sm">{{ tip }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
      <div class="w-full max-w-lg">
        <div class="lg:hidden flex items-center justify-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#e07a5f]/10">
            <i class="pi pi-user-plus text-3xl text-[#e07a5f]"></i>
          </div>
        </div>

        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-[#2d2a26] dark:text-[#f5f0ea]">Request Access</h1>
          <p class="text-[#8a857d] mt-2">Tell us about yourself</p>
        </div>

        <div class="bg-white dark:bg-[#242220] rounded-3xl shadow-warm border border-[#e8e4de] dark:border-[#3a3632] p-8">
          <!-- Success -->
          <div v-if="submitted" class="text-center py-8">
            <div class="w-20 h-20 rounded-3xl bg-[#81b29a]/15 flex items-center justify-center mx-auto mb-5">
              <i class="pi pi-check-circle text-4xl text-[#81b29a]"></i>
            </div>
            <h3 class="text-xl font-bold text-[#2d2a26] dark:text-[#f5f0ea] mb-2">Request Submitted!</h3>
            <p class="text-[#8a857d] mb-6">We'll review your request and get back to you soon.</p>
            <Button label="Back to Home" icon="pi pi-home" class="btn-primary" @click="router.push('/')" />
          </div>

          <!-- Form -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-5">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-semibold text-[#6b6560] dark:text-[#8a857d] mb-2">First Name</label>
                <input v-model="form.firstName" class="input-warm" placeholder="First name" :class="{ 'error': errors.firstName }" />
                <small v-if="errors.firstName" class="text-red-500 text-xs mt-1">{{ errors.firstName }}</small>
              </div>
              <div>
                <label class="block text-sm font-semibold text-[#6b6560] dark:text-[#8a857d] mb-2">Last Name</label>
                <input v-model="form.lastName" class="input-warm" placeholder="Last name" :class="{ 'error': errors.lastName }" />
                <small v-if="errors.lastName" class="text-red-500 text-xs mt-1">{{ errors.lastName }}</small>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#6b6560] dark:text-[#8a857d] mb-2">Email</label>
              <input v-model="form.email" type="email" class="input-warm" placeholder="you@example.com" :class="{ 'error': errors.email }" />
              <small v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</small>
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#6b6560] dark:text-[#8a857d] mb-2">Phone</label>
              <input v-model="form.phone" class="input-warm" placeholder="+250 7XX XXX XXX" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#6b6560] dark:text-[#8a857d] mb-2">I am a...</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="role in roleOptions"
                  :key="role.value"
                  type="button"
                  @click="form.requestedRole = role.value"
                  class="p-3 rounded-2xl border-2 text-center transition-all duration-200"
                  :class="form.requestedRole === role.value
                    ? 'border-[#e07a5f] bg-[#e07a5f]/10 text-[#e07a5f]'
                    : 'border-[#e8e4de] dark:border-[#3a3632] hover:border-[#e07a5f]/40'"
                >
                  <i :class="role.icon" class="text-lg"></i>
                  <p class="text-sm font-semibold mt-1">{{ role.label }}</p>
                </button>
              </div>
              <small v-if="errors.requestedRole" class="text-red-500 text-xs mt-1">{{ errors.requestedRole }}</small>
            </div>

            <div v-if="isAdminRole">
              <label class="block text-sm font-semibold text-[#6b6560] dark:text-[#8a857d] mb-2">Administration Role</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="ad in adminRoles"
                  :key="ad.value"
                  type="button"
                  @click="form.requestedRole = ad.value"
                  class="px-4 py-2 rounded-2xl border-2 text-sm font-semibold transition-all duration-200"
                  :class="form.requestedRole === ad.value
                    ? 'border-[#e07a5f] bg-[#e07a5f]/10 text-[#e07a5f]'
                    : 'border-[#e8e4de] dark:border-[#3a3632] hover:border-[#e07a5f]/40'"
                >
                  {{ ad.label }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-[#6b6560] dark:text-[#8a857d] mb-2">Reason</label>
              <textarea v-model="form.reason" rows="3" class="input-warm resize-none" placeholder="Tell us why you need access..." />
            </div>

            <button type="submit" class="btn-primary w-full h-12 text-base" :disabled="loading">
              <i v-if="loading" class="pi pi-spin pi-spinner"></i>
              <span>{{ loading ? 'Submitting...' : 'Submit Request' }}</span>
            </button>
          </form>

          <p class="text-center text-sm text-[#8a857d] mt-6 pt-6 border-t border-[#e8e4de] dark:border-[#3a3632]">
            Already have an account?
            <router-link to="/login" class="text-[#e07a5f] font-semibold hover:underline">Sign in</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()
const submitted = ref(false)
const loading = ref(false)
const errors = reactive({})
const form = reactive({
  firstName: '', lastName: '', email: '', phone: '',
  requestedRole: '', reason: '',
})

const tips = [
  'Quick and easy process',
  'Admin approval required',
  'Get notified when ready',
]

const roleOptions = [
  { value: 'student', label: 'Student', icon: 'pi pi-user' },
  { value: 'teacher', label: 'Teacher', icon: 'pi pi-users' },
  { value: 'administration', label: 'Admin', icon: 'pi pi-briefcase' },
]

const adminRoles = [
  { value: 'dos', label: 'DOS' },
  { value: 'discipline_master', label: 'DM' },
  { value: 'admin', label: 'Secretary' },
  { value: 'accountant', label: 'Accountant' },
]

const isAdminRole = computed(() => form.requestedRole === 'administration')

const handleSubmit = async () => {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.firstName) errors.firstName = 'Required'
  if (!form.lastName) errors.lastName = 'Required'
  if (!form.email) errors.email = 'Required'
  if (!form.requestedRole || form.requestedRole === 'administration') {
    errors.requestedRole = 'Please select a specific role'
  }
  if (Object.keys(errors).length) return

  loading.value = true
  try {
    const { error: err } = await supabase.from('LoginRequests').insert({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      requestedRole: form.requestedRole,
      reason: form.reason,
      status: 'pending',
    })
    if (err) throw err
    submitted.value = true
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Failed to submit request', life: 5000 })
  } finally { loading.value = false }
}
</script>
