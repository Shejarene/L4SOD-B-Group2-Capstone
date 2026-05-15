import { defineStore } from 'pinia'
import api from '../utils/axios'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role || null,
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
  },
  actions: {
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password })
      if (data.success) {
        this.user = data.data.user
        this.token = data.data.accessToken
        this.refreshToken = data.data.refreshToken
        localStorage.setItem('user', JSON.stringify(data.data.user))
        localStorage.setItem('accessToken', data.data.accessToken)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        router.push('/app/dashboard')
      }
      return data
    },
    async refreshToken() {
      try {
        const { data } = await api.post('/auth/refresh', { refreshToken: this.refreshToken })
        if (data.success) {
          this.token = data.data.accessToken
          this.refreshToken = data.data.refreshToken
          localStorage.setItem('accessToken', data.data.accessToken)
          localStorage.setItem('refreshToken', data.data.refreshToken)
        }
      } catch {
        this.logout()
      }
    },
    async fetchProfile() {
      try {
        const { data } = await api.get('/auth/profile')
        if (data.success) {
          this.user = data.data
          localStorage.setItem('user', JSON.stringify(data.data))
        }
      } catch { /* ignore */ }
    },
    logout() {
      this.user = null
      this.token = null
      this.refreshToken = null
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.push('/')
    },
  },
})
