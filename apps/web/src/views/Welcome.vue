<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <nav class="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
          <i class="pi pi-graduation-cap text-white text-base"></i>
        </div>
        <span class="text-lg font-bold text-slate-900 dark:text-slate-100">Acadex</span>
      </div>
      <div class="flex items-center gap-3">
        <button @click="store.toggleDarkMode()" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <i class="pi text-sm" :class="store.darkMode ? 'pi-sun text-amber-400' : 'pi-moon text-slate-500'"></i>
        </button>
        <Button label="Sign In" icon="pi pi-arrow-right" iconPos="right" class="btn-primary text-sm h-9" @click="router.push('/login')" />
      </div>
    </nav>

    <header class="max-w-7xl mx-auto px-6 pt-16 pb-20">
      <div class="text-center max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-6">
          <i class="pi pi-sparkles text-xs"></i>
          School Management, Made Simple
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-5 leading-tight">
          Manage Your School<br/>
          <span class="text-blue-600">With Confidence</span>
        </h1>
        <p class="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
          A complete school management platform for administrators, teachers, students, and parents. Everything you need, in one place.
        </p>
        <div class="flex justify-center gap-3">
          <Button label="Get Started" icon="pi pi-arrow-right" iconPos="right" class="btn-primary h-10 text-sm" @click="router.push('/login')" />
          <Button label="Learn More" icon="pi pi-info-circle" class="btn-secondary h-10 text-sm" @click="scrollToFeatures" />
        </div>
      </div>
    </header>

    <section id="features" class="max-w-7xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Everything You Need</h2>
        <p class="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">From classroom management to financial tracking — we've got you covered.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="feature in features" :key="feature.title" class="card-interactive text-center">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3" :class="feature.bg">
            <i :class="feature.icon" class="text-xl"></i>
          </div>
          <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{{ feature.title }}</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <section class="bg-gradient-to-r from-blue-600 to-indigo-700 py-14">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-2xl font-bold text-white mb-3">Ready to Get Started?</h2>
        <p class="text-blue-100 mb-6 text-base">Join schools already using Acadex to manage their daily operations.</p>
        <Button label="Sign In" icon="pi pi-arrow-right" iconPos="right" class="bg-white text-blue-600 hover:bg-blue-50 font-semibold h-10 px-5 rounded-xl shadow-lg text-sm" @click="router.push('/login')" />
      </div>
    </section>

    <footer class="bg-slate-900 dark:bg-slate-950 text-slate-400 py-10">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <div class="flex items-center gap-2.5 mb-3">
              <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <i class="pi pi-graduation-cap text-white text-base"></i>
              </div>
              <span class="text-lg font-bold text-white">Acadex</span>
            </div>
            <p class="text-sm max-w-md leading-relaxed">A comprehensive school management system designed to streamline administration, enhance learning outcomes, and connect the entire school community.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#features" class="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">Privacy</a></li>
              <li><a href="#" class="hover:text-blue-400 transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3 text-sm">Contact</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2"><i class="pi pi-envelope text-blue-400 text-xs"></i> admin@school.com</li>
              <li class="flex items-center gap-2"><i class="pi pi-phone text-blue-400 text-xs"></i> +234 800 000 0001</li>
              <li class="flex items-center gap-2"><i class="pi pi-map-marker text-blue-400 text-xs"></i> 123 Education Ave</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-slate-800 mt-6 pt-6 text-center text-sm">
          <p>&copy; {{ new Date().getFullYear() }} Acadex. All rights reserved.</p>
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
  { title: 'Academic Management', desc: 'Marks entry with approval workflow, grade calculation, and performance analytics.', icon: 'pi pi-chart-line text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
  { title: 'Attendance Tracking', desc: 'Daily class attendance with status tracking and monthly reports.', icon: 'pi pi-calendar text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/50' },
  { title: 'Fee Management', desc: 'Configure fee structures, generate invoices, and record payments.', icon: 'pi pi-dollar text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/50' },
  { title: 'Timetable Scheduling', desc: 'Visual timetable with conflict detection for classes and teachers.', icon: 'pi pi-clock text-violet-600', bg: 'bg-violet-100 dark:bg-violet-900/50' },
  { title: 'Communication Hub', desc: 'In-app messaging and targeted announcements for the school community.', icon: 'pi pi-envelope text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/50' },
  { title: 'Discipline Management', desc: 'Record and track student conduct with case resolution workflow.', icon: 'pi pi-shield text-red-600', bg: 'bg-red-100 dark:bg-red-900/50' },
  { title: 'Role-Based Access', desc: '9 distinct roles with granular permissions for everyone.', icon: 'pi pi-users text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
  { title: 'Report Generation', desc: 'Performance summaries, attendance reports, and financial statements.', icon: 'pi pi-file text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/50' },
  { title: 'Dark Mode', desc: 'Easy on the eyes with a full dark mode that syncs with PrimeVue theming.', icon: 'pi pi-moon text-slate-600 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-700' },
]

const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
