import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebarCollapsed: false,
    darkMode: localStorage.getItem('darkMode') === 'true',
    breadcrumbs: [],
  }),
  actions: {
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      this.applyTheme()
    },
    setBreadcrumbs(items) {
      this.breadcrumbs = items
    },
    applyTheme() {
      localStorage.setItem('darkMode', this.darkMode)
      const root = document.documentElement
      const meta = document.querySelector('meta[name="theme-color"]')
      const link = document.getElementById('prime-theme-link')

      if (this.darkMode) {
        root.classList.add('dark')
        if (meta) meta.setAttribute('content', '#111827')
        if (link) link.href = 'https://cdn.jsdelivr.net/npm/primevue@3.52.0/resources/themes/lara-dark-blue/theme.css'
      } else {
        root.classList.remove('dark')
        if (meta) meta.setAttribute('content', '#ffffff')
        if (link) link.href = 'https://cdn.jsdelivr.net/npm/primevue@3.52.0/resources/themes/lara-light-blue/theme.css'
      }
    },
  },
})
