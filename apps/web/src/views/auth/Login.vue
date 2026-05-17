<template>
  <div class="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800">
      <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float" style="animation-delay: -3s;"></div>
        <div class="absolute top-1/2 left-1/3 w-48 h-48 bg-indigo-300/20 rounded-full blur-2xl animate-float" style="animation-delay: -1.5s;"></div>
      </div>

      <div class="relative text-white px-16 max-w-lg">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
          <i class="pi pi-graduation-cap text-4xl"></i>
        </div>
        <h2 class="text-5xl font-bold mb-6 leading-tight">Welcome to<br/>Acadex</h2>
        <p class="text-primary-100 text-lg mb-10 leading-relaxed">
          Your complete school management platform. Streamline academics, attendance, fees, and communication — all in one beautiful place.
        </p>

        <div class="space-y-4">
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
            <div class="w-10 h-10 rounded-lg bg-green-400/20 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-users text-green-300"></i>
            </div>
            <div>
              <p class="font-semibold">Role-Based Access</p>
              <p class="text-sm text-primary-200">Tailored dashboards for everyone</p>
            </div>
          </div>
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
            <div class="w-10 h-10 rounded-lg bg-blue-400/20 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-chart-line text-blue-300"></i>
            </div>
            <div>
              <p class="font-semibold">Smart Analytics</p>
              <p class="text-sm text-primary-200">Real-time insights & reports</p>
            </div>
          </div>
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
            <div class="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-shield text-yellow-300"></i>
            </div>
            <div>
              <p class="font-semibold">Secure & Reliable</p>
              <p class="text-sm text-primary-200">Enterprise-grade security</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="inline-flex lg:hidden items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/50 mb-6">
            <i class="pi pi-graduation-cap text-3xl text-primary-600"></i>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Sign in to continue to your dashboard</p>
        </div>

        <div class="bg-white dark:bg-gray-800/50 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-700/50 p-8">
          <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="pi pi-envelope text-gray-400 text-sm"></i>
                </div>
                <input
                  v-model="email"
                  type="email"
                  placeholder="you@school.com"
                  class="input-field pl-11 h-12"
                  :class="{ 'error': errors.email }"
                  @input="clearError('email')"
                  autocomplete="email"
                />
              </div>
              <transition name="fade">
                <p v-if="errors.email" class="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <i class="pi pi-exclamation-circle text-xs"></i>{{ errors.email }}
                </p>
              </transition>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="pi pi-lock text-gray-400 text-sm"></i>
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="input-field pl-11 pr-12 h-12"
                  :class="{ 'error': errors.password }"
                  @input="clearError('password')"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
                </button>
              </div>
              <transition name="fade">
                <p v-if="errors.password" class="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <i class="pi pi-exclamation-circle text-xs"></i>{{ errors.password }}
                </p>
              </transition>
            </div>

            <transition name="fade">
              <div v-if="auth.error" class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div class="flex items-center gap-3">
                  <i class="pi pi-exclamation-triangle text-red-500"></i>
                  <p class="text-sm text-red-700 dark:text-red-400">{{ auth.error }}</p>
                </div>
              </div>
            </transition>

            <button
              type="submit"
              class="btn-primary w-full h-12 text-base shadow-lg shadow-primary-200 dark:shadow-primary-900/30 hover:shadow-xl"
              :disabled="auth.loading"
            >
              <i v-if="auth.loading" class="pi pi-spin pi-spinner"></i>
              <span>{{ auth.loading ? 'Signing in...' : 'Sign in' }}</span>
            </button>
          </form>

          <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50">
            <p class="text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?
              <router-link to="/request-login" class="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium ml-1 hover:underline">
                Request access
              </router-link>
            </p>
          </div>
        </div>

        <p class="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
          Secured with JWT authentication &middot; Acadex v1.0
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errors = reactive({ email: '', password: '' })

const clearError = (field) => {
  errors[field] = ''
  auth.clearError()
}

const handleLogin = async () => {
  errors.email = ''
  errors.password = ''

  let hasError = false
  if (!email.value) { errors.email = 'Email is required'; hasError = true }
  else if (!email.value.includes('@')) { errors.email = 'Please enter a valid email'; hasError = true }
  if (!password.value) { errors.password = 'Password is required'; hasError = true }
  if (hasError) return

  try {
    await auth.login(email.value, password.value)
  } catch (err) {
    errors.email = err.message || 'Invalid email or password'
  }
}
</script>
