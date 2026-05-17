import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import router from '../router'

const DEMO_USERS = {
  'admin@school.com': { password: 'admin123', role: 'super_admin', firstName: 'Super', lastName: 'Admin', id: 'demo-admin' },
  'principal@school.com': { password: 'admin123', role: 'principal', firstName: 'John', lastName: 'Principal', id: 'demo-principal' },
  'dos@school.com': { password: 'admin123', role: 'dos', firstName: 'Jane', lastName: 'Director', id: 'demo-dos' },
  'teacher@school.com': { password: 'admin123', role: 'teacher', firstName: 'Alice', lastName: 'Teacher', id: 'demo-teacher' },
  'accountant@school.com': { password: 'admin123', role: 'accountant', firstName: 'Bob', lastName: 'Accountant', id: 'demo-accountant' },
  'discipline@school.com': { password: 'admin123', role: 'discipline_master', firstName: 'Charlie', lastName: 'Discipline', id: 'demo-discipline' },
  'student@school.com': { password: 'admin123', role: 'student', firstName: 'Demo', lastName: 'Student', id: 'demo-student' },
  'parent@school.com': { password: 'admin123', role: 'parent', firstName: 'Demo', lastName: 'Parent', id: 'demo-parent' },
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    session: null,
    isDemo: localStorage.getItem('isDemo') === 'true',
  }),
  getters: {
    isAuthenticated: (state) => !!state.session || !!state.user,
    userRole: (state) => state.user?.role || state.user?.user_metadata?.role || null,
    fullName: (state) => state.user ? `${state.user.firstName || state.user.user_metadata?.firstName || ''} ${state.user.lastName || state.user.user_metadata?.lastName || ''}`.trim() : '',
  },
  actions: {
    async login(email, password) {
      // Try Supabase first
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error && data.user) {
        this.isDemo = false
        localStorage.removeItem('isDemo')
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()
        this.user = profile || data.user
        this.session = data.session
        localStorage.setItem('user', JSON.stringify(this.user))
        router.push('/app/dashboard')
        return { success: true, data: { user: this.user, accessToken: data.session?.access_token } }
      }

      // Fallback: demo mode
      const demo = DEMO_USERS[email]
      if (demo && demo.password === password) {
        this.isDemo = true
        localStorage.setItem('isDemo', 'true')
        this.user = { id: demo.id, email, role: demo.role, firstName: demo.firstName, lastName: demo.lastName }
        this.session = { access_token: 'demo-token' }
        localStorage.setItem('user', JSON.stringify(this.user))
        router.push('/app/dashboard')
        return { success: true, data: { user: this.user, accessToken: 'demo-token' } }
      }

      throw new Error(error?.message || 'Invalid login credentials')
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
      if (this.isDemo) return
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        this.user = profile || user
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },
    async logout() {
      if (!this.isDemo) {
        await supabase.auth.signOut()
      }
      this.user = null
      this.session = null
      this.isDemo = false
      localStorage.removeItem('user')
      localStorage.removeItem('isDemo')
      router.push('/login')
    },
    async initAuth() {
      if (this.isDemo) return
      const { data: { session } } = await supabase.auth.getSession()
      this.session = session
      if (session) {
        await this.fetchProfile()
      }
    },
  },
})
