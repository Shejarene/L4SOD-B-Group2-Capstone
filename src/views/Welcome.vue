<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <nav class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div class="flex items-center gap-2">
        <i class="pi pi-school text-3xl text-primary-600"></i>
        <span class="text-xl font-bold text-gray-900 dark:text-white">SchoolMS</span>
      </div>
      <div class="flex items-center gap-3">
        <button @click="store.toggleDarkMode()" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <i class="pi text-xl" :class="store.darkMode ? 'pi-sun' : 'pi-moon'"></i>
        </button>
        <Button label="Sign In" icon="pi pi-sign-in" @click="router.push('/login')" />
      </div>
    </nav>

    <header class="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
      <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
        Manage Your School<br/>
        <span class="text-primary-600">With Confidence</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
        A complete school management platform for administrators, teachers, students, and parents.
        Track academics, attendance, fees, and communication — all in one place.
      </p>
      <div class="flex justify-center gap-4">
        <Button label="Get Started" icon="pi pi-arrow-right" iconPos="right" size="large" @click="router.push('/login')" />
        <Button label="Learn More" icon="pi pi-info-circle" class="p-button-outlined" size="large" @click="scrollToFeatures" />
      </div>
    </header>

    <section id="features" class="max-w-7xl mx-auto px-6 py-20">
      <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Everything You Need</h2>
      <p class="text-center text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
        From classroom management to financial tracking — we've got you covered.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="feature in features" :key="feature.title" class="card text-center hover:shadow-lg transition-shadow">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" :class="feature.bg">
            <i :class="feature.icon" class="text-2xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ feature.title }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <section class="bg-primary-600 dark:bg-primary-800 py-16">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p class="text-primary-100 mb-8 text-lg">Join thousands of schools already using SchoolMS</p>
        <Button label="Sign In to Your Account" icon="pi pi-arrow-right" iconPos="right" size="large" class="p-button-lg p-button-outlined text-white border-white hover:bg-white hover:text-primary-700" @click="router.push('/login')" />
      </div>
    </section>

    <footer class="bg-gray-900 dark:bg-black text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <i class="pi pi-school text-2xl text-primary-400"></i>
              <span class="text-xl font-bold text-white">SchoolMS</span>
            </div>
            <p class="text-sm max-w-md">A comprehensive school management system designed to streamline administration, enhance learning outcomes, and connect the entire school community.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" class="hover:text-white transition-colors">About</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Contact</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2"><i class="pi pi-envelope text-primary-400"></i> admin@school.com</li>
              <li class="flex items-center gap-2"><i class="pi pi-phone text-primary-400"></i> +234 800 000 0001</li>
              <li class="flex items-center gap-2"><i class="pi pi-map-marker text-primary-400"></i> 123 Education Ave</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {{ new Date().getFullYear() }} SchoolMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import Button from 'primevue/button'

const router = useRouter()
const store = useAppStore()

const features = [
  { title: 'Academic Management', desc: 'Marks entry with approval workflow, grade calculation, and performance analytics.', icon: 'pi pi-chart-line text-green-600', bg: 'bg-green-100 dark:bg-green-900' },
  { title: 'Attendance Tracking', desc: 'Daily class attendance with status tracking and monthly reports.', icon: 'pi pi-calendar text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900' },
  { title: 'Fee Management', desc: 'Configure fee structures, generate invoices, and record payments with receipts.', icon: 'pi pi-dollar text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900' },
  { title: 'Timetable Scheduling', desc: 'Visual timetable with conflict detection for classes and teachers.', icon: 'pi pi-clock text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900' },
  { title: 'Communication Hub', desc: 'In-app messaging and targeted announcements for the entire school community.', icon: 'pi pi-envelope text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900' },
  { title: 'Discipline Management', desc: 'Record and track student conduct with case resolution workflow.', icon: 'pi pi-shield text-red-600', bg: 'bg-red-100 dark:bg-red-900' },
  { title: 'Role-Based Access', desc: '9 distinct roles with granular permissions — from Super Admin to Student.', icon: 'pi pi-users text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900' },
  { title: 'Report Generation', desc: 'Performance summaries, attendance reports, and financial statements.', icon: 'pi pi-file text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900' },
  { title: 'Dark Mode', desc: 'Easy on the eyes with a full dark mode that syncs with PrimeVue theming.', icon: 'pi pi-moon text-pink-600', bg: 'bg-pink-100 dark:bg-pink-900' },
]

const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
