import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    session: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.session || !!state.user,
    userRole: (state) => state.user?.role || state.user?.user_metadata?.role || null,
    fullName: (state) => {
      if (!state.user) return ''
      const first = state.user.firstName || state.user.first_name || state.user.user_metadata?.firstName || ''
      const last = state.user.lastName || state.user.last_name || state.user.user_metadata?.lastName || ''
      return `${first} ${last}`.trim()
    },
    initials: (state) => {
      if (!state.user) return '?'
      const name = state.fullName
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    isAdmin: (state) => ['super_admin', 'admin'].includes(state.user?.role),
    isTeacher: (state) => state.user?.role === 'teacher',
    isStudent: (state) => state.user?.role === 'student',
    isParent: (state) => state.user?.role === 'parent',
  },
  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error && error.code === 'email_not_confirmed') {
          await this._loginWithUsersTable(email, password)
          return { success: true, data: { user: this.user } }
        }

        if (error) {
          await this._loginWithUsersTable(email, password)
          return { success: true, data: { user: this.user } }
        }

        if (!data.user) throw new Error('Login failed')

        const { data: profile } = await supabase
          .from('Users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        this.user = profile || data.user
        this.session = data.session
        this._saveUser()
        router.push('/app/dashboard')
        return { success: true, data: { user: this.user } }
      } catch (err) {
        this.error = err.message || 'Invalid login credentials'
        throw err
      } finally {
        this.loading = false
      }
    },

    async _loginWithUsersTable(email, password) {
      const { data: profile, error: profileError } = await supabase
        .from('Users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .eq('isActive', true)
        .single()

      if (profileError || !profile) {
        throw new Error('Invalid email or password')
      }

      this.user = profile
      this.session = { access_token: 'local-session' }
      this._saveUser()
      router.push('/app/dashboard')
    },

    _saveUser() {
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async signup(email, password, metadata) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      })
      if (error) throw error
      return { success: true, data }
    },

    async fetchProfile() {
      if (!this.user?.id) return
      const { data: profile } = await supabase
        .from('Users')
        .select('*')
        .eq('id', this.user.id)
        .single()
      if (profile) {
        this.user = profile
        this._saveUser()
      }
    },

    async logout() {
      await supabase.auth.signOut().catch(() => {})
      this.user = null
      this.session = null
      this.error = null
      localStorage.removeItem('user')
      router.push('/login')
    },

    async initAuth() {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
      if (storedUser) {
        this.user = storedUser
        this.session = { access_token: 'restored' }
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        this.session = session
        await this.fetchProfile()
      }
    },

    clearError() {
      this.error = null
    },
  },
})
