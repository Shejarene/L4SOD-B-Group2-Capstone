<template>
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-900">
    <!-- Left side -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float-delay"></div>
        <div class="absolute top-1/2 left-1/3 w-48 h-48 bg-indigo-300/20 rounded-full blur-2xl animate-float-slow"></div>
      </div>

      <div class="relative text-white px-16 max-w-lg">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm mb-8">
          <i class="pi pi-graduation-cap text-3xl"></i>
        </div>
        <h2 class="text-4xl font-bold mb-6 leading-tight">Welcome to<br/>Acadex</h2>
        <p class="text-blue-100 text-lg mb-10 leading-relaxed">
          A complete school management platform. Streamline academics, attendance, fees, and communication.
        </p>

        <div class="space-y-4">
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
            <div class="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-users text-emerald-300"></i>
            </div>
            <div>
              <p class="font-semibold">Role-Based Access</p>
              <p class="text-sm text-blue-200">Tailored dashboards for everyone</p>
            </div>
          </div>
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
            <div class="w-10 h-10 rounded-lg bg-blue-400/20 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-chart-line text-blue-300"></i>
            </div>
            <div>
              <p class="font-semibold">Smart Analytics</p>
              <p class="text-sm text-blue-200">Real-time insights & reports</p>
            </div>
          </div>
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
            <div class="w-10 h-10 rounded-lg bg-amber-400/20 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-shield text-amber-300"></i>
            </div>
            <div>
              <p class="font-semibold">Secure & Reliable</p>
              <p class="text-sm text-blue-200">Enterprise-grade security</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="lg:hidden inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/50 mb-4">
            <i class="pi pi-graduation-cap text-2xl text-blue-600"></i>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome back</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2">Sign in to your account</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <i class="pi pi-envelope text-slate-400 text-sm"></i>
                </div>
                <input
                  v-model="email"
                  type="email"
                  placeholder="you@school.com"
                  class="input-warm pl-10"
                  :class="{ 'error': errors.email }"
                  @input="clearError('email')"
                  autocomplete="email"
                />
              </div>
              <transition name="fade-warm">
                <p v-if="errors.email" class="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                  <i class="pi pi-exclamation-circle text-xs"></i>{{ errors.email }}
                </p>
              </transition>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <i class="pi pi-lock text-slate-400 text-sm"></i>
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="input-warm pl-10 pr-10"
                  :class="{ 'error': errors.password }"
                  @input="clearError('password')"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
                </button>
              </div>
              <transition name="fade-warm">
                <p v-if="errors.password" class="mt-1.5 text-sm text-red-500 flex items-center gap-1.5">
                  <i class="pi pi-exclamation-circle text-xs"></i>{{ errors.password }}
                </p>
              </transition>
            </div>

            <transition name="fade-warm">
              <div v-if="auth.error" class="p-3.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div class="flex items-center gap-2.5">
                  <i class="pi pi-exclamation-triangle text-red-500 text-sm"></i>
                  <p class="text-sm text-red-700 dark:text-red-400">{{ auth.error }}</p>
                </div>
              </div>
            </transition>

            <button
              type="submit"
              class="btn-primary w-full h-11 text-sm shadow-sm"
              :disabled="auth.loading"
            >
              <i v-if="auth.loading" class="pi pi-spin pi-spinner"></i>
              <span>{{ auth.loading ? 'Signing in...' : 'Sign in' }}</span>
            </button>
          </form>

          <div class="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
            <p class="text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?
              <router-link to="/request-login" class="text-blue-600 dark:text-blue-400 font-medium ml-1 hover:underline">
                Request access
              </router-link>
            </p>
          </div>
        </div>

        <p class="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
          Secured with authentication &middot; Acadex v1.0
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
