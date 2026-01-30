import { ref } from 'vue'

export const useAuth = () => {
  const user = ref<{ email: string } | null>(null)
  const isAuthenticated = ref(false)
  const { api } = useApi()

  // Check if user is logged in on mount
  const initAuth = () => {
    if (process.client) {
      console.log('[AUTH DEBUG] initAuth called')
      const token = localStorage.getItem('token')
      console.log('[AUTH DEBUG] Token from localStorage:', token ? '✓ Found' : '✗ Not found')
      if (token) {
        isAuthenticated.value = true
        const userEmail = localStorage.getItem('userEmail')
        console.log('[AUTH DEBUG] User email from localStorage:', userEmail)
        if (userEmail) {
          user.value = { email: userEmail }
          console.log('[AUTH DEBUG] Auth state restored for:', userEmail)
        }
      } else {
        console.log('[AUTH DEBUG] No token found, user not authenticated')
      }
    }
  }

  const register = async (email: string, password: string) => {
    try {
      console.log('[AUTH DEBUG] Registering with email:', email)
      const response = await api.post('/auth/register', { email, password })
      const token = response.data.token
      console.log('[AUTH DEBUG] Register response token:', token ? '✓ Received' : '✗ Missing')
      if (process.client) {
        localStorage.setItem('token', token)
        localStorage.setItem('userEmail', email)
        console.log('[AUTH DEBUG] Token and email saved to localStorage')
      }
      user.value = { email }
      isAuthenticated.value = true
      console.log('[AUTH DEBUG] Auth state updated, isAuthenticated =', isAuthenticated.value)
      return { success: true }
    } catch (error: any) {
      console.error('[AUTH DEBUG] Register error:', error.response?.data || error.message)
      const errorMsg = error.response?.data?.msg || error.response?.data?.error || error.message
      return { 
        success: false, 
        error: errorMsg
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('[AUTH DEBUG] Logging in with email:', email)
      const response = await api.post('/auth/login', { email, password })
      const token = response.data.token
      console.log('[AUTH DEBUG] Login response token:', token ? '✓ Received' : '✗ Missing')
      if (process.client) {
        localStorage.setItem('token', token)
        localStorage.setItem('userEmail', email)
        console.log('[AUTH DEBUG] Token and email saved to localStorage')
        console.log('[AUTH DEBUG] localStorage.token =', localStorage.getItem('token'))
      }
      user.value = { email }
      isAuthenticated.value = true
      console.log('[AUTH DEBUG] Auth state updated, isAuthenticated =', isAuthenticated.value)
      return { success: true }
    } catch (error: any) {
      console.error('[AUTH DEBUG] Login error:', error.response?.data || error.message)
      const errorMsg = error.response?.data?.msg || error.response?.data?.error || error.message
      return { 
        success: false, 
        error: errorMsg
      }
    }
  }

  const logout = () => {
    console.log('[AUTH DEBUG] Logout called')
    if (process.client) {
      console.log('[AUTH DEBUG] Clearing localStorage...')
      localStorage.removeItem('token')
      localStorage.removeItem('userEmail')
      console.log('[AUTH DEBUG] localStorage cleared')
    }
    user.value = null
    isAuthenticated.value = false
    console.log('[AUTH DEBUG] Auth state cleared, isAuthenticated =', isAuthenticated.value)
    console.log('[AUTH DEBUG] Redirecting to home...')
    navigateTo('/')
  }

  return {
    user,
    isAuthenticated,
    initAuth,
    register,
    login,
    logout,
  }
}
