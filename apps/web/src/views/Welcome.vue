<template>
  <div class="min-h-screen bg-[#faf8f5] dark:bg-[#1a1816]">
    <!-- Nav -->
    <nav class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#e07a5f] to-[#f2cc8f] flex items-center justify-center shadow-md shadow-[#e07a5f]/20">
          <i class="pi pi-graduation-cap text-white text-lg"></i>
        </div>
        <span class="text-xl font-bold text-[#2d2a26] dark:text-[#f5f0ea]">Acadex</span>
      </div>
      <div class="flex items-center gap-3">
        <button @click="store.toggleDarkMode()" class="p-2 rounded-xl hover:bg-[#f5f0ea] dark:hover:bg-[#2a2826] transition-colors">
          <i class="pi text-lg" :class="store.darkMode ? 'pi-sun text-[#f2cc8f]' : 'pi-moon text-[#6b6560]'"></i>
        </button>
        <Button label="Sign In" icon="pi pi-arrow-right" iconPos="right" class="btn-primary" @click="router.push('/login')" />
      </div>
    </nav>

    <!-- Hero -->
    <header class="max-w-7xl mx-auto px-6 pt-16 pb-20">
      <div class="text-center max-w-3xl mx-auto">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e07a5f]/10 text-[#e07a5f] text-sm font-semibold mb-8">
          <i class="pi pi-sparkles"></i>
          School Management, Made Simple
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-[#2d2a26] dark:text-[#f5f0ea] mb-6 leading-tight">
          Where learning<br/>
          <span class="text-[#e07a5f]">comes alive</span>
        </h1>
        <p class="text-xl text-[#8a857d] max-w-xl mx-auto mb-10 leading-relaxed">
          A complete school management platform for administrators, teachers, students, and parents. Everything you need, in one place.
        </p>
        <div class="flex justify-center gap-4">
          <Button label="Get Started" icon="pi pi-arrow-right" iconPos="right" class="btn-primary h-12 px-6 text-base" @click="router.push('/login')" />
          <Button label="Learn More" icon="pi pi-info-circle" class="btn-secondary h-12 px-6 text-base" @click="scrollToFeatures" />
        </div>
      </div>
    </header>

    <!-- Features -->
    <section id="features" class="max-w-7xl mx-auto px-6 py-20">
      <div class="text-center mb-14">
        <h2 class="text-3xl font-bold text-[#2d2a26] dark:text-[#f5f0ea] mb-4">Everything You Need</h2>
        <p class="text-[#8a857d] max-w-lg mx-auto">From classroom management to financial tracking — we've got you covered.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="feature in features" :key="feature.title" class="card-interactive text-center">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" :class="feature.bg">
            <i :class="feature.icon" class="text-2xl"></i>
          </div>
          <h3 class="text-lg font-bold text-[#2d2a26] dark:text-[#f5f0ea] mb-2">{{ feature.title }}</h3>
          <p class="text-[#8a857d] text-sm leading-relaxed">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-gradient-to-r from-[#e07a5f] to-[#f2cc8f] py-16">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p class="text-white/80 mb-8 text-lg">Join schools already using Acadex to manage their daily operations.</p>
        <Button label="Sign In" icon="pi pi-arrow-right" iconPos="right" class="bg-white text-[#e07a5f] hover:bg-white/90 font-bold h-12 px-6 rounded-2xl shadow-lg" @click="router.push('/login')" />
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#2d2a26] dark:bg-[#111010] text-[#8a857d] py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#e07a5f] to-[#f2cc8f] flex items-center justify-center">
                <i class="pi pi-graduation-cap text-white text-lg"></i>
              </div>
              <span class="text-xl font-bold text-white">Acadex</span>
            </div>
            <p class="text-sm max-w-md leading-relaxed">A comprehensive school management system designed to streamline administration, enhance learning outcomes, and connect the entire school community.</p>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#features" class="hover:text-[#e07a5f] transition-colors">Features</a></li>
              <li><a href="#" class="hover:text-[#e07a5f] transition-colors">About</a></li>
              <li><a href="#" class="hover:text-[#e07a5f] transition-colors">Privacy</a></li>
              <li><a href="#" class="hover:text-[#e07a5f] transition-colors">Terms</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4">Contact</h4>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2"><i class="pi pi-envelope text-[#e07a5f]"></i> admin@school.com</li>
              <li class="flex items-center gap-2"><i class="pi pi-phone text-[#e07a5f]"></i> +234 800 000 0001</li>
              <li class="flex items-center gap-2"><i class="pi pi-map-marker text-[#e07a5f]"></i> 123 Education Ave</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-[#3a3632] mt-8 pt-8 text-center text-sm">
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
  { title: 'Academic Management', desc: 'Marks entry with approval workflow, grade calculation, and performance analytics.', icon: 'pi pi-chart-line text-[#81b29a]', bg: 'bg-[#81b29a]/10' },
  { title: 'Attendance Tracking', desc: 'Daily class attendance with status tracking and monthly reports.', icon: 'pi pi-calendar text-[#3d405b] dark:text-[#f2cc8f]', bg: 'bg-[#3d405b]/10 dark:bg-[#3d405b]/15' },
  { title: 'Fee Management', desc: 'Configure fee structures, generate invoices, and record payments.', icon: 'pi pi-dollar text-[#f2cc8f]', bg: 'bg-[#f2cc8f]/20' },
  { title: 'Timetable Scheduling', desc: 'Visual timetable with conflict detection for classes and teachers.', icon: 'pi pi-clock text-[#e07a5f]', bg: 'bg-[#e07a5f]/10' },
  { title: 'Communication Hub', desc: 'In-app messaging and targeted announcements for the school community.', icon: 'pi pi-envelope text-[#3d405b] dark:text-[#f2cc8f]', bg: 'bg-[#3d405b]/10 dark:bg-[#3d405b]/15' },
  { title: 'Discipline Management', desc: 'Record and track student conduct with case resolution workflow.', icon: 'pi pi-shield text-[#e07a5f]', bg: 'bg-[#e07a5f]/10' },
  { title: 'Role-Based Access', desc: '9 distinct roles with granular permissions for everyone.', icon: 'pi pi-users text-[#81b29a]', bg: 'bg-[#81b29a]/10' },
  { title: 'Report Generation', desc: 'Performance summaries, attendance reports, and financial statements.', icon: 'pi pi-file text-[#f2cc8f]', bg: 'bg-[#f2cc8f]/20' },
  { title: 'Warm Design', desc: 'Easy on the eyes with a beautiful warm interface and full dark mode.', icon: 'pi pi-heart text-[#e07a5f]', bg: 'bg-[#e07a5f]/10' },
]

const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
