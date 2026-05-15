<template>
  <div class="min-h-screen flex bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>
      <div class="relative text-white px-16 max-w-lg">
        <i class="pi pi-user-plus text-6xl mb-8 block"></i>
        <h2 class="text-4xl font-bold mb-4 leading-tight">Need Access?<br/>Request an Account</h2>
        <p class="text-primary-100 text-lg mb-8 leading-relaxed">
          Fill in the form and the administration will review your request. You'll receive an email once your account is ready.
        </p>
        <div class="space-y-3">
          <div v-for="tip in tips" :key="tip" class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
            <i class="pi pi-check-circle text-green-300"></i>
            <span class="text-sm">{{ tip }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-lg">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900 mb-4">
            <i class="pi pi-user-plus text-3xl text-primary-600"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Request Account</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Tell us about yourself</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <div v-if="submitted" class="text-center py-8">
            <div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-check-circle text-4xl text-green-600"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Request Submitted!</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">The administration will review your request. We'll notify you once your account is ready.</p>
            <Button label="Back to Home" icon="pi pi-home" @click="router.push('/')" />
          </div>

          <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <InputText v-model="form.firstName" class="w-full" placeholder="Your first name" :class="{ 'p-invalid': errors.firstName }" />
                <small v-if="errors.firstName" class="text-red-500">{{ errors.firstName }}</small>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <InputText v-model="form.lastName" class="w-full" placeholder="Your last name" :class="{ 'p-invalid': errors.lastName }" />
                <small v-if="errors.lastName" class="text-red-500">{{ errors.lastName }}</small>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <InputText v-model="form.email" type="email" class="w-full" placeholder="you@example.com" :class="{ 'p-invalid': errors.email }" />
              <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <InputText v-model="form.phone" class="w-full" placeholder="+250 7XX XXX XXX" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a...</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="role in roleOptions"
                  :key="role.value"
                  type="button"
                  @click="form.requestedRole = role.value"
                  class="p-3 rounded-xl border text-left transition-all duration-150"
                  :class="form.requestedRole === role.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'"
                >
                  <i :class="role.icon" class="text-lg"></i>
                  <p class="text-sm font-medium mt-1">{{ role.label }}</p>
                  <p class="text-[10px] text-gray-400">{{ role.sub }}</p>
                </button>
              </div>
              <small v-if="errors.requestedRole" class="text-red-500">{{ errors.requestedRole }}</small>
            </div>

            <div v-if="isAdminRole">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Administration Role</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="ad in adminRoles"
                  :key="ad.value"
                  type="button"
                  @click="form.requestedRole = ad.value"
                  class="px-4 py-2 rounded-xl border text-sm font-medium transition-all"
                  :class="form.requestedRole === ad.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'"
                >
                  {{ ad.label }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for request</label>
              <Textarea v-model="form.reason" rows="3" class="w-full" placeholder="Tell us why you need access..." />
            </div>

            <Button type="submit" label="Submit Request" icon="pi pi-send" class="w-full h-12 rounded-xl" :loading="loading" />
          </form>

          <p class="text-center text-sm text-gray-400 mt-4">
            Already have an account?
            <router-link to="/login" class="text-primary-600 hover:underline font-medium">Sign in</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../utils/axios'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
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

const roleOptions = [
  { value: 'student', label: 'Student', icon: 'pi pi-user', sub: 'Enrolled learner' },
  { value: 'teacher', label: 'Teacher', icon: 'pi pi-users', sub: 'Faculty member' },
  { value: 'administration', label: 'Administration', icon: 'pi pi-briefcase', sub: 'Staff member' },
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
  if (!form.requestedRole) errors.requestedRole = 'Please select a role'
  if (Object.keys(errors).length) return

  const payload = { ...form }
  if (payload.requestedRole === 'administration') {
    toast.add({ severity: 'warn', summary: 'Please select a specific administration role', life: 3000 })
    return
  }

  loading.value = true
  try {
    await api.post('/login-requests', payload)
    submitted.value = true
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.response?.data?.message || 'Failed to submit', life: 3000 })
  } finally { loading.value = false }
}
</script>
