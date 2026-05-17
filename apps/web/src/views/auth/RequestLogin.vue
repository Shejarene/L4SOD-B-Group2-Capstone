<template>
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-900">
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
      <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float-delay"></div>
      </div>

      <div class="relative text-white px-16 max-w-lg">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm mb-8">
          <i class="pi pi-user-plus text-3xl"></i>
        </div>
        <h2 class="text-4xl font-bold mb-6 leading-tight">Request<br/>Access</h2>
        <p class="text-blue-100 text-lg mb-10 leading-relaxed">
          Fill in the form and the administration will review your request. You'll be notified when your account is ready.
        </p>

        <div class="space-y-3">
          <div v-for="tip in tips" :key="tip" class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
            <i class="pi pi-check-circle text-emerald-300"></i>
            <span class="text-sm">{{ tip }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
      <div class="w-full max-w-lg">
        <div class="lg:hidden flex items-center justify-center mb-8">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/50">
            <i class="pi pi-user-plus text-2xl text-blue-600"></i>
          </div>
        </div>

        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Request Account</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2">Tell us about yourself</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div v-if="submitted" class="text-center py-8">
            <div class="w-16 h-16 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-check-circle text-3xl text-emerald-600"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Request Submitted!</h3>
            <p class="text-slate-500 dark:text-slate-400 mb-6">We'll review your request and get back to you soon.</p>
            <Button label="Back to Home" icon="pi pi-home" class="btn-primary" @click="router.push('/')" />
          </div>

          <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
                <input v-model="form.firstName" class="input-warm" placeholder="First name" :class="{ 'error': errors.firstName }" />
                <small v-if="errors.firstName" class="text-red-500 text-xs mt-1">{{ errors.firstName }}</small>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
                <input v-model="form.lastName" class="input-warm" placeholder="Last name" :class="{ 'error': errors.lastName }" />
                <small v-if="errors.lastName" class="text-red-500 text-xs mt-1">{{ errors.lastName }}</small>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input v-model="form.email" type="email" class="input-warm" placeholder="you@example.com" :class="{ 'error': errors.email }" />
              <small v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
              <input v-model="form.phone" class="input-warm" placeholder="+250 7XX XXX XXX" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">I am a...</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="role in roleOptions"
                  :key="role.value"
                  type="button"
                  @click="form.requestedRole = role.value"
                  class="p-2.5 rounded-lg border text-center transition-all duration-200"
                  :class="form.requestedRole === role.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'"
                >
                  <i :class="role.icon" class="text-base"></i>
                  <p class="text-sm font-medium mt-1">{{ role.label }}</p>
                </button>
              </div>
              <small v-if="errors.requestedRole" class="text-red-500 text-xs mt-1">{{ errors.requestedRole }}</small>
            </div>

            <div v-if="isAdminRole">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Administration Role</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="ad in adminRoles"
                  :key="ad.value"
                  type="button"
                  @click="form.requestedRole = ad.value"
                  class="px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200"
                  :class="form.requestedRole === ad.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'"
                >
                  {{ ad.label }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Reason</label>
              <textarea v-model="form.reason" rows="3" class="input-warm resize-none" placeholder="Tell us why you need access..." />
            </div>

            <button type="submit" class="btn-primary w-full h-10 text-sm" :disabled="loading">
              <i v-if="loading" class="pi pi-spin pi-spinner"></i>
              <span>{{ loading ? 'Submitting...' : 'Submit Request' }}</span>
            </button>
          </form>

          <p class="text-center text-sm text-slate-500 dark:text-slate-400 mt-5 pt-5 border-t border-slate-200 dark:border-slate-700">
            Already have an account?
            <router-link to="/login" class="text-blue-600 dark:text-blue-400 font-medium hover:underline">Sign in</router-link>
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

const tips = ['Quick and easy process', 'Admin approval required', 'Get notified when ready']

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
