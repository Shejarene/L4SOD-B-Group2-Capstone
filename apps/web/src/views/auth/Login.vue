<template>
  <div class="min-h-screen flex bg-[#faf8f5] dark:bg-[#1a1816]">
    <!-- Left side - warm illustration -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-[#e07a5f] via-[#d4694f] to-[#c45a3f]">
      <!-- Floating decorative elements -->
      <div class="absolute inset-0">
        <div class="absolute top-24 left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-24 right-24 w-96 h-96 bg-[#f2cc8f]/20 rounded-full blur-3xl animate-float-delay"></div>
        <div class="absolute top-1/2 left-1/3 w-56 h-56 bg-[#81b29a]/20 rounded-full blur-2xl animate-float-slow"></div>
      </div>

      <div class="relative text-white px-16 max-w-lg">
        <!-- Logo -->
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm mb-8 shadow-lg">
          <i class="pi pi-graduation-cap text-4xl"></i>
        </div>

        <h2 class="text-5xl font-bold mb-6 leading-tight">
          Welcome to<br/>Acadex
        </h2>
        <p class="text-white/80 text-lg mb-10 leading-relaxed">
          Where learning comes alive. Manage your school with warmth, clarity, and purpose.
        </p>

        <!-- Feature cards -->
        <div class="space-y-4">
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4">
            <div class="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-users text-lg"></i>
            </div>
            <div>
              <p class="font-semibold">People First</p>
              <p class="text-sm text-white/70">Built for teachers, students & parents</p>
            </div>
          </div>
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4">
            <div class="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-chart-line text-lg"></i>
            </div>
            <div>
              <p class="font-semibold">Clear Insights</p>
              <p class="text-sm text-white/70">Understand progress at a glance</p>
            </div>
          </div>
          <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4">
            <div class="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <i class="pi pi-heart text-lg"></i>
            </div>
            <div>
              <p class="font-semibold">Made with Care</p>
              <p class="text-sm text-white/70">Simple, intuitive, and reliable</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - login form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
      <div class="w-full max-w-md">
        <!-- Mobile logo -->
        <div class="lg:hidden flex items-center justify-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#e07a5f]/10 mb-2">
            <i class="pi pi-graduation-cap text-3xl text-[#e07a5f]"></i>
          </div>
        </div>

        <!-- Heading -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-[#2d2a26] dark:text-[#f5f0ea]">Hello again</h1>
          <p class="text-[#8a857d] mt-2">Sign in to continue to your workspace</p>
        </div>

        <!-- Form card -->
        <div class="bg-white dark:bg-[#242220] rounded-3xl shadow-warm border border-[#e8e4de] dark:border-[#3a3632] p-8">
          <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
            <!-- Email -->
            <div>
              <label class="block text-sm font-semibold text-[#6b6560] dark:text-[#8a857d] mb-2">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="pi pi-envelope text-[#b5b0a8] text-sm"></i>
                </div>
                <input
                  v-model="email"
                  type="email"
                  placeholder="you@school.com"
                  class="input-warm pl-11"
                  :class="{ 'error': errors.email }"
                  @input="clearError('email')"
                  autocomplete="email"
                />
              </div>
              <transition name="fade-warm">
                <p v-if="errors.email" class="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <i class="pi pi-exclamation-circle text-xs"></i>{{ errors.email }}
                </p>
              </transition>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-semibold text-[#6b6560] dark:text-[#8a857d] mb-2">Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i class="pi pi-lock text-[#b5b0a8] text-sm"></i>
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="input-warm pl-11 pr-12"
                  :class="{ 'error': errors.password }"
                  @input="clearError('password')"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-[#b5b0a8] hover:text-[#6b6560] dark:hover:text-[#8a857d]"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'" class="text-sm"></i>
                </button>
              </div>
              <transition name="fade-warm">
                <p v-if="errors.password" class="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <i class="pi pi-exclamation-circle text-xs"></i>{{ errors.password }}
                </p>
              </transition>
            </div>

            <!-- Error alert -->
            <transition name="fade-warm">
              <div v-if="auth.error" class="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                    <i class="pi pi-exclamation-triangle text-red-500 text-sm"></i>
                  </div>
                  <p class="text-sm text-red-700 dark:text-red-400">{{ auth.error }}</p>
                </div>
              </div>
            </transition>

            <!-- Submit -->
            <button
              type="submit"
              class="btn-primary w-full h-12 text-base shadow-lg shadow-[#e07a5f]/20"
              :disabled="auth.loading"
            >
              <i v-if="auth.loading" class="pi pi-spin pi-spinner"></i>
              <span>{{ auth.loading ? 'Signing in...' : 'Sign in' }}</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="mt-8 pt-6 border-t border-[#e8e4de] dark:border-[#3a3632]">
            <p class="text-center text-sm text-[#8a857d]">
              Don't have an account?
              <router-link to="/request-login" class="text-[#e07a5f] font-semibold ml-1 hover:underline">
                Request access
              </router-link>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-xs text-[#b5b0a8] dark:text-[#6b6560] mt-8">
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
