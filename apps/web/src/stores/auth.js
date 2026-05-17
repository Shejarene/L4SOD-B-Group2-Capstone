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

      if (error) {
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
        this.session = { access_token: 'local-session' }
        localStorage.setItem('user', JSON.stringify(this.user))
        router.push('/app/dashboard')
        return { success: true, data: { user: this.user, accessToken: 'local-session' } }
      }

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
      if (!this.user?.id) return
      const { data: profile } = await supabase
        .from('Users')
        .select('*')
        .eq('id', this.user.id)
        .single()
      if (profile) {
        this.user = profile
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },
    async logout() {
      await supabase.auth.signOut().catch(() => {})
      this.user = null
      this.session = null
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
  },
})
