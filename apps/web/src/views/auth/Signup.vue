<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <i class="pi pi-school text-5xl text-primary-600 mb-4"></i>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-2">You've been invited to join</p>
      </div>

      <div v-if="loading" class="card text-center py-8">
        <i class="pi pi-spin pi-spinner text-4xl text-primary-600 mb-4"></i>
        <p>Verifying invite...</p>
      </div>

      <div v-else-if="error" class="card text-center py-8">
        <i class="pi pi-exclamation-circle text-4xl text-red-500 mb-4"></i>
        <p class="text-red-500">{{ error }}</p>
        <Button label="Go to Login" icon="pi pi-sign-in" class="mt-4" @click="router.push('/login')" />
      </div>

      <div v-else class="card">
        <div class="mb-4 p-3 bg-primary-50 dark:bg-primary-900 rounded-lg text-sm">
          <span class="font-medium">Role:</span>
          <Tag :value="invite.role?.replace('_', ' ')" class="ml-2" />
          <span v-if="invite.email" class="block mt-1 text-gray-500">Email: {{ invite.email }}</span>
        </div>

        <form @submit.prevent="handleSignup">
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">First Name</label>
                <InputText v-model="form.firstName" class="w-full" :class="{ 'p-invalid': errors.firstName }" />
                <small v-if="errors.firstName" class="text-red-500">{{ errors.firstName }}</small>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">Last Name</label>
                <InputText v-model="form.lastName" class="w-full" :class="{ 'p-invalid': errors.lastName }" />
                <small v-if="errors.lastName" class="text-red-500">{{ errors.lastName }}</small>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium">Email</label>
              <InputText v-model="form.email" type="email" class="w-full" :class="{ 'p-invalid': errors.email }" :disabled="!!invite.email" />
              <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium">Phone</label>
              <InputText v-model="form.phone" class="w-full" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium">Password</label>
              <Password v-model="form.password" placeholder="Min 6 characters" :feedback="true" class="w-full" :class="{ 'p-invalid': errors.password }" />
              <small v-if="errors.password" class="text-red-500">{{ errors.password }}</small>
            </div>
            <Button type="submit" label="Create Account" icon="pi pi-user-plus" class="w-full" :loading="submitting" />
          </div>
        </form>

        <p class="text-center text-sm text-gray-500 mt-4">
          Already have an account?
          <router-link to="/login" class="text-primary-600 hover:underline">Sign in</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const invite = ref({})
const loading = ref(true)
const error = ref('')
const submitting = ref(false)
const form = reactive({ firstName: '', lastName: '', email: '', phone: '', password: '' })
const errors = reactive({})

const verifyInvite = async () => {
  try {
    const { data, error: err } = await supabase.rpc('verify_invite_token', { p_token: route.params.token })
    if (err) throw err
    if (!data || data.length === 0) {
      error.value = 'Invalid or expired invite link'
    } else {
      invite.value = data[0]
      if (data[0].email) form.email = data[0].email
    }
  } catch (err) {
    error.value = err.message || 'Invalid or expired invite link'
  } finally { loading.value = false }
}

const handleSignup = async () => {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.firstName) errors.firstName = 'Required'
  if (!form.lastName) errors.lastName = 'Required'
  if (!form.email) errors.email = 'Required'
  if (!form.password || form.password.length < 6) errors.password = 'Min 6 characters'
  if (Object.keys(errors).length) return

  submitting.value = true
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          role: invite.value.role,
        },
      },
    })
    if (authError) throw authError

    await supabase.rpc('accept_invite', { p_token: route.params.token })

    if (authData.user) {
      await supabase.from('users').insert({
        id: authData.user.id,
        email: form.email,
        role: invite.value.role,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
      })
    }

    toast.add({ severity: 'success', summary: 'Account created! You can now sign in.', life: 5000 })
    router.push('/login')
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Error', detail: err.message || 'Signup failed', life: 3000 })
  } finally { submitting.value = false }
}

onMounted(verifyInvite)
</script>
