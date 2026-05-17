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

      if (this.darkMode) {
        root.classList.add('dark')
        if (meta) meta.setAttribute('content', '#111827')
        this.switchPrimeTheme('dark')
      } else {
        root.classList.remove('dark')
        if (meta) meta.setAttribute('content', '#ffffff')
        this.switchPrimeTheme('light')
      }
    },
    switchPrimeTheme(theme) {
      const linkId = 'prime-theme-link'
      let link = document.getElementById(linkId)
      if (!link) {
        link = document.createElement('link')
        link.id = linkId
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      }
      link.href = theme === 'dark'
        ? 'https://cdn.jsdelivr.net/npm/primevue@3.52.0/resources/themes/lara-dark-blue/theme.css'
        : 'https://cdn.jsdelivr.net/npm/primevue@3.52.0/resources/themes/lara-light-blue/theme.css'
    },
    initTheme() {
      this.applyTheme()
    },
  },
})
