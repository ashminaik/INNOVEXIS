import { useState, useEffect } from 'react'
import axios from 'axios'
import './Auth.css'

function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  // Check for token in URL (Google OAuth callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    if (token) {
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
      onLoginSuccess(token)
    }
  }, [onLoginSuccess])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e, type) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = type === 'login' ? '/auth/login' : '/auth/register'
      const data = type === 'login'
        ? { email: formData.email, password: formData.password }
        : formData

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        data
      )

      onLoginSuccess(response.data.token)
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL
    window.location.href = `${apiUrl}/auth/google`
  }

  return (
    <div className="auth-container">
      <div className="auth-main">
        <input 
          type="checkbox" 
          id="chk" 
          checked={!isLogin}
          onChange={() => {
            setIsLogin(!isLogin)
            setError('')
          }}
          aria-hidden="true"
        />

        {/* Sign Up Form */}
        <div className="signup">
          <form onSubmit={(e) => handleSubmit(e, 'register')}>
            <label htmlFor="chk" aria-hidden="true">Sign up</label>
            
            {error && !isLogin && <div className="error-msg">{error}</div>}
            
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading && !isLogin ? 'Signing up...' : 'Sign up'}
            </button>
            
            <div className="google-divider">
              <span>or</span>
            </div>
            
            <button type="button" onClick={handleGoogleLogin} className="google-btn-slide">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>
          </form>
        </div>

        {/* Login Form */}
        <div className="login">
          <form onSubmit={(e) => handleSubmit(e, 'login')}>
            <label htmlFor="chk" aria-hidden="true">Login</label>
            
            {error && isLogin && <div className="error-msg">{error}</div>}
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading && isLogin ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="google-divider">
              <span>or</span>
            </div>
            
            <button type="button" onClick={handleGoogleLogin} className="google-btn-slide">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Auth
