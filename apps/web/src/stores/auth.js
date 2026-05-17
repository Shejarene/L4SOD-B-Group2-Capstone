import { defineStore } from 'pinia'
import { supabase } from '../utils/supabase'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    session: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.session || !!state.user,
    userRole: (state) => state.user?.role || state.user?.user_metadata?.role || null,
    fullName: (state) => state.user ? `${state.user.firstName || state.user.user_metadata?.firstName || ''} ${state.user.lastName || state.user.user_metadata?.lastName || ''}`.trim() : '',
  },
  actions: {
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error && error.code === 'email_not_confirmed') {
        const { data: profile, error: profileError } = await supabase
          .from('Users')
          .select('*')
          .eq('email', email)
          .eq('password', password)
          .eq('isActive', true)
          .single()

        if (profileError || !profile) {
          throw new Error('Invalid login credentials')
        }

        this.user = profile
        this.session = { access_token: 'pending-confirmation' }
        localStorage.setItem('user', JSON.stringify(this.user))
        router.push('/app/dashboard')
        return { success: true, data: { user: this.user, accessToken: 'pending-confirmation' } }
      }

      if (error) throw error
      if (!data.user) throw new Error('Login failed')

      const { data: profile } = await supabase
        .from('Users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      this.user = profile || data.user
      this.session = data.session
      localStorage.setItem('user', JSON.stringify(this.user))
      router.push('/app/dashboard')
      return { success: true, data: { user: this.user, accessToken: data.session?.access_token } }
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
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('Users')
          .select('*')
          .eq('id', user.id)
          .single()
        this.user = profile || user
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.session = null
      localStorage.removeItem('user')
      router.push('/login')
    },
    async initAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      this.session = session
      if (session) {
        await this.fetchProfile()
      }
    },
  },
})
