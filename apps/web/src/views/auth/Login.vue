<template>
  <div class="min-h-screen flex bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full blur-2xl"></div>
      </div>
      <div class="relative text-white px-16 max-w-lg">
        <i class="pi pi-school text-6xl mb-8 block"></i>
        <h2 class="text-4xl font-bold mb-4 leading-tight">Empowering Education,<br/>One Platform</h2>
        <p class="text-primary-100 text-lg mb-8 leading-relaxed">
          From attendance to academics, fees to communication — everything your school needs to run smoothly, in one beautiful place.
        </p>
        <div class="space-y-4">
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
            <i class="pi pi-check-circle text-2xl text-green-300"></i>
            <div>
              <p class="font-semibold">Role-Based Dashboards</p>
              <p class="text-sm text-primary-200">Tailored for every user</p>
            </div>
          </div>
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
            <i class="pi pi-shield text-2xl text-yellow-300"></i>
            <div>
              <p class="font-semibold">Secure & Reliable</p>
              <p class="text-sm text-primary-200">JWT authentication with role access</p>
            </div>
          </div>
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
            <i class="pi pi-sync text-2xl text-blue-300"></i>
            <div>
              <p class="font-semibold">Real-Time Updates</p>
              <p class="text-sm text-primary-200">Stay connected always</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900 mb-6">
            <i class="pi pi-school text-3xl text-primary-600"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Sign in to access your dashboard</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-700 p-8">
          <form @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div class="relative">
                <i class="pi pi-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <InputText
                  v-model="email"
                  type="email"
                  placeholder="you@school.com"
                  class="w-full pl-10 h-12 rounded-xl border-gray-200 dark:border-gray-600 dark:bg-gray-700 transition-all"
                  :class="{ 'border-red-300': errors.email }"
                />
              </div>
              <transition name="fade">
                <p v-if="errors.email" class="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                  <i class="pi pi-exclamation-circle text-xs"></i>{{ errors.email }}
                </p>
              </transition>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <Password
                v-model="password"
                placeholder="Enter your password"
                :feedback="false"
                toggleMask
                class="w-full"
                inputClass="w-full h-12 rounded-xl border-gray-200 dark:border-gray-600 dark:bg-gray-700 px-4"
              />
              <transition name="fade">
                <p v-if="errors.password" class="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                  <i class="pi pi-exclamation-circle text-xs"></i>{{ errors.password }}
                </p>
              </transition>
            </div>

            <Button
              type="submit"
              :loading="loading"
              label="Sign In"
              icon="pi pi-arrow-right"
              iconPos="right"
              class="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary-200 dark:shadow-primary-900/30 hover:shadow-xl transition-all duration-200"
            />
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?
              <router-link to="/request-login" class="text-primary-600 hover:underline font-medium ml-1">Request Access</router-link>
            </p>
          </div>

          <p class="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            Secured with JWT authentication &middot; v1.0.0
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errors = reactive({ email: '', password: '' })

const handleLogin = async () => {
  errors.email = ''
  errors.password = ''
  if (!email.value) { errors.email = 'Email is required'; return }
  if (!password.value) { errors.password = 'Password is required'; return }
  loading.value = true
  try {
    await auth.login(email.value, password.value)
  } catch (err) {
    errors.email = err.message || 'Invalid login credentials'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
